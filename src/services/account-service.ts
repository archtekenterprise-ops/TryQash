import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

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
  const supabase = await createServerSupabaseClient();
  const serviceRole = getServiceRoleClient(); // Use service role to bypass RLS
  const providerReference = `TRYQASH-ACT-${userId}-${Date.now()}`;

  // 1. Enregistrement initial dans le "carnet de notes" (supabase) avec le statut 'pending'
  // Use service role client to bypass RLS for payment initiation
  const { error: dbError } = await serviceRole
    .from('activation_payments')
    .insert({
      user_id: userId,
      provider_reference: providerReference,
      amount: amount.toFixed(2), // SasPay requiert souvent un format décimal string
      currency: 'XOF', // West African CFA (correct currency for SasPay)
      status: 'pending',
      created_at: new Date().toISOString(),
    });

  if (dbError) {
    throw new Error(`Failed to create payment record: ${dbError.message}`);
  }

  // 2. Appel à l'API SasPay pour générer le lien de paiement ou initier le push MoMo
  const sasPayResponse = await fetch('https://api.saspay.me/api/v1/checkout-sessions/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SASPAY_SECRET_KEY}`, // Clé secrète strictement côté serveur
    },
    body: JSON.stringify({
      amount: amount.toFixed(2),
      currency: 'XOF',
      reference: providerReference,
      customer_email: email,
      customer_name: userName,
      description: "Activation de compte TryQash",
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/activate-account`,
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

  // Retourne les infos pour rediriger l'utilisateur vers le paiement
  // SasPay response is wrapped in paymentData.data
  const checkoutData = paymentData.data || paymentData;
  return {
    providerReference,
    sasPayId: checkoutData.id,
    paymentUrl: checkoutData.checkout_url,
  };
}