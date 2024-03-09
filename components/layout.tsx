import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import ChildSidebar from "@/components/child-sidebar";
import { cn } from "@/lib/utils";
import { useSidebarWidth } from "@/context/sidebarWidthProvider";
import { User } from "@/types";

type Props = {
  auth?: boolean;
  user?: User | null;
  children: React.ReactNode;
  sidebar?: {
    active: string;
    activeChild?: string;
    name?: string;
  };
  customChild?: boolean;
  title?: string;
  noLink?: boolean;
};

export default function Layout({
  children,
  sidebar,
  title,
  auth,
  user,
  noLink,
  customChild,
}: Props) {
  const { collapsed } = useSidebarWidth();
  const hasChild = !!sidebar?.activeChild;

  return (
    <>
      {user ? (
        <>
          <Header auth />
          <Sidebar user={user} active={sidebar?.active} hasChild={hasChild} />
          {hasChild && (
            <ChildSidebar
              user={user}
              businessName={sidebar?.name}
              active={sidebar?.activeChild}
            />
          )}
          <div
            className={cn(
              "md:p-5 duration-300 transition-all bg-zinc-200",
              !collapsed ? "ml-28 md:ml-64" : hasChild ? "ml-28" : "ml-14"
            )}
          >
            {title && <h1 className="font-bold text-xl mb-4">{title}</h1>}
            {customChild ? (
              children
            ) : (
              <main
                className={cn(
                  "overflow-y-auto z-10 rounded-lg bg-white min-h-[calc(100vh_-_6rem)]"
                )}
              >
                {children}
              </main>
            )}
          </div>
        </>
      ) : (
        <>
          {auth ? <Header auth /> : noLink ? <Header noLink /> : <Header />}
          {children}
        </>
      )}
      <Toaster />
    </>
  );
}
