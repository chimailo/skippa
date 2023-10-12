import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const { email: cred, password } = credentials as any;
        const res = await authenticate({ email: cred, password });
        const data = await res.json();

        if (!data.success) {
          throw new Error(
            JSON.stringify({
              name: data.name,
              message: data.message,
              createToken: data.data?.customerAccountCreationToken,
            })
          );
        }

        const { id, firstName, lastName, email, status, role } = data.data.user;
        const name = firstName + " " + lastName;
        const accessToken = data.data.token;
        const createToken = data.data.user.customerAccountCreationToken;
        return { accessToken, id, name, email, status, createToken, role };
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.createToken = user.createToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.token = token.accessToken;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const authenticate = async (body: { email: string; password: string }) => {
  const res = await fetch(`${process.env.baseUrl}/auth/merchant/login`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return res;
};
