import { useEffect, useState } from "react";
import $api from "@/lib/axios";
import useSession from "@/hooks/session";

export default function useUser() {
  const { session, update } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await $api({
        token: session.token,
        url: `/users/me`,
      });

      const status = response.data.business.status;
      const role = response.data.role;

      update({ status, role });
    };

    fetchUser();
  }, []);
}
