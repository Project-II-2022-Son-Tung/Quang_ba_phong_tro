import Bull, { Queue } from 'bull';
import { Types } from 'mongoose';
import { CreateTicketMessageDto } from '../../dtos/createTicketMessage.dto';
import { createTicketMessageProcessor } from './createTicketMessage.processor';

export type CreateTicketMessageQueueData = CreateTicketMessageDto & {
  user: Types.ObjectId;
  attachment: Express.Multer.File;
};

// TODO: Move redis config or generic queue constructor to a separate file
export const createTicketMessageQueue: Queue<CreateTicketMessageQueueData> = new Bull(
  'create-ticket-message',
  {
    redis: {
      port: Number.parseInt(process.env.REDIS_PORT, 10),
      host: process.env.REDIS_HOST,
    },
  },
);

createTicketMessageQueue.process(createTicketMessageProcessor);
