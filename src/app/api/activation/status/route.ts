import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/activation/status
 *
 * Checks the status of the user's activation payment.
 * Called by the frontend to show payment status (pending, successful, failed, cancelled).
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the most recent payment attempt
    const { data: payment } = await supabase
      .from('activation_payments')
      .select('status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!payment) {
      return NextResponse.json({
        success: true,
        data: { status: 'not_started' },
      });
    }

    return NextResponse.json({
      success: true,
      data: { status: payment.status },
    });
  } catch (error) {
    console.error('Error checking activation status:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
