import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // const session = req.nextauth.token;
    // const businessCookie = req.cookies.get("business")?.value;
    // console.log(businessCookie);
    // if (session && businessCookie) {
    //   session.business = JSON.parse(businessCookie);
    // }
    // console.log(session?.business);
    // if (
    //   !req.nextUrl.pathname.includes("/onboarding") &&
    //   !session?.business.verificationChecks &&
    //   session?.type !== "admin"
    // ) {
    //   return NextResponse.redirect(new URL("/onboarding", req.url));
    // }
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token }) => {
        return !!token?.accessToken;
      },
    },
  }
);

export const config = {
  matcher: ["/onboarding", "/profile/:path*", "/partners/:path*"],
};
