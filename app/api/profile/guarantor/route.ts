import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const body = await request.json();
  const headers = request.headers;
  console.log(headers);

  const res = await fetch(
    `${process.env.baseUrl}/merchants/individual/guarantor/new`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${headers.get("Authorization")}`,
      },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();

  return NextResponse.json({ data });
}
