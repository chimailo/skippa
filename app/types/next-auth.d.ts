import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  export interface Session {
    token: string;
    user: {
      role: Record<string, string | string[]>;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    creteToken: string;
    role: Record<string, string | string[]>;
  }
}
