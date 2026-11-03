"use client";

import { detectIdentifierKind, normalizeIdentifier } from "@/lib/identifier";
import {
  getBrowserSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/browser";
import type {
  AuthCredentials,
  AuthError,
  AuthResult,
  LoginCredentials,
  RegistrationDetails,
} from "@/types/auth";

/**
 * Authentication service.
 *
 * This is the ONLY place UI code talks to the auth provider (Supabase Auth).
 * Pages and forms call these functions and receive a typed AuthResult; they
 * never import Supabase directly. Messages the frontend owns are returned
 * as translation keys so they appear in the active language.
 *
 * Registration data flow (per the TryQash database plan):
 * - Email + password go to Supabase Auth. They are never stored in
 *   profiles by the frontend.
 * - username, country, and referral_code are passed as sign-up metadata
 *   (options.data), which Supabase stores in auth.users.raw_user_meta_data.
 *   The database trigger handle_new_user() consumes that metadata when it
 *   creates the profile, assigns the default "user" role, and resolves the
 *   submitted referral code.
 *
 * Current state: the code path is REAL but UNCONNECTED. When the Supabase
 * environment variables are missing, every function returns a
 * NOT_CONFIGURED result and nothing is simulated. Once valid credentials
 * exist in .env.local, these functions perform genuine Supabase Auth calls.
 */

function failure(error: AuthError): AuthResult {
  return { ok: false, error };
}

function notConfigured(): AuthResult {
  return failure({ code: "NOT_CONFIGURED", messageKey: "error.notConfigured" });
}

function connectionError(): AuthResult {
  return failure({ code: "PROVIDER", messageKey: "error.connection" });
}

/**
 * Deliberately generic so the form cannot be used to discover which
 * usernames or emails are registered.
 */
function invalidCredentials(): AuthResult {
  return failure({ code: "PROVIDER", messageKey: "error.invalidCredentials" });
}

/**
 * Name of the backend function that maps a username to the account's
 * email address so Supabase Auth can authenticate it.
 *
 * REQUIRED BACKEND DEPENDENCY: Supabase Auth has no concept of a username,
 * so username sign-in cannot work without this database function. It does
 * not exist yet; see docs/BACKEND_INTEGRATION.md for the proposed
 * SECURITY DEFINER definition.
 */
const LOGIN_IDENTIFIER_RPC = "resolve_login_identifier";

/** True when the RPC is missing rather than failing for another reason. */
function isMissingFunctionError(code?: string, message?: string): boolean {
  if (code === "PGRST202" || code === "42883") {
    return true;
  }
  const lower = (message ?? "").toLowerCase();
  return (
    lower.includes("could not find the function") ||
    lower.includes("does not exist")
  );
}

function isInvalidCredentialsMessage(message: string): boolean {
  return /invalid login credentials/i.test(message);
}

/**
 * Maps provider/database error messages to field-level errors where the
 * backend's message identifies the cause. Patterns are best-effort: the
 * exact wording depends on the handle_new_user() trigger, whose SQL is not
 * available in this repository. Unknown errors fall back to the provider's
 * own (untranslated) text.
 */
function mapSignUpError(message: string): AuthResult {
  const lower = message.toLowerCase();

  if (
    lower.includes("username") &&
    (lower.includes("duplicate") ||
      lower.includes("already exists") ||
      lower.includes("already taken") ||
      lower.includes("unique"))
  ) {
    return failure({
      code: "PROVIDER",
      field: "username",
      messageKey: "error.usernameTaken",
    });
  }

  if (lower.includes("already registered") || lower.includes("already in use")) {
    return failure({
      code: "PROVIDER",
      field: "email",
      messageKey: "error.emailTaken",
    });
  }

  if (lower.includes("referral")) {
    return failure({
      code: "PROVIDER",
      field: "referralCode",
      messageKey: "error.referralInvalid",
    });
  }

  return failure({ code: "PROVIDER", message });
}

/**
 * Signs in with an email address or a username.
 *
 * - Email goes straight to Supabase Auth.
 * - Username is first resolved to the account email through the backend
 *   function above, then authenticated normally.
 *
 * Resolution failures return the same generic message as a wrong password.
 */
export async function signInWithIdentifier(
  credentials: LoginCredentials,
): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return notConfigured();
  }

  const identifier = normalizeIdentifier(credentials.identifier);
  const kind = detectIdentifierKind(identifier);
  const supabase = getBrowserSupabaseClient();

  try {
    if (kind === "email") {
      const { error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: credentials.password,
      });
      if (!error) {
        return { ok: true };
      }
      return isInvalidCredentialsMessage(error.message)
        ? invalidCredentials()
        : failure({ code: "PROVIDER", message: error.message });
    }

    // Username: resolve to the account email, then authenticate.
    const { data, error } = await supabase.rpc(LOGIN_IDENTIFIER_RPC, {
      identifier,
    });

    if (error) {
      return isMissingFunctionError(error.code, error.message)
        ? failure({
            code: "PROVIDER",
            messageKey: "error.identifierLoginUnavailable",
          })
        : failure({ code: "PROVIDER", message: error.message });
    }

    const email = typeof data === "string" ? data.trim() : "";
    if (!email) {
      return invalidCredentials();
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: credentials.password,
    });

    if (!signInError) {
      return { ok: true };
    }

    return isInvalidCredentialsMessage(signInError.message)
      ? invalidCredentials()
      : failure({ code: "PROVIDER", message: signInError.message });
  } catch {
    return connectionError();
  }
}

