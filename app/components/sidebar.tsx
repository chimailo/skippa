"use client";

import { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  menuClasses,
  sidebarClasses,
} from "react-pro-sidebar";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/utils";
import {
  SidebarWidthContext,
  type SidebarWidthContextProps,
} from "@/app/context/sidebarWidthProvider";
import Logo from "./svg/logo";
import {
  DashboardIcon,
  HelpIcon,
  ReportIcon,
  SettlementIcon,
  TeamIcon,
  UserIcon,
} from "./svg";

const SIDEBARITEMS = [
  {
    icon: <DashboardIcon />,
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    icon: <ReportIcon />,
    href: "/reports",
    label: "Reports",
  },
  {
    icon: <TeamIcon />,
    href: "/team",
    label: "Team",
  },
  {
    icon: <UserIcon />,
    href: "/profile",
    label: "Profile",
  },
  {
    icon: <SettlementIcon />,
    href: "/settlements",
    label: "Settlements",
  },
  {
    icon: <HelpIcon />,
    href: "/help",
    label: "Help & Support",
  },
];

export default function Sidebar({ name }: { name: string }) {
  const { collapsed, handleCollapsed } =
    useContext<SidebarWidthContextProps>(SidebarWidthContext);

  return (
    <>
      <ProSidebar
        rootStyles={{
          position: "fixed",
          bottom: 0,
          top: 0,
          left: 0,
          color: "white",
          backgroundColor: "#272E2D",
          ["." + sidebarClasses.container]: {
            height: "100%",
          },
        }}
        collapsed={collapsed}
        // toggled={toggled}
        // onBreakPoint={setBroken}
        // onBackdropClick={handleToggled}
        // breakPoint="md"
        backgroundColor="#272E2D"
        width="16rem"
      >
        <SidebarHeader />
        <div className={cn("transition-all", !collapsed && "my-8 md:my-12")}>
          <h2
            className={cn(
              "font-bold transition-opacity py-6 delay-200 pr-8 pl-16",
              collapsed && "opacity-0"
            )}
          >
            {name}
          </h2>
          <SidebarMenu />
        </div>
      </ProSidebar>
      <Button
        variant="outline"
        className={cn(
          "rounded-full absolute h-8 w-8 items-center justify-center p-0 top-3 z-20 duration-300 transition-all",
          collapsed ? "left-16" : "left-[15rem]"
          // broken ? "hidden" : "flex"
        )}
        onClick={handleCollapsed}
      >
        {
          <ChevronLeft
            className={cn(
              "w-5 h-5 text-primary transition-transform",
              collapsed && "rotate-180"
            )}
          />
        }
      </Button>
    </>
  );
}

const SidebarHeader = () => {
  return (
    <Link href="/dashboard" className="flex items-center px-5 h-14 sm:h-16">
      <span className="w-full overflow-hidden flex items-center gap-3">
        <Logo />
        <h1 className="truncate font-bold text-xl">Skippa</h1>
      </span>
    </Link>
  );
};

const SidebarMenu = () => {
  const pathname = usePathname();
  // const pattern = `^${pathname}(/[\\w/-]+)?$`;
  // const regex = new RegExp(pattern);

  return (
    <Menu
      rootStyles={{
        ["." + menuClasses.button]: {
          height: "4rem",
          fontSize: "16px",
          fontWeight: 700,
          color: "white",
          borderTop: "1px solid rgba(39, 52, 48, 1)",
          "&:hover": {
            backgroundColor: "#4AB9AD",
          },
        },
        ["." + menuClasses.active]: {
          backgroundColor: "#4AB9AD",
        },
      }}
    >
      {SIDEBARITEMS.map((item, i) => (
        <MenuItem
          key={i}
          active={item.href === pathname}
          component={<Link href={item.href} title={item.label} />}
          icon={item.icon}
        >
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
};
