import Bull, { Queue } from 'bull';
import { sendCreateUserVerifyEmailProcessor } from './sendCreateUserVerifyEmail.processor';

export type sendCreateUserVerifyEmail = {
  user_email: string,
  user_fullname:string,
  redirect_link:string
};

export const sendCreateUserVerifyEmailQueue: Queue<sendCreateUserVerifyEmail> = new Bull(
  'send-create-user-verify-email',
  {
    redis: {
      port: Number.parseInt(process.env.REDIS_PORT, 10),
      host: process.env.REDIS_HOST,
    },
  },
);

sendCreateUserVerifyEmailQueue.process(sendCreateUserVerifyEmailProcessor);
