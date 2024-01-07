import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-5 justify-center my-16">
      <Link
        href="/faqs"
        className={cn("text-lg font-bold leading-none", {
          "text-primary": pathname === "/faqs",
        })}
      >
        FAQs
      </Link>
      <span className="font-bold text-primary leading-none text-xl">|</span>
      <Link
        href="/terms"
        className={cn("text-lg font-bold leading-none", {
          "text-primary": pathname === "/terms",
        })}
      >
        Terms & Conditions
      </Link>
      <span className="font-bold text-primary leading-none text-xl">|</span>
      <Link
        href="/privacy-policy"
        className={cn("text-lg font-bold leading-none", {
          "text-primary": pathname === "/privacy-policy",
        })}
      >
        Privacy Policy
      </Link>
    </div>
  );
}
