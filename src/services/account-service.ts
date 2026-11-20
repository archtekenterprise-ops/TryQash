import { createServerSupabaseClient } from "@/lib/supabase/server";

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
export async function initiateSasPayActivation(userId: string, email: string, amount: number = 1000) {
  const supabase = await createServerSupabaseClient();
  const providerReference = `TRYQASH-ACT-${userId}-${Date.now()}`;

  // 1. Enregistrement initial dans le "carnet de notes" (supabase) avec le statut 'pending'
  const { error: dbError } = await supabase
    .from('activation_payments')
    .insert({
      user_id: userId,
      provider_reference: providerReference,
      amount: amount.toFixed(2), // SasPay requiert souvent un format décimal string
      currency: 'XAF', // Ou la devise utilisée au Cameroun
      status: 'pending',
      created_at: new Date().toISOString(),
    });

  if (dbError) {
    throw new Error(`Failed to create payment record: ${dbError.message}`);
  }

  // 2. Appel à l'API SasPay pour générer le lien de paiement ou initier le push MoMo
  const sasPayResponse = await fetch('https://api.saspay.io/v1/payments', { // URL d'exemple selon l'API SasPay
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SASPAY_SECRET_KEY}`, // Clé secrète strictement côté serveur
    },
    body: JSON.stringify({
      amount: amount.toFixed(2),
      currency: 'XAF',
      reference: providerReference,
      customer_email: email,
      description: "Activation de compte TryQash",
    }),
  });

  const paymentData = await sasPayResponse.json();

  if (!sasPayResponse.ok) {
    throw new Error(`SasPay initialization failed: ${paymentData.message || 'Unknown error'}`);
  }

  // Retourne les infos pour rediriger l'utilisateur vers le paiement
  return {
    providerReference,
    paymentUrl: paymentData.payment_url || paymentData.checkout_url,
  };
}