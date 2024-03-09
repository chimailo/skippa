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
    (session.user?.type === "business" || session.user?.type === "admin") &&
    request.nextUrl.pathname === "/profile/guarantor"
  ) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // Prevent user who is not activated or an admin from
  // accessing any other pages apart from /help and /profile
  // if (session.user?.type !== "admin" || session.user?.status !== 'activated') {
  //   return NextResponse.redirect(new URL("/profile", request.url));
  // }
}

export const config = {
  matcher: [
    "/onboarding",
    "/profile/:path*",
    "/partners/:path*",
    "/team",
    "/team/manage-roles",
    "/customers",
    "/reports/:path*",
    "/settlements/:path*",
  ],
};
