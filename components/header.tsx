import Link from "next/link";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import LogoutIcon from "@/components/svg/logout";
import Logo from "@/components/svg/logo";
import { cn } from "@/lib/utils";

export default function Header({ auth }: { auth?: boolean }) {
  return (
    <>
      {auth ? (
        <header
          role="banner"
          className="flex flex-shrink-0 h-14 bg-primary-darker"
        >
          <Container className={cn("flex items-center w-full gap-4")}>
            <div className="flex-1 justify-end flex">
              <Button
                variant="ghost"
                className="font-semibold gap-2 text-white"
                onClick={() =>
                  signOut({
                    redirect: true,
                    callbackUrl: "/login",
                  })
                }
              >
                Log Out
                <LogoutIcon />
              </Button>
            </div>
          </Container>
        </header>
      ) : (
        <header
          role="banner"
          className="flex flex-shrink-0 h-14 md:h-16 bg-primary-darker"
        >
          <Container className="flex items-center w-full gap-4 max-w-screen-2xl">
            <Link href="/" className="flex items-center gap-3 text-primary">
              <Logo />
              <h1 className="truncate font-bold text-xl text-white">Skippa</h1>
            </Link>
          </Container>
        </header>
      )}
    </>
  );
}
