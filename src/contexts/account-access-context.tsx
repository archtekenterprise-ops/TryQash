"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { AccountAccessState } from "@/types/account";

const AccountAccessContext = createContext<AccountAccessState | null>(null);

/**
 * Makes the server-loaded account snapshot available to the sidebar,
 * activation prompt, and earning-service actions without scattered props.
 */
export function AccountAccessProvider({
  state,
  children,
}: {
  state: AccountAccessState | null;
  children: ReactNode;
}) {
  return (
    <AccountAccessContext.Provider value={state}>
      {children}
    </AccountAccessContext.Provider>
  );
}

/** Null when no verified account snapshot is available. */
export function useAccountAccess(): AccountAccessState | null {
  return useContext(AccountAccessContext);
}
