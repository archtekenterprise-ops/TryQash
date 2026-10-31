import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

/**
 * POST /api/auth/resolve-phone
 *
 * Resolves a phone number to the associated email address.
 * This is used for phone login - the server finds the email that owns the phone,
 * then the frontend signs in with that email and the password.
 *
 * Security: This endpoint uses the service role key and is server-only.
 * The phone-to-email lookup should never be exposed to the browser.
 */
export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    // Validate phone number format
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Basic phone format validation (E.164 format: + followed by 8-15 digits)
    if (!/^\+[1-9][0-9]{7,14}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Call the Supabase function email_for_phone using service role client
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase.rpc('email_for_phone', {
      p_phone: phone,
    });

    if (error) {
      console.error('Error resolving phone to email:', error);
      return NextResponse.json(
        { error: 'Failed to resolve phone number' },
        { status: 500 }
      );
    }

    // If no email found, return a generic error (don't reveal whether phone exists)
    if (!data) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return the email (frontend will use this for sign-in)
    return NextResponse.json({ email: data });
  } catch (error) {
    console.error('Error in resolve-phone endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
