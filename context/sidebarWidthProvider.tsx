import { createContext, useContext, useEffect, useState } from "react";

export type SidebarWidthContextProps = {
  collapsed: boolean;
  handleCollapsed: (val?: boolean) => void;
};

const SidebarWidthContext = createContext<SidebarWidthContextProps>({
  collapsed: false,
  handleCollapsed: () => {},
});

export const useSidebarWidth = () =>
  useContext<SidebarWidthContextProps>(SidebarWidthContext);

type Props = {
  children: React.ReactNode;
};

export default function SidebarWidthProvider({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }, []);

  const handleCollapsed = (val?: boolean) => setCollapsed(val || !collapsed);

  return (
    <SidebarWidthContext.Provider
      value={{
        collapsed,
        handleCollapsed,
      }}
    >
      {children}
    </SidebarWidthContext.Provider>
  );
}
