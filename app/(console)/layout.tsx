import Sidebar from "@/app/components/sidebar";
import SidebarWidthProvider from "@/app/context/sidebarWidthProvider";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <SidebarWidthProvider>
      <Sidebar name="ABC Logistics" />
      {children}
    </SidebarWidthProvider>
  );
}
