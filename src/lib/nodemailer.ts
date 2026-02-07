import nodemailer from 'nodemailer';

const email = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!email || !pass) {
  // This check is important for server-side environments.
  // We don't want to throw an error during build time, so we log it.
  console.warn('Email credentials (EMAIL_USER, EMAIL_PASS) are not set in environment variables. Email sending will fail.');
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: pass,
  },
});
