/* eslint-disable */
import axios from 'axios';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: string; contentType: string }[];
}

export const sendResendEmail = async ({ to, subject, html, attachments }: EmailParams) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  try {
    const payload: any = {
      from: 'Your App <no-reply@yourdomain.com>', // Must be a verified domain
      to,
      subject,
      html,
    };
    if (attachments) {
      payload.attachments = attachments;
    }

    const response = await axios.post(
      'https://api.resend.com/emails',
      payload,
      {
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Email sent via Resend:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Resend email error:', ${error}.response?.data || ${error}.message`);
    throw new Error('Failed to send email via Resend');
  }
};

module.exports = sendResendEmail;
