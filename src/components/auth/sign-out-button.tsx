"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/context";
import { signOut } from "@/services/auth.service";

/**
 * Signs the user out through the auth service and returns to /login.
 * Rendered only when a session exists.
 */
export function SignOutButton() {
  const router = useRouter();
  const t = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  async function handleSignOut() {
    setSubmitting(true);
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      loading={submitting}
      onClick={handleSignOut}
    >
      {t("common.signOut")}
    </Button>
  );
}
