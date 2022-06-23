import { createReadStream, unlink } from 'fs';
import { Job } from 'bull';
import axios from 'axios';
import FormData from 'form-data';
import { response } from 'express';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { TicketModel } from '../../ticket.model';
import { CreateTicketMessageQueueData } from './createTicketMessage.queue';
import { Ticket_MessageModel } from '../../../ticket-message/ticket-message.model';

export async function createTicketMessageProcessor(
  job: Job<CreateTicketMessageQueueData>,
) {
  try {
    const { data } = job;
    const { ticket_id: ticketID, message, attachment, user } = data;

    const create_time = new Date();
    const ticket = await TicketModel.findOne({
      _id: ticketID,
    });
    const newTicketMessage = new Ticket_MessageModel({
      ticket_id: ticketID,
      user_id: user,
      content: message,
      create_time,
    });
    if (attachment) {
      try {
        const form = new FormData();
        form.append('objectType', 'ticket-message');
        form.append('objectId', newTicketMessage._id.toString());
        form.append('file', createReadStream(attachment.path));
        const mediaResponse = await axios.post<string>(
          `${process.env.MEDIA_ROOT_URL}/file`,
          form,
          {
            headers: { ...form.getHeaders() },
          },
        );
        newTicketMessage.attachment = mediaResponse.data;
      } catch (e) {
        throw new BadRequestError(e.message);
      } finally {
        unlink(attachment.path, () => null);
      }
    }
    response.status(201);
    await newTicketMessage.save();
    await ticket.updateOne({ last_reply: create_time });
    return newTicketMessage;
  } catch (e) {
    if (e instanceof NotFoundError) return new NotFoundError(e.message);
    return new BadRequestError(e.message);
  }
}
