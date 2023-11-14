import { useContext } from "react";
import { useSession } from "next-auth/react";
import { Raleway } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";
import {
  SidebarWidthContextProps,
  SidebarWidthContext,
} from "@/context/sidebarWidthProvider";

const raleway = Raleway({ subsets: ["latin"] });

type Props = {
  auth?: boolean;
  children: React.ReactNode;
  sidebar?: {
    active: string;
    activeChild?: string;
  };
};

export default function Layout({ auth, children, sidebar }: Props) {
  const { collapsed } =
    useContext<SidebarWidthContextProps>(SidebarWidthContext);
  const { data: session, status } = useSession();

  return (
    <div className={cn("relative", raleway.className)}>
      {status === "loading" ? (
        <div className="w-full py-12 md:py-24 flex items-center justify-center">
          <Spinner twColor="text-primary before:bg-primary" twSize="w-8 h-8" />
        </div>
      ) : auth ? (
        <>
          <Sidebar user={session?.user} sidebar={sidebar} />
          <div className="w-full">
            {auth ? <Header auth /> : <Header />}
            <div className="md:p-5 bg-zinc-200">
              <main
                className={cn(
                  "transition-all duration-300 overflow-y-auto z-10 rounded-lg bg-white min-h-[calc(100vh_-_6rem)]",
                  collapsed ? "ml-20" : "lg:ml-64 ml-20"
                )}
              >
                {children}
              </main>
            </div>
          </div>
        </>
      ) : (
        <>
          <Header />
          {children}
        </>
      )}
      <Toaster />
    </div>
  );
}
