import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    if (
      req.nextUrl.pathname === "/onboarding" &&
      req.nextauth.token?.type === "admin"
    ) {
      return NextResponse.redirect(new URL("/profile"));
    }
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ req, token }) => {
        return !!token?.accessToken;
      },
    },
  }
);

export const config = { matcher: ["/onboarding", "/profile/:path*"] };
