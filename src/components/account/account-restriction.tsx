"use client";

import { Ban, CircleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { useTranslation } from "@/i18n/context";
import { preserveAccountPreviewParams } from "@/lib/account-preview";
import type { AccountStatus } from "@/types/account";

/**
 * Shared restricted-account experience for suspended and banned users.
 * Direct navigation to dashboard/service routes renders this instead of the
 * restricted content. Support remains available through /help.
 */
export function AccountRestriction({
  status,
}: {
  status: Extract<AccountStatus, "suspended" | "banned">;
}) {
  const t = useTranslation();
  const searchParams = useSearchParams();
  const banned = status === "banned";
  const Icon = banned ? Ban : CircleAlert;

  return (
    <div className="mx-auto max-w-xl py-10 sm:py-16">
      <Card className="text-center">
        <span
          className={`mx-auto inline-flex size-11 items-center justify-center rounded-full ${
            banned
              ? "bg-error-soft text-error-foreground"
              : "bg-warning-soft text-warning-foreground"
          }`}
        >
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-heading">
          {t(banned ? "restriction.bannedTitle" : "restriction.suspendedTitle")}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          {t(banned ? "restriction.bannedBody" : "restriction.suspendedBody")}
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href={preserveAccountPreviewParams("/help", searchParams)}
            className={buttonClasses({ variant: "secondary" })}
          >
            {t("restriction.contactSupport")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
