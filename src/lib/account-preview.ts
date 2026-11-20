import type { ReadonlyURLSearchParams } from "next/navigation";

const PREVIEW_KEYS = ["account", "emailVerified", "payment"] as const;

export function preserveAccountPreviewParams(
  href: string,
  searchParams: ReadonlyURLSearchParams,
): string {
  const params = new URLSearchParams();
  for (const key of PREVIEW_KEYS) {
    const value = searchParams.get(key);
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `${href}?${query}` : href;
}
