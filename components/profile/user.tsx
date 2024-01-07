import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@/types";

type Props = {
  user: User;
};

export default function UserSection({ user }: Props) {
  const pathname = usePathname();

  return (
    <section className="sm:w-64 w-full flex flex-col items-center">
      <div className="space-y-2 py-6 border-b-2 border-zinc-300 w-full flex flex-col items-center">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name + " image"}
            width={128}
            height={128}
          />
        ) : (
          <div className="w-32 h-32 rounded-full flex items-center justify-center bg-zinc-200 shadow-sm">
            <User2 className="w-24 h-24 text-zinc-400" />
          </div>
        )}
        <p className="text-sm font-bold text-center break-words">{user.name}</p>
        <p className="text-sm text-center truncate">{user.email}</p>
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
        {user.type !== "admin" && (
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
        {user.type === "individual" && (
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
