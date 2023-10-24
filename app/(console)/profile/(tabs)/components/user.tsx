"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { User2 } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/app/utils";

export default function UserSection() {
  const router = useRouter();
  const pathname = usePathname();
  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login?callback=/profile");
    },
  });

  return (
    <section className="sm:w-64 w-full flex flex-col items-center">
      <div className="space-y-2 py-6 border-b-2 border-zinc-300 w-full flex flex-col items-center">
        {data?.user.image ? (
          <Image
            src={data.user.image}
            alt={data.user.name + " image"}
            width={128}
            height={128}
          />
        ) : (
          <div className="w-32 h-32 rounded-full flex items-center justify-center bg-zinc-200 shadow-sm">
            <User2 className="w-24 h-24 text-zinc-400" />
          </div>
        )}
        <p className="text-sm font-bold text-center break-words">
          {data?.user.name}
        </p>
        <p className="text-sm text-center truncate">{data?.user.email}</p>
      </div>
      <div className="p-5 flex flex-col items-center gap-3 w-full">
        <Link
          href="/profile"
          className={cn(
            "text-sm transition-colors rounded-md w-full font-bold text-white py-3 inline-flex items-center justify-center",
            pathname === "/profile"
              ? "bg-primary pointer-events-none"
              : " bg-primary-darker-muted/80 hover:bg-primary-darker-muted"
          )}
        >
          User Information
        </Link>
        {data?.user.type !== "admin" && status !== "loading" && (
          <Link
            href="/profile/merchants"
            className={cn(
              "text-sm transition-colors rounded-md w-full font-bold text-white py-3 inline-flex items-center justify-center",
              pathname === "/profile/merchants"
                ? "bg-primary pointer-events-none"
                : " bg-primary-darker-muted/80 hover:bg-primary-darker-muted"
            )}
          >
            Business Information
          </Link>
        )}
        {data?.user.type === "individual" && status !== "loading" && (
          <Link
            href="/profile/guarantor"
            className={cn(
              "text-sm transition-colors rounded-md w-full font-bold text-white py-3 inline-flex items-center justify-center",
              pathname === "/profile/guarantor"
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
