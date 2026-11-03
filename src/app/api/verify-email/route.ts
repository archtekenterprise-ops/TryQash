import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * POST /api/verify-email
 *
 * Verifies a user's email using Supabase's built-in email confirmation.
 * The frontend sends the email and the confirmation token from the email link.
 *
 * Note: This uses Supabase's native email verification, not a custom OTP system.
 * The frontend should redirect users to the email confirmation link sent by Supabase.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    // Validate input
    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and token are required' },
        { status: 400 }
      );
    }

    // Use server client to verify the email with Supabase
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      console.error('Error verifying email:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to verify email' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Error in verify-email endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


