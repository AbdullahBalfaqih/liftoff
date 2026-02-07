import { NextRequest, NextResponse } from 'next/server';
import { transporter } from '@/lib/nodemailer';
import jwt from 'jsonwebtoken';
import { format } from 'date-fns';

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createEmailHtml(code: string): string {
  const today = new Date();
  const formattedDate = format(today, 'PPPP');
  const formattedTime = format(today, 'p');

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #f0f0f0; background-color: #0a0a0a; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 30px;">
        <h1 style="color: #3EE8F5; text-align: center; font-family: 'Space Grotesk', sans-serif;">Welcome to Liftoff!</h1>
        <p style="text-align: center; font-size: 16px;">Thank you for signing up. Please use the verification code below to complete your registration.</p>
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 5px; background-color: #28292B; padding: 15px 25px; border-radius: 8px; display: inline-block;">
            ${code}
          </p>
        </div>
        <p style="text-align: center;">This code will expire in 10 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
        <div style="text-align: center; font-size: 12px; color: #888;">
          <p>Request received on: ${formattedDate} at ${formattedTime}</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} Liftoff. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const verificationCode = generateVerificationCode();
    
    const token = jwt.sign({ email, code: verificationCode }, jwtSecret, {
      expiresIn: '10m',
    });

    await transporter.sendMail({
      from: `Liftoff <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Liftoff Verification Code',
      html: createEmailHtml(verificationCode),
    });

    return NextResponse.json({ success: true, verificationToken: token });
  } catch (error) {
    console.error('Error in send-verification route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to send verification email.', details: errorMessage }, { status: 500 });
  }
}
