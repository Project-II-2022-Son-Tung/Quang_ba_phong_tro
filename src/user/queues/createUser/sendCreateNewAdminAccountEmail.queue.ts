import Bull, { Queue } from 'bull';
import { sendCreateNewAdminAccountEmailProcessor } from './sendCreateNewAdminAccountEmail.processor';

export type sendCreateNewAdminAccountEmail = {
  user_email: string;
  user_fullname: string;
  user_type: string;
  user_raw_password: string;
};

export const sendCreateNewAdminAccountEmailQueue: Queue<sendCreateNewAdminAccountEmail> =
  new Bull('send-create-new-crm-user-account-email', {
    redis: {
      port: Number.parseInt(process.env.REDIS_PORT, 10),
      host: process.env.REDIS_HOST,
    },
  });

sendCreateNewAdminAccountEmailQueue.process(
  sendCreateNewAdminAccountEmailProcessor,
);
