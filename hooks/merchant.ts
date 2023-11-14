import { Session } from "next-auth";
import { useLocalStorage } from "usehooks-ts";

export function useMerchant({ user }: { user: Session["user"] | null }) {
  const [merchant, setMerchant] = useLocalStorage("skippa.merchant", user);

  const update = (user?: Session["user"]) =>
    user ? setMerchant(user) : setMerchant(null);

  return { merchant, update };
}
