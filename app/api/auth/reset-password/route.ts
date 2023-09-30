import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token, ...rest } = await request.json();
  const res = await fetch(
    `${process.env.baseUrl}/auth/token/${token}/password/reset`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rest),
    }
  );
  const data = await res.json();

  return NextResponse.json({ data });
}
