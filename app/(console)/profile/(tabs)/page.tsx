import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Spinner from "@/app/components/loading";
import UserForm from "./components/forms/user";
import Security from "./components/security";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  return (
    <section className="py-5 sm:border-l-2 border-zinc-300 flex-1">
      {session && session.token ? (
        <>
          <section className="sm:px-5">
            <h1 className="font-bold mb-8">User Information</h1>
            <UserForm user={{ ...session.user, token: session.token }} />
          </section>
          <hr className="bg-zinc-300 my-4 h-0.5" />
          <section className="sm:px-5">
            <h1 className="font-bold mb-4">Security</h1>
          </section>
          <Security />
        </>
      ) : (
        <div className="w-full py-12 flex items-center justify-center">
          <Spinner twColor="text-primary before:bg-primary" twSize="w-8 h-8" />
        </div>
      )}
    </section>
  );
}
