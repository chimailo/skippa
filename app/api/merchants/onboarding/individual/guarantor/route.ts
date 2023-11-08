import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id, token, ...body } = await request.json();
  const res = await fetch(
    `${process.env.baseUrl}/merchants/individual/${id}/guarantor/${token}/verification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();

  return NextResponse.json({ data });
}
