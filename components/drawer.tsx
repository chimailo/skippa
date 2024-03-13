import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

export const Drawer = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Menu"
          className="lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <nav className="mt-16">
          <Link
            href="/faqs"
            className="p-4 sm:px-6 my-4 leading-none transition-colors block font-semibold"
          >
            FAQs
          </Link>
          <Link
            href="/about"
            className="p-4 sm:px-6 my-4 capitalize leading-none transition-colors block font-semibold"
          >
            About us
          </Link>
          <Link
            href="/terms"
            className="p-4 sm:px-6 my-4 capitalize leading-none transition-colors block font-semibold"
          >
            terms & conditions
          </Link>
        </nav>
        <div className="my-8 space-y-5">
          <Button
            asChild
            variant="outline"
            className="text-primary font-bold gap-2 hover:bg-primary hover:text-white border-primary block text-center my-6"
          >
            <Link href="/login">Log In</Link>
          </Button>
          <Button
            asChild
            className="font-bold gap-2 hover:bg-teal-600 block text-center my-6"
          >
            <Link href="/select-business-type">Sign Up as a Partner</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
