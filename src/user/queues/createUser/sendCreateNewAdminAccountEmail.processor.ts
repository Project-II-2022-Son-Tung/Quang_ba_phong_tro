import { Job } from 'bull';
import { BadRequestError } from 'routing-controllers';
import { sendCreateNewAdminAccountEmail } from './sendCreateNewAdminAccountEmail.queue';
import { Mailer } from '../../../helper/mailer';

export async function sendCreateNewAdminAccountEmailProcessor(
  job: Job<sendCreateNewAdminAccountEmail>,
): Promise<void> {
  try {
    const { data } = job;
    const { user_email, user_fullname, user_type, user_raw_password } = data;
    await Mailer.createCrmUserAccount(
      user_email,
      user_fullname,
      user_type,
      user_raw_password,
    );
  } catch (e) {
    throw new BadRequestError(e.message);
  }
}
