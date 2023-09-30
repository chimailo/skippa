import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { type, ...rest } = await request.json();
  const res = await fetch(
    `${process.env.baseUrl}/merchants/${type}/account/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rest),
    }
  );
  const data = await res.json();

  return NextResponse.json({ data });
}
