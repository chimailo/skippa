import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData } from "@/types";
import { sessionOptions } from "@/lib/session";

export async function middleware(request: NextRequest, response: NextResponse) {
  const session = await getIronSession<SessionData>(
    request,
    response,
    sessionOptions
  );
  console.log("middleware: ", session);

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    !request.nextUrl.pathname.includes("/onboarding") &&
    !session.user?.verificationCount &&
    session.user?.type !== "admin"
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Prevent admin from accessing the `/profile/*` pages
  if (
    session.user?.type === "admin" &&
    (request.nextUrl.pathname === "/profile/merchants" ||
      request.nextUrl.pathname === "/profile/guarantor")
  ) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }
  // Prevent business from accessing the `/profile/guarantor` pages
  if (
    session.user?.type === "business" &&
    request.nextUrl.pathname === "/profile/guarantor"
  ) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }
}

export const config = {
  matcher: ["/onboarding", "/profile/:path*", "/partners/:path*"],
};
