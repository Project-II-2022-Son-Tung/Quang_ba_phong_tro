import { createReadStream, unlink } from 'fs';
import { Job } from 'bull';
import axios from 'axios';
import FormData from 'form-data';
import { BadRequestError, HttpError } from 'routing-controllers';
import { sendCreateUserVerifyEmail } from './sendCreateUserVerifyEmail.queue';
import { Mailer } from '../../../helper/mailer';

export async function sendCreateUserVerifyEmailProcessor(
  job: Job<sendCreateUserVerifyEmail>,
): Promise<void> {
  try {
    const { data } = job;
    const { user_email, user_fullname, redirect_link } = data;
    await Mailer.createNewUser(user_email, user_fullname, redirect_link);
  } catch (e) {
    throw new BadRequestError(e.message);
  }
}
