import { ReactNode, createContext } from "react";
import { Session, getServerSession } from "next-auth";
import { useLocalStorage } from "usehooks-ts";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export type UserContextType = {
  user?: Session["user"] | null;
  updateUser: (user?: Session["user"]) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  updateUser: () => {},
});

export default async function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const [user, setUser] = useLocalStorage("skippa.merchant", session?.user);

  const updateUser = (user?: Session["user"]) => setUser(user);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}
