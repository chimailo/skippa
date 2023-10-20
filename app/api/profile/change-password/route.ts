import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const { token, ...rest } = await request.json();
  const res = await fetch(
    `${process.env.baseUrl}/auth/user/me/password/change`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rest),
    }
  );
  const data = await res.json();

  return NextResponse.json({ data });
}
