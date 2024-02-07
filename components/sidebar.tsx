import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DashboardIcon,
  HelpIcon,
  BusinessIcon,
  CustomerIcon,
  ReportIcon,
  SettlementIcon,
  TeamIcon,
  UserIcon,
} from "./svg";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from "@/types";
import { useSidebarWidth } from "@/context/sidebarWidthProvider";

export const SIDEBARITEMS = {
  dashboard: {
    icon: DashboardIcon,
    href: "/dashboard",
    type: "",
    requireVerification: true,
  },
  partners: {
    icon: BusinessIcon,
    href: "/partners",
    type: "admin",
    requireVerification: true,
    children: [
      {
        icon: DashboardIcon,
        href: `/dashboard`,
        label: "Dashboard",
      },
      {
        icon: ReportIcon,
        href: `/reports`,
        label: "Reports",
      },
      {
        icon: TeamIcon,
        href: `/team`,
        label: "Team",
      },
      {
        icon: BusinessIcon,
        href: `/manage-partner`,
        label: "Manage Partner",
      },
      {
        icon: SettlementIcon,
        href: `/settlements`,
        label: "Settlements",
      },
    ],
  },
  customers: {
    icon: CustomerIcon,
    href: "/customers",
    type: "admin",
    requireVerification: true,
  },
  reports: {
    icon: ReportIcon,
    href: "/reports",
    type: "",
    requireVerification: true,
  },
  // deliveries: {
  //   icon: DeliveryIcon,
  //   href: "/deliveries",
  //   type: "individual",
  //   requireVerification: true,
  // },
  settlements: {
    icon: SettlementIcon,
    href: "/settlements",
    type: "",
    requireVerification: true,
  },
  team: {
    icon: TeamIcon,
    href: "/team",
    type: "business admin",
    requireVerification: true,
  },
  // profile: {
  //   icon: UserIcon,
  //   href: "/profile",
  //   type: "",
  //   notRequireVerification: true,
  //   requireVerification: false,
  // },
};

type Props = {
  user?: User | null;
  active?: string;
  hasChild: boolean;
};

export default function Sidebar({ user, active, hasChild }: Props) {
  const { collapsed, handleCollapsed } = useSidebarWidth();
  const [isBrowser, setBrowser] = useState(false);

  useEffect(() => {
    setBrowser(true);
  }, []);

  const getUserPerms = () => {
    let perms: string[] = [];
    (user!.role.permissions as string[]).forEach((p: string) => {
      let page = p.split(":")[0].toLowerCase();
      const perm = page === "businesses" ? "partners" : page;

      if (!perms.includes(page.toLowerCase())) perms.push(perm);
    });
    return perms;
  };
  const isSuperAdmin =
    user?.role.slug === "business-super-admin" ||
    user?.role.slug === "individual-super-admin" ||
    user?.role.slug === "skippa-super-admin";
  const isRider = (label: string) =>
    user?.role.slug === "business-riders" && getUserPerms().includes(label);
  const isCustom = (label: string) =>
    user?.role.isCustom && getUserPerms().includes(label);

  const getSidebarItems = () => {
    const items =
      user?.type === "admin" || user?.status === "activated"
        ? Object.entries(SIDEBARITEMS)
            .filter(([_, item]) => !item.type || item.type.includes(user.type))
            .filter(
              ([label, _]) => isSuperAdmin || isRider(label) || isCustom(label)
            )
        : [];
    return items.map(([label, item]) => ({ ...item, label }));
  };

  const sidebarItems = getSidebarItems();

  return (
    <aside
      className={cn(
        "text-white bg-primary-darker transition-all w-min fixed top-0 overflow-y-auto left-0 z-30 h-full",
        collapsed ? "w-14" : "w-64"
      )}
    >
      <SidebarMenu collapsed={collapsed} name={user?.company}>
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            label={item.label}
            collapsed={collapsed}
            active={active === item.label.toLowerCase()}
          >
            {item.icon({
              className: "w-5 h-5",
              color:
                active === item.label.toLowerCase() ? "#FFFFFF" : "#C7C7C7",
            })}
            {item.label}
          </SidebarItem>
        ))}
        <SidebarItem
          href="/profile"
          collapsed={collapsed}
          label="Profile"
          active={active === "profile"}
        >
          <UserIcon className="w-5 h-5 fill-current" />
          Profile
        </SidebarItem>
        <SidebarItem
          href="/faqs"
          collapsed={collapsed}
          label="Help & Support"
          external
        >
          <HelpIcon className="w-5 h-5 fill-current" />
          Help & Support
        </SidebarItem>
      </SidebarMenu>
      {isBrowser &&
        !hasChild &&
        createPortal(
          <Button
            variant="ghost"
            className={cn(
              "rounded-full fixed h-8 w-8 items-center justify-center p-0 top-3 z-50 duration-300 transition-all hover:bg-primary-dark bg-primary-darker",
              collapsed ? "left-14" : "left-56"
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

export const SidebarMenu = ({
  children,
  collapsed,
  name,
}: {
  children: React.ReactNode;
  name?: string;
  collapsed: boolean;
}) => {
  return (
    <nav className="flex mt-14 flex-1 flex-col overflow-hidden py-4 md:py-12">
      <h2
        className={cn(
          "font-semibold transition-opacity pr-8 pl-14 py-6 truncate text-[#C7C7C7] min-h-[4.5rem]",
          collapsed ? "opacity-0" : "opacity-100"
        )}
      >
        {name}
      </h2>
      <ul className="">{children}</ul>
    </nav>
  );
};

export const SidebarItem = ({
  active,
  children,
  href,
  label,
  external,
  collapsed,
}: {
  active?: boolean;
  collapsed: boolean;
  external?: boolean;
  children: React.ReactNode;
  href: string;
  label: string;
}) => {
  return (
    <li className="relative">
      {collapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <Link
                href={href}
                className={cn(
                  "h-16 font-bold border-t px-4 capitalize border-[#2f3435] hover:bg-primary flex items-center gap-5 hover:text-white",
                  active ? "bg-primary text-white" : "text-[#C7C7C7]"
                )}
                target={external ? "_blank" : ""}
              >
                {children}
              </Link>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent className="text-base font-bold bg-primary-darker py-2 rounded px-4">
                <p className="capitalize">{label}</p>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Link
          href={href}
          className={cn(
            "h-16 font-bold border-t px-4 capitalize border-[#2f3435] hover:bg-primary flex items-center gap-5 hover:text-white",
            active ? "bg-primary text-white" : "text-[#C7C7C7]"
          )}
          target={external ? "_blank" : ""}
        >
          {children}
        </Link>
      )}
    </li>
  );
};
