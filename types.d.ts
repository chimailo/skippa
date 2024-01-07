export interface SessionData {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  type: "admin" | "business" | "individual";
  role: Role;
  verificationCount: number;
  company: string;
  status: string;
  verified: boolean;
}

export type Role = Record<string, string | boolean | string[]>;
