import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

// Set to true to mock SasPay API for testing without real credentials
const MOCK_SASPAY_MODE = true;

export type AccountStatus = 'pending' | 'active' | 'suspended' | 'banned';

/**
 * Règle 2: Vérifie si le compte utilisateur est actif (La porte est-elle ouverte ?)
 */
export async function ensureUserIsActive(): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .single();

    return profile?.status === 'active';
  } catch (error) {
    console.error('Error checking account status:', error);
    return false;
  }
}

/**
 * Règle 3: Crée la tentative de paiement et initialise la transaction avec SasPay
 */
export async function initiateSasPayActivation(userId: string, email: string, userName: string, amount: number = 1000) {
  const serviceRole = getServiceRoleClient(); // Use service role to bypass RLS
  const providerReference = `TRYQASH-ACT-${userId}-${Date.now()}`;

  // 1. Appel à l'API SasPay pour générer le lien de paiement ou initier le push MoMo
  // Environment is derived from the key prefix: sk_live_* → production API,
  // sk_test_* → sandbox. Works regardless of NODE_ENV (e.g. next dev in Docker).
  const isLiveKey = (process.env.SASPAY_SECRET_KEY || '').startsWith('sk_live');
  const baseUrl = isLiveKey
    ? 'https://api.saspay.me/api/v1/checkout-sessions/'
    : 'https://sandbox-api.saspay.me/api/v1/checkout-sessions/';
  
  const sasPayResponse = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SASPAY_SECRET_KEY}`, // Clé secrète strictement côté serveur
    },
    body: JSON.stringify({
      amount: amount.toFixed(2),
      currency: 'XOF',
      customer_email: email,
      customer_name: userName,
      description: "Activation de compte TryQash",
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/activate-account`,
      // Checkout sessions don't accept a custom reference — carry ours in
      // metadata so it can be echoed back on the transaction/webhook.
      metadata: {
        reference: providerReference,
        user_id: userId,
      },
    }),
  });

  const paymentData = await sasPayResponse.json();

  if (!sasPayResponse.ok) {
    console.error('SasPay API error:', {
      status: sasPayResponse.status,
      statusText: sasPayResponse.statusText,
      body: paymentData,
    });
    throw new Error(`SasPay initialization failed: ${JSON.stringify(paymentData)}`);
  }

  // The checkout-session response has no `reference` field — the transaction
  // reference is only generated later, when the customer pays. What we CAN
  // store now is the session `id`; the webhook resolves it via
  // GET /checkout-sessions/{id}/status/ (transaction_id / transaction_reference).
  const checkoutData = paymentData.data || paymentData;
  const sasPaySessionId = checkoutData.id;

  if (!sasPaySessionId) {
    throw new Error(`SasPay response missing session id: ${JSON.stringify(paymentData)}`);
  }

  // 2. Enregistrement initial dans le "carnet de notes" (supabase) avec le statut 'pending'
  // Use SasPay's session id instead of our generated reference
  const { error: dbError } = await serviceRole
    .from('activation_payments')
    .insert({
      user_id: userId,
      provider_reference: sasPaySessionId, // SasPay checkout session UUID
      amount: amount.toFixed(2), // SasPay requiert souvent un format décimal string
      currency: 'XAF', // Display currency for users
      status: 'pending',
      created_at: new Date().toISOString(),
    });

  if (dbError) {
    throw new Error(`Failed to create payment record: ${dbError.message}`);
  }

  // Retourne les infos pour rediriger l'utilisateur vers le paiement
  return {
    providerReference: sasPaySessionId, // SasPay session id stored in DB
    sasPayId: sasPaySessionId,
    paymentUrl: checkoutData.checkout_url,
  };
}