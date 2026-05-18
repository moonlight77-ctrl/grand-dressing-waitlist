'use server';

import { Resend } from 'resend';
import { signupConfirmationEmail } from '@/lib/emails/templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSignupConfirmationEmail(email: string, confirmUrl: string) {
  try {
    await resend.emails.send({
      from: 'Gradora <contact@gradora.fr>',
      to: email,
      subject: 'Confirmez votre accès · Gradora',
      html: signupConfirmationEmail(confirmUrl),
    });
  } catch (err) {
    console.error('Signup email error:', err);
  }
}