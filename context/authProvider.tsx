import { SessionProvider } from "next-auth/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function authProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
