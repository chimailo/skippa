"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

export type SidebarWidthContextProps = {
  collapsed: boolean;
  handleCollapsed: () => void;
  // toggled: boolean;
  // broken: boolean;
  // handleToggled: () => void;
  // setBroken: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SidebarWidthContext = createContext<SidebarWidthContextProps>({
  collapsed: false,
  handleCollapsed: () => {},
  // toggled: false,
  // broken: false,
  // handleToggled: () => {},
  // setBroken: () => {},
});

type Props = {
  children: ReactNode;
};

export default function SidebarWidthProvider({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }, []);

  // const [toggled, setToggled] = useState(false);
  // const [broken, setBroken] = useState(false);

  const handleCollapsed = () => setCollapsed(!collapsed);

  // const handleToggled = () => setToggled(!toggled);

  // const handleBroken = () => {
  //   // console.log(broken);
  //   setBroken(!broken);
  // };

  return (
    <SidebarWidthContext.Provider value={{ collapsed, handleCollapsed }}>
      {children}
    </SidebarWidthContext.Provider>
  );
}
