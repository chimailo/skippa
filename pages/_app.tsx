import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { Raleway } from "next/font/google";

import SidebarWidthProvider from "@/context/sidebarWidthProvider";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import "@/styles/wysiwig.css";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        errorRetryCount: 3,
      }}
    >
      <style jsx global>{`
        html {
          font-family: ${raleway.style.fontFamily};
        }
      `}</style>
      <div className="relative">
        <SidebarWidthProvider>
          <Component {...pageProps} />
        </SidebarWidthProvider>
      </div>
    </SWRConfig>
  );
}
