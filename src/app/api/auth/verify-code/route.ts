import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { verificationToken, code } = await req.json();

    if (!verificationToken || !code) {
      return NextResponse.json({ error: 'Verification token and code are required' }, { status: 400 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(verificationToken, jwtSecret);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 400 });
    }

    if (decoded.code === code) {
      return NextResponse.json({ success: true, email: decoded.email });
    } else {
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in verify-code route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to verify code.', details: errorMessage }, { status: 500 });
  }
}
