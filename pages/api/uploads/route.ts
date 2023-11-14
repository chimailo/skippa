import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const data = formData.get("data") as string;
  const folder = formData.get("folder") as string;
  const filename = formData.get("filename") as string;
  const upload_preset = formData.get("upload_preset") as string;

  const res = await cloudinary.v2.uploader.upload(data, {
    folder,
    upload_preset,
    public_id: filename,
  });
  return NextResponse.json(res);
}

export async function PUT(request: Request) {
  const { id } = await request.json();
  const res = await cloudinary.v2.uploader.destroy(id, {
    invalidate: true,
  });
  console.log("res: ", res);
  return NextResponse.json(res);
}
