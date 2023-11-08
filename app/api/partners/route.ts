import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const headers = request.headers;

  const res = await fetch(`${process.env.baseUrl}/merchants?${body.params}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${headers.get("Authorization")}`,
    },
  });
  const data = await res.json();

  return NextResponse.json({ data });
}
