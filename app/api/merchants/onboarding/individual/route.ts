import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(
    `${process.env.baseUrl}/merchants/individual/account/verification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();

  return NextResponse.json({ data });
}
