'use server';

import { ensureUserIsActive } from "@/services/account-service";

/**
 * Règle 2: Garde les portes verrouillées sur le serveur.
 */
export async function performRestrictedAction() {
  const isActive = await ensureUserIsActive();

  if (!isActive) {
    return {
      success: false,
      error: 'ACCOUNT_LOCKED',
      message: "Accès refusé : votre compte est en attente d'activation (Pending). Veuillez procéder au paiement.",
    };
  }

  // Logique métier réservée uniquement aux utilisateurs actifs
  try {
    // ... Le code métier sécurisé ...
    return { success: true, message: "Action exécutée avec succès." };
  } catch (error) {
    return { success: false, error: 'SERVER_ERROR' };
  }
}