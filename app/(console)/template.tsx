"use client";

import Header from "@/app/components/auth-header";
import { useContext } from "react";
import {
  SidebarWidthContextProps,
  SidebarWidthContext,
} from "@/app/context/sidebarWidthProvider";
import { cn } from "@/app/utils";

export default function Template({ children }: { children: React.ReactNode }) {
  const { collapsed } =
    useContext<SidebarWidthContextProps>(SidebarWidthContext);

  return (
    <div className="w-full ml">
      <Header />
      <div className="md:p-5 bg-zinc-200">
        <main
          className={cn(
            "px-5 md:py-14 transition-all duration-300 py-7 overflow-y-auto z-10 rounded-lg bg-white min-h-[calc(100vh_-_6rem)]",
            collapsed ? "ml-20" : "lg:ml-64 ml-20"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
