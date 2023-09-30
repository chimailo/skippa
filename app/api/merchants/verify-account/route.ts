import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(
    `${process.env.baseUrl}/admins/account/${body.token}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp: body.otp }),
    }
  );
  const data = await res.json();

  return NextResponse.json({ data });
}
