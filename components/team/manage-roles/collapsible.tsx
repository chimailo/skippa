import { ReactNode, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Role } from "@/types";

export function RoleCollapsible({ children }: { children: ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function RoleCollapsibleTrigger({
  children,
  collapsible,
  toggle,
  type,
}: {
  type: "default" | "custom";
  children: ReactNode;
  collapsible: { default: boolean; custom: boolean };
  toggle: (type: "default" | "custom") => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full px-5 hover:bg-zinc-100 justify-between font-bold text-lg capitalize"
      onClick={() => toggle(type)}
    >
      {children}
      <ChevronRight
        className={cn(
          "w-5 h-5 transition-transform text-primary",
          collapsible[type] && "rotate-90"
        )}
      />
    </Button>
  );
}

export function RoleCollapsibleContent({
  roles,
  type,
  collapsible,
}: {
  roles: Role[];
  type: "default" | "custom";
  collapsible: { default: boolean; custom: boolean };
}) {
  const search = useSearchParams();
  const id = search.get("role");

  return (
    <ul
      className={cn(
        collapsible[type] ? "h-auto max-h-[9999px]" : "max-h-0 overflow-hidden",
        "transition-all"
      )}
    >
      {roles.map((role) => (
        <li key={role.id as string}>
          <Link
            href={`/team/manage-roles?role=${role.id}`}
            className={cn(
              "block hover:bg-zinc-100 px-9 py-2.5 w-full truncate",
              id && id === role.id && "bg-zinc-200"
            )}
          >
            {role.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
