import type { AppProps } from "next/app";

import AuthProvider from "@/context/authProvider";
import "@/styles/globals.css";
import SidebarWidthProvider from "@/context/sidebarWidthProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SidebarWidthProvider>
        <Component {...pageProps} />
      </SidebarWidthProvider>
    </AuthProvider>
  );
}
