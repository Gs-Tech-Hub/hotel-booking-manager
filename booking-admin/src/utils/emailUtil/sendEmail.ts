import axios from 'axios';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

const sendResendEmail = async ({ to, subject, html }: EmailParams) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'Your App <no-reply@yourdomain.com>', // Must be a verified domain
        to,
        subject,
        html,
      },
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
