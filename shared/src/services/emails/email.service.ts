import { Resend } from 'resend';
import { EmailsInterface } from '@interfaces/emails.interface';
import path from 'path';
import { loadTemplate } from '@helpers/emails/loadTemplate';

export const emailService = async (data: EmailsInterface) => {
  const resend = new Resend(process.env.RESEND_API);
  const fromString: string = process.env.FROM_RESEND || '';
  const sendHtml = path.join(__dirname, '../../template', data.template); 
  const htmlContent = loadTemplate(sendHtml, data.variables || {});

  resend.emails.send({
    from: fromString,
    to: data.email,
    subject: data.subject,
    html: htmlContent,
  });
};