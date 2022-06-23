import Bull, { Queue } from 'bull';
import { Types } from 'mongoose';
import { CreateTicketDto } from '../../dtos/createTicket.dto';
import { createTicketProcessor } from './createTicket.processor';

export type CreateTicketQueueData = CreateTicketDto & {
  user: Types.ObjectId;
  attachment: Express.Multer.File;
};

// TODO: Move redis config or generic queue constructor to a separate file
export const createTicketQueue: Queue<CreateTicketQueueData> = new Bull(
  'create-ticket',
  {
    redis: {
      port: Number.parseInt(process.env.REDIS_PORT, 10),
      host: process.env.REDIS_HOST,
    },
  },
);

createTicketQueue.process(createTicketProcessor);
