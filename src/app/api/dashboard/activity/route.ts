import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/dashboard/activity
 *
 * Fetches the user's recent earning activity from the ledger.
 * Returns recent transactions with descriptions and amounts.
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Use server client to verify the token and get the user
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Fetch recent ledger entries
    const { data: ledger, error: ledgerError } = await supabase
      .from('ledger_entries')
      .select('entry_type, amount, note, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (ledgerError) {
      console.error('Error fetching activity:', ledgerError);
      return NextResponse.json(
        { error: 'Failed to fetch activity' },
        { status: 500 }
      );
    }

    // Format the activity for the frontend
    const activity = ledger?.map(entry => ({
      type: entry.entry_type,
      amount: entry.amount,
      description: entry.note || entry.entry_type,
      date: entry.created_at,
    })) || [];

    return NextResponse.json({ activity });
  } catch (error) {
    console.error('Error in activity endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
