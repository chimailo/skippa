import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  export interface Session {
    token: string;
    user: {
      id: string;
      phone: string;
      type: "admin" | "business" | "individual";
      dateAdded: string;
      role: Record<string, string | string[]>;
      completedSignUp: boolean;
      business: any;
      guarantor?: any;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    creteToken: string;
    dateAdded: string;
    phone: string;
    role: Record<string, string | string[]>;
    type: "admin" | "business" | "individual";
    completedSignUp: boolean;
    business: any;
  }
}
