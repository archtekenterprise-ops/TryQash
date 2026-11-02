import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

/**
 * POST /api/auth/check-phone
 *
 * Checks if a phone number is already taken by another user.
 * Used during registration to prevent duplicate phone numbers.
 *
 * Security: This endpoint uses the service role key and is server-only.
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

    // Basic phone format validation (E.164 format)
    if (!/^\+[1-9][0-9]{7,14}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Call the Supabase function phone_taken using service role client
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase.rpc('phone_taken', {
      p_phone: phone,
    });

    if (error) {
      console.error('Error checking phone:', error);
      return NextResponse.json(
        { error: 'Failed to check phone number' },
        { status: 500 }
      );
    }

    // Return whether the phone is taken
    return NextResponse.json({ taken: data });
  } catch (error) {
    console.error('Error in check-phone endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
