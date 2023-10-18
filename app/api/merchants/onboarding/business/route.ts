import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token, ...body } = await request.json();
  const res = await fetch(
    `${process.env.baseUrl}/merchants/business/account/verification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();

  return NextResponse.json({ data });
}
