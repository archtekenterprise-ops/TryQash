/**
 * Login identifier handling.
 *
 * TryQash lets a user sign in with their email address or username.
 * Supabase Auth itself only authenticates by email and has no concept of a
 * username, so the frontend first classifies what the user typed and then
 * takes the matching path (see src/services/auth.service.ts).
 */

export type IdentifierKind = "email" | "username";

/**
 * Classifies a login identifier: anything containing "@" is treated as an
 * email address, everything else as a username.
 */
export function detectIdentifierKind(value: string): IdentifierKind {
  return value.trim().includes("@") ? "email" : "username";
}

/**
 * Returns the identifier in the form the backend should receive: trimmed.
 */
export function normalizeIdentifier(value: string): string {
  return value.trim();
}
