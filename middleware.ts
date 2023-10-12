import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // console.log();
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ req, token }) => {
        console.log("callback token:", token);
        return !!token?.accessToken;
      },
    },
  }
);

export const config = { matcher: ["/onboarding"] };
