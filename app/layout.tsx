import "./globals.css";
import { Raleway } from "next/font/google";
import { Toaster } from "@/app/components/ui/toaster";
import AuthProvider from "./context/authProvider";

const raleway = Raleway({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={raleway.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  );
}
