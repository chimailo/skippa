"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";

import Logo from "./svg/logo";
import {
  DashboardIcon,
  HelpIcon,
  ReportIcon,
  SettlementIcon,
  TeamIcon,
  UserIcon,
} from "./svg";
import { cn } from "../utils";

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
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);

  return (
    <>
      <ProSidebar
        rootStyles={{
          color: "white",
          height: "100%",
        }}
        collapsed={collapsed}
        toggled={toggled}
        onBreakPoint={setBroken}
        onBackdropClick={() => setToggled(false)}
        backgroundColor="#272E2D"
        width="16rem"
        breakPoint="sm"
      >
        <SidebarHeader />
        <div className="my-8">
          <h2
            className={cn(
              "font-bold pr-8 pl-16 py-6",
              collapsed && "opacity-0"
            )}
          >
            {name}
          </h2>
          <SidebarMenu />
        </div>
        <button className="sb-button" onClick={() => setCollapsed(!collapsed)}>
          Collapse
        </button>
      </ProSidebar>
      {broken && (
        <button className="sb-button" onClick={() => setToggled(!toggled)}>
          Toggle
        </button>
      )}
    </>
  );
}

const SidebarHeader = () => {
  return (
    <div className="flex items-center px-5 h-16">
      <div className="w-full overflow-hidden flex items-center gap-3">
        <Logo />
        <h1 className="truncate font-bold text-xl">Skippa</h1>
      </div>
    </div>
  );
};

const SidebarMenu = () => {
  const menuItemStyles = {
    root: {
      fontSize: "16px",
      fontWeight: 700,
      color: "white",
    },
    button: {
      height: "4rem",
      "&:hover": {
        backgroundColor: "#4AB9AD",
      },
    },
  };

  return (
    <Menu menuItemStyles={menuItemStyles}>
      {SIDEBARITEMS.map((item, i) => (
        <MenuItem
          key={i}
          component={<Link href={item.href} />}
          icon={item.icon}
        >
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
};
