"use client";

import { useContext } from "react";

import {
  SidebarWidthContextProps,
  SidebarWidthContext,
} from "@/app/context/sidebarWidthProvider";
import { cn } from "@/app/utils";

export default function Main({ children }: { children: React.ReactNode }) {
  const { collapsed } =
    useContext<SidebarWidthContextProps>(SidebarWidthContext);

  return (
    <main
      className={cn(
        "transition-all duration-300 overflow-y-auto z-10 rounded-lg bg-white min-h-[calc(100vh_-_6rem)]",
        collapsed ? "ml-20" : "lg:ml-64 ml-20"
      )}
    >
      {children}
    </main>
  );
}
