import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { SessionData, User } from "@/types";
import { defaultSession } from "@/lib/session";
import { useEffect, useState } from "react";

type LoginFormData = {
  email: string;
  password: string;
};

export type ResponseData = {
  name?: string;
  success: boolean;
  message: string;
  data: SessionData;
};

async function fetchSession<JSON = unknown>(
  url: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    ...init,
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message);
    error.name = data.name;
    throw error;
  }

  return data;
}

function loginUser(url: string, { arg: data }: { arg: LoginFormData }) {
  return fetchSession<ResponseData>(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

function logoutUser(url: string) {
  return fetchSession<ResponseData>(url, {
    method: "DELETE",
  });
}

function updateUser(url: string, { arg: data }: { arg: Partial<User> }) {
  return fetchSession<ResponseData>(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export default function useSession() {
  const [session, setSession] = useState<SessionData>(defaultSession);
  const [status, setStatus] = useState<SessionStatus>("loading");

  const { data, error, isLoading } = useSWR(
    "/api/auth",
    fetchSession<ResponseData>,
    {
      fallbackData: {
        success: false,
        message: "No session was found for this user",
        data: defaultSession,
      },
      shouldRetryOnError: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      // revalidate: false,
    }
  );

  useEffect(() => {
    if (isLoading) {
      setStatus("loading");
    } else if (error) {
      setStatus("unauthenticated");
    } else {
      setStatus("authenticated");
      setSession(data.data);
    }
  }, [data, error, isLoading]);

  const { trigger: signIn } = useSWRMutation("/api/auth", loginUser);

  const { trigger: update } = useSWRMutation("/api/auth", updateUser);

  const { trigger: signOut } = useSWRMutation("/api/auth", logoutUser);

  return { session, signIn, signOut, status, update };
}
