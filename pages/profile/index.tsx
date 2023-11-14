import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import UserForm from "@/components/profile/forms/user";
import Security from "@/components/profile/security";
import UserSection from "@/components/profile/user";

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  if (status === "loading") {
    <div className="w-full py-12 flex items-center justify-center">
      <Spinner twColor="text-primary before:bg-primary" twSize="w-8 h-8" />
    </div>;
  }

  return (
    <Layout auth sidebar={{ active: "profile", activeChild: "profile" }}>
      {!session?.user.business.isVerified && (
        <div className="bg-[#4CD964] rounded-t-lg py-1 px-3 text-center text-sm font-medium uppercase text-white">
          We are currently verifying your details. You will BE NOTIFIED once the
          verification process is complete.
        </div>
      )}
      {session?.user.business.isVerified && (
        <div className="bg-[#4CD964] rounded-t-lg py-1 px-3 text-center text-sm font-semibold uppercase text-white">
          We are currently verifying your details. You will BE NOTIFIED once the
          verification process is complete.
        </div>
      )}
      <div className="block sm:flex space-y-4 sm:space-y-0 px-5 md:py-14 py-7 ">
        {session?.token && (
          <>
            <UserSection user={session.user} />
            <section className="py-5 sm:border-l-2 border-zinc-300 flex-1">
              {session && (
                <>
                  <section className="sm:px-5">
                    <h1 className="font-bold mb-8">User Information</h1>
                    <UserForm
                      user={{ ...session.user, token: session.token }}
                    />
                  </section>
                  <hr className="bg-zinc-300 my-4 h-0.5" />
                  <section className="sm:px-5">
                    <h1 className="font-bold mb-4">Security</h1>
                  </section>
                  <Security user={session.user} />
                </>
              )}
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
