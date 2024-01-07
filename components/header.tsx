import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import LogoutIcon from "@/components/svg/logout";
import Logo from "@/components/svg/logo";
import { cn } from "@/lib/utils";
import useSession from "@/hooks/session";
import { useSidebarWidth } from "@/context/sidebarWidthProvider";

export default function Header({ auth }: { auth?: boolean }) {
  const { signOut } = useSession();
  const router = useRouter();
  const { collapsed } = useSidebarWidth();

  async function handleLogout() {
    await signOut();
    router.push(`/login`);
  }

  return (
    <>
      {auth ? (
        <header
          role="banner"
          className="flex flex-shrink-0 h-14 bg-primary-darker sticky top-0 z-40"
        >
          <SiteBrand collapsed={collapsed} />
          <Container className={cn("flex items-center w-full gap-4")}>
            <div className="flex-1 justify-end flex">
              <Button
                variant="ghost"
                className="font-semibold gap-2 text-white"
                onClick={handleLogout}
              >
                Log Out
                <LogoutIcon />
              </Button>
            </div>
          </Container>
        </header>
      ) : (
        <header
          role="banner"
          className="flex flex-shrink-0 h-14 md:h-16 bg-primary-darker z-40"
        >
          <Container className="flex items-center w-full gap-4 max-w-screen-2xl">
            <Link href="/" className="flex items-center gap-3 text-primary">
              <Logo />
              <h1 className="truncate font-bold text-xl text-white">Skippa</h1>
            </Link>
          </Container>
        </header>
      )}
    </>
  );
}

const SiteBrand = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <Link
      href="/dashboard"
      className={cn("flex items-center h-14", collapsed ? "px-2" : "px-4")}
    >
      <span className="w-full overflow-hidden flex items-center gap-4">
        <Logo />
        <h1
          className={cn(
            "truncate font-bold text-xl transition-all text-white",
            collapsed && "sr-only"
          )}
        >
          Skippa
        </h1>
      </span>
    </Link>
  );
};
