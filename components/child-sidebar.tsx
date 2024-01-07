import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarMenu, SidebarItem, SIDEBARITEMS } from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { useSidebarWidth } from "@/context/sidebarWidthProvider";
import { User } from "@/types";

type Props = {
  user?: User | null;
  active?: string;
};

export default function Sidebar({ user, active }: Props) {
  const [isBrowser, setBrowser] = useState(false);
  const { collapsed, handleCollapsed } = useSidebarWidth();
  const params = useParams();

  useEffect(() => {
    setBrowser(true);
  }, []);

  return (
    <aside
      className={cn(
        "text-white bg-primary-darker transition-all w-min fixed top-0 overflow-y-auto left-14 z-30 h-full",
        collapsed ? "w-14" : "w-[12.5rem]"
      )}
    >
      <SidebarMenu collapsed={collapsed} name={user?.company}>
        {SIDEBARITEMS["partners"].children.map((item) => (
          <SidebarItem
            key={item.href}
            label={item.label}
            collapsed={collapsed}
            href={`/partners/${params.id}${item.href}`}
            active={active === item.label.toLowerCase()}
          >
            {item.icon({ className: "w-5 h-5" })}
            {item.label}
          </SidebarItem>
        ))}
      </SidebarMenu>
      {isBrowser &&
        createPortal(
          <Button
            variant="ghost"
            className={cn(
              "rounded-full fixed h-8 w-8 items-center justify-center p-0 top-3 z-50 duration-300 transition-all hover:bg-primary-dark bg-primary-darker",
              collapsed ? "left-28" : "left-56"
            )}
            onClick={() => handleCollapsed()}
          >
            <ChevronLeft
              className={cn(
                "w-5 h-5 text-white transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>,
          document.body
        )}
    </aside>
  );
}
