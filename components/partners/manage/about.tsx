import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User2 } from "lucide-react";

import { cn, getStatus } from "@/lib/utils";

type Props = {
  merchant: any;
};

export default function UserSection({ merchant }: Props) {
  const search = useSearchParams();
  const status = getStatus();
  const user = merchant.contactInformation.person;

  return (
    <section className="sm:w-64 w-full flex flex-col items-center">
      <div className="space-y-2 py-6 border-b-2 border-zinc-300 w-full flex flex-col items-center">
        <div className="w-32 h-32 rounded-full flex items-center justify-center bg-zinc-200 shadow-sm">
          <User2 className="w-24 h-24 text-zinc-400" />
        </div>
        <p className="text-sm font-bold text-center break-words">
          {`${user.firstName || "N/A"} ${user.lastName || ""}`}
        </p>
        <p className="text-sm text-center truncate">{user.email}</p>
        <span
          className="px-2.5 py-1 text-xs rounded-full whitespace-nowrap capitalize"
          style={{
            color: status[merchant.status as keyof typeof status].color,
            backgroundColor:
              status[merchant.status as keyof typeof status].bgColor,
          }}
        >
          {merchant.status.replace("-", " ")}
        </span>
      </div>
      <div className="p-5 flex flex-col items-center gap-3 w-full">
        <Link
          href={`/partners/${merchant.id}/manage-partner`}
          className={cn(
            "text-sm transition-colors rounded-md w-full font-bold text-white py-3 inline-flex items-center justify-center",
            !search.get("tab")
              ? "bg-primary pointer-events-none"
              : " bg-primary-darker-muted/80 hover:bg-primary-darker-muted"
          )}
        >
          User Information
        </Link>
        <Link
          href={`/partners/${merchant.id}/manage-partner?tab=business`}
          className={cn(
            "text-sm transition-colors rounded-md w-full font-bold text-white py-3 inline-flex items-center justify-center",
            search.get("tab") === "business"
              ? "bg-primary pointer-events-none"
              : " bg-primary-darker-muted/80 hover:bg-primary-darker-muted"
          )}
        >
          Business Information
        </Link>
        {merchant.type === "individual" && (
          <Link
            href={`/partners/${merchant.id}/manage-partner?tab=guarantor`}
            className={cn(
              "text-sm transition-colors rounded-md w-full font-bold text-white py-3 inline-flex items-center justify-center",
              search.get("tab") === "guarantor"
                ? "bg-primary pointer-events-none"
                : " bg-primary-darker-muted/80 hover:bg-primary-darker-muted"
            )}
          >
            Guarantor Information
          </Link>
        )}
      </div>
    </section>
  );
}
