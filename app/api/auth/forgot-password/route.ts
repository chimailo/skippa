import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${process.env.baseUrl}/auth/password/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: body.email }),
  });
  const data = await res.json();

  return NextResponse.json({ data });
}