/** Email-only sign-in. Prefer signInWithIdentifier for the login form. */
export async function signInWithPassword(
  credentials: AuthCredentials,
): Promise<AuthResult> {
  return signInWithIdentifier({
    identifier: credentials.email,
    password: credentials.password,
  });
}

/**
 * Registers an account with an email address and password. Profile fields
 * travel as sign-up metadata for the database trigger.
 */
export async function registerUser(
  details: RegistrationDetails,
): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return notConfigured();
  }

  // Keys match the metadata contract: username, country, referral_code.
  // Empty referral codes are omitted entirely.
  const data: Record<string, string> = {
    username: details.username,
    country: details.country,
  };
  const referralCode = details.referralCode?.trim();
  if (referralCode) {
    data.referral_code = referralCode;
  }

  try {
    const { error } = await getBrowserSupabaseClient().auth.signUp({
      email: details.email.trim(),
      password: details.password,
      options: {
        data,
        // Used when email confirmation is enabled; the code exchange
        // happens in src/app/auth/confirm/route.ts.
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/dashboard`,
      },
    });
    return error ? mapSignUpError(error.message) : { ok: true };
  } catch {
    return connectionError();
  }
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return notConfigured();
  }
  try {
    const redirectTo = `${window.location.origin}/auth/confirm?next=/reset-password`;
    const { error } =
      await getBrowserSupabaseClient().auth.resetPasswordForEmail(email, {
        redirectTo,
      });
    return error
      ? failure({ code: "PROVIDER", message: error.message })
      : { ok: true };
  } catch {
    return connectionError();
  }
}

export async function updatePassword(password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return notConfigured();
  }
  try {
    const { error } = await getBrowserSupabaseClient().auth.updateUser({
      password,
    });
    return error
      ? failure({ code: "PROVIDER", message: error.message })
      : { ok: true };
  } catch {
    return connectionError();
  }
}

/**
 * True when a browser session exists. Used by the reset-password page to
 * detect whether the visitor arrived via a valid recovery link.
 */
export async function hasActiveSession(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }
  try {
    const {
      data: { session },
    } = await getBrowserSupabaseClient().auth.getSession();
    return Boolean(session);
  } catch {
    return false;
  }
}

export async function signOut(): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return notConfigured();
  }
  try {
    const { error } = await getBrowserSupabaseClient().auth.signOut();
    return error
      ? failure({ code: "PROVIDER", message: error.message })
      : { ok: true };
  } catch {
    return connectionError();
  }
}
