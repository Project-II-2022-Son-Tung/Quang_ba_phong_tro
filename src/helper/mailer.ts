/* eslint-disable consistent-return */
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { readFileSync } from 'fs';

class Mailer {
  private static readonly host = process.env.MAIL_HOST as string;

  private static readonly port = process.env.MAIL_PORT as string;

  private static readonly user = process.env.MAIL_USER as string;

  private static readonly password = process.env.MAIL_PASS as string;

  public static async createNewUser(
    receiver: string,
    name: string,
    active_link: string,
  ) {
    const filePath = `${process.env.HTML_FILES_ROOT}/registerTemplate.html`;
    const source = readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      user_name: `${name}`,
      user_email: `${receiver}`,
      active_link: `${active_link}`,
    };
    const htmlToSend = template(replacements);
    const transporter = nodemailer.createTransport({
      host: Mailer.host,
      port: parseInt(Mailer.port, 10),
      secure: false,
      auth: {
        user: Mailer.user,
        pass: Mailer.password,
      },
    });
    const option = {
      from: `"Niubi.vn" <${Mailer.user}>`,
      to: receiver,
      subject: 'Đăng ký tài khoản mới tại Niubi.vn',
      html: htmlToSend,
    };
    await transporter.sendMail(option);
  }

  public static async verifySucceed(receiver: string, name: string) {
    const filePath = `${process.env.HTML_FILES_ROOT}/activationConfirmTemplate.html`;
    const source = readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      user_name: `${name}`,
      user_email: `${receiver}`,
    };
    const htmlToSend = template(replacements);
    const transporter = nodemailer.createTransport({
      host: Mailer.host,
      port: parseInt(Mailer.port, 10),
      secure: false,
      auth: {
        user: Mailer.user,
        pass: Mailer.password,
      },
    });
    const option = {
      from: `"Niubi.vn" <${Mailer.user}>`,
      to: receiver,
      subject: 'Kích hoạt tài khoản thành công',
      html: htmlToSend,
    };
    await transporter.sendMail(option);
  }

  public static async resetPassword(
    receiver: string,
    name: string,
    active_token: string,
  ) {
    const filePath = `${process.env.HTML_FILES_ROOT}/resetPasswordTemplate.html`;
    const source = readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      user_name: `${name}`,
      user_email: `${receiver}`,
      verify_token_site: `${process.env.CRM_WEBSITE_DOMAIN_PATH}/account/forgot-password/verify/${active_token}`,
    };
    const htmlToSend = template(replacements);
    const transporter = nodemailer.createTransport({
      host: Mailer.host,
      port: parseInt(Mailer.port, 10),
      secure: false,
      auth: {
        user: Mailer.user,
        pass: Mailer.password,
      },
    });
    const option = {
      from: `"Niubi.vn" <${Mailer.user}>`,
      to: receiver,
      subject: 'Reset mật khẩu tài khoản',
      html: htmlToSend,
    };
    await transporter.sendMail(option);
  }
}

export { Mailer };
