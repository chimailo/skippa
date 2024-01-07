import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";

import { SessionData } from "@/types";
import { defaultSession, sessionOptions } from "@/lib/session";
import { ResponseData } from "@/hooks/session";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>
) {
  const session = await getIronSession<SessionData>(
    request,
    response,
    sessionOptions
  );

  if (request.method === "POST") {
    const login = request.body;
    const res = await authenticate(login);
    const data = await res.json();

    const user = data.data.user;
    const token = data.data.token;

    if (!data.success) {
      return response.status(res.status).json({
        name: data.name,
        success: false,
        message: data.message,
        data: defaultSession,
      } as ResponseData);
    }

    if (!user.hasCompletedSignUp) {
      return response.status(401).json({
        name: "AccountVerificationError",
        message: "You have not yet verified your account",
        success: false,
        data: defaultSession,
      } as ResponseData);
    }

    const { id, mobile: phone, email, businessType: type, role } = user;
    const name = user.firstName + " " + user.lastName;
    const verificationCount = user.business.verificationChecks;
    const company = user.business.companyName;
    const status = user.business.status;
    const verified = user.business.isVerified;

    session.isLoggedIn = true;
    session.token = token;
    session.user = {
      id,
      name,
      phone,
      email,
      type,
      company,
      status,
      role,
      verificationCount,
      verified,
    };
    await session.save();

    return response.json({
      message: data.message,
      data: user.business,
    } as ResponseData);
  } else if (request.method === "GET") {
    if (!session.isLoggedIn) {
      return response.status(401).json({
        success: false,
        message: "You do not have an active session",
        data: defaultSession,
      } as ResponseData);
    }

    return response.json({
      message: "User session retrieved successfully",
      data: session,
    } as unknown as ResponseData);
  } else if (request.method === "DELETE") {
    session.destroy();
    return response.json({
      success: true,
      message: "You were successfully logged out",
      data: defaultSession,
    } as ResponseData);
  } else if (request.method === "PUT") {
    const user = request.body;

    session.user = { ...session.user, ...user };
    await session.save();

    return response.json({
      message: "User session was successfully updated",
      data: session,
    } as unknown as ResponseData);
  }

  return response.status(405).end(`Method ${request.method} Not Allowed`);
}

const authenticate = async (body: { email: string; password: string }) => {
  const res = await fetch(`${process.env.baseUrl}/auth/merchant/login`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return res;
};
