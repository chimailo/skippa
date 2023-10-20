"use client";

import { useContext } from "react";
import { signOut } from "next-auth/react";

import { Button } from "@/app/components/ui/button";
import Container from "@/app/components/container";
import LogoutIcon from "@/app/components/svg/logout";
import { Link, MenuIcon } from "lucide-react";
import { cn } from "../utils";
import {
  SidebarWidthContextProps,
  SidebarWidthContext,
} from "@/app/context/sidebarWidthProvider";
import Logo from "./svg/logo";

export default function AuthHeader() {
  // const { broken, handleToggled } =
  //   useContext<SidebarWidthContextProps>(SidebarWidthContext);

  return (
    <header role="banner" className="flex flex-shrink-0 h-14 bg-primary-darker">
      <Container className={cn("flex items-center w-full gap-4")} compact>
        {/* {broken && (
          <>
            <Button
              variant="ghost"
              className="rounded-full p-2"
              onClick={handleToggled}
            >
              <MenuIcon className="w-5 h-5 text-primary" />
            </Button>
            <Link href="/dashboard">
              <Logo />
            </Link>
          </>
        )} */}
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
  );
}
