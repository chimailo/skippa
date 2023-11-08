import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";

import DataTable from "./components/datatable";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const baseUrl = process.env.baseUrl;

async function fetchMerchants(token: string, params?: string) {
  const endpoint = params ? `/merchants?${params}` : "/merchants";
  const res = await fetch(baseUrl + endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const { data } = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch partners");
  }

  return data;
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || Date.now() > new Date(session.expires).getDate()) {
    signOut({
      redirect: true,
      callbackUrl: "/login",
    });
    return;
  }

  const params = new URLSearchParams(searchParams).toString();
  const data = await fetchMerchants(session.token, params);

  return (
    <div className="block space-y-3 py-3">
      {/* <h1 className="text-2xl">Businesses</h1> */}
      <DataTable
        data={data.docs}
        pagination={data.pagination}
        token={session.token}
      />
    </div>
  );
}
