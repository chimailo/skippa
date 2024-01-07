import type { SessionOptions } from "iron-session";
import { SessionData } from "@/types";

export const sessionOptions: SessionOptions = {
  password: process.env.COOKIE_SECRET as string,
  cookieName: "skippa.session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const defaultSession: SessionData = {
  isLoggedIn: false,
  user: null,
  token: null,
};
