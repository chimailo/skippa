import { getServerSession } from "next-auth";
import Header from "@/app/components/auth-header";
import Sidebar from "@/app/components/sidebar";
import Main from "@/app/components/main";
import SidebarWidthProvider from "@/app/context/sidebarWidthProvider";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <SidebarWidthProvider>
      {session && <Sidebar user={session.user} />}
      <div className="w-full">
        <Header />
        <div className="md:p-5 bg-zinc-200">
          <Main>{children}</Main>
        </div>
      </div>
    </SidebarWidthProvider>
  );
}
