import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log(req.nextauth);
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

export const config = { matcher: ["/register/verify-business"] };
