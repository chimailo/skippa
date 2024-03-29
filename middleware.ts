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

  const { type, verificationCount } = session.user!;

  // console.log("**************", request.nextUrl.pathname, "***************");
  // console.log(!request.nextUrl.pathname.includes("/onboarding"));
  // console.log(!verificationCount);
  // console.log(type === "business" || type === "individual");

  if (
    !request.nextUrl.pathname.includes("/onboarding") &&
    !session.user?.verificationCount &&
    (session.user?.type === "business" || session.user?.type === "individual")
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
