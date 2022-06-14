import { createReadStream, unlink } from 'fs';
import { Job } from 'bull';
import axios from 'axios';
import FormData from 'form-data';
import { response } from 'express';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { TicketModel } from '../../ticket.model';
import { CreateTicketQueueData } from './createTicket.queue';
import { TicketStatus } from '../../../ticket/ticket-status.enum';

export async function createTicketProcessor(job: Job<CreateTicketQueueData>) {
  try {
    const { data } = job;
    const { title, type, object, content, user } = data;

    const countTickets = await TicketModel.estimatedDocumentCount().exec();
    const create_time = new Date();
    const last_reply = create_time;
    const open_status = TicketStatus.OPEN;
    const newTicket = new TicketModel({
      ticket_id: `TICK${(countTickets + 1).toString().padStart(8, '0')}`,
      user_id: user,
      title,
      type,
      object,
      content,
      status: open_status,
      create_time,
      last_reply,
    });
    if (data.attachment) {
      try {
        const form = new FormData();
        form.append('objectType', 'ticket');
        form.append('objectId', newTicket._id.toString());
        form.append('file', createReadStream(data.attachment.path));
        const mediaResponse = await axios.post<string>(
          `${process.env.MEDIA_ROOT_URL}/file`,
          form,
          {
            headers: { ...form.getHeaders() },
          },
        );
        newTicket.attachment = mediaResponse.data;
      } catch (e) {
        throw new BadRequestError(e.message);
      } finally {
        unlink(data.attachment.path, () => null);
      }
    }
    response.status(201);
    return newTicket.save();
  } catch (e) {
    if (e instanceof NotFoundError) return new NotFoundError(e.message);
    return new BadRequestError(e.message);
  }
}
