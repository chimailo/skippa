"use client";

import { useContext } from "react";

import Header from "@/app/components/auth-header";
import {
  SidebarWidthContextProps,
  SidebarWidthContext,
} from "@/app/context/sidebarWidthProvider";
import { cn } from "@/app/utils";
import { useSession } from "next-auth/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession({ required: true });
  const { collapsed } =
    useContext<SidebarWidthContextProps>(SidebarWidthContext);

  return (
    <div className="w-full">
      <Header />
      <div className="md:p-5 bg-zinc-200">
        <main
          className={cn(
            "transition-all duration-300 overflow-y-auto z-10 rounded-lg bg-white min-h-[calc(100vh_-_6rem)]",
            collapsed ? "ml-20" : "lg:ml-64 ml-20"
          )}
        >
          {session?.token && (
            <div className="bg-[#4CD964] rounded-t-lg py-1 px-3 text-center text-sm font-semibold uppercase text-white">
              We are currently verifying your details. You will BE NOTIFIED once
              the verification process is complete.
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
