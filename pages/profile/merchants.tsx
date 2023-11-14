import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import BusinessForm from "@/components/profile/forms/business";
import IndividualForm from "@/components/profile/forms/individual";
import Spinner from "@/components/spinner";
import Layout from "@/components/layout";
import UserSection from "@/components/profile/user";

export default function MerchantProfile() {
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
    <Layout auth sidebar={{ active: "profile" }}>
      {!session?.user.business.isVerified && (
        <div className="bg-[#4CD964] rounded-t-lg py-1 px-3 text-center text-sm font-medium uppercase text-white">
          We are currently verifying your details. You will BE NOTIFIED once the
          verification process is complete.
        </div>
      )}
      {session && (
        <div className="block sm:flex space-y-4 sm:space-y-0 px-5 md:py-14 py-7 ">
          <UserSection user={session.user} />
          <div className="py-5 sm:border-l-2 border-zinc-300 flex-1">
            <section className="sm:px-5">
              {session!.user.type === "business" ? (
                <BusinessForm
                  user={{ ...session.user, token: session.token }}
                />
              ) : (
                <IndividualForm
                  user={{ ...session.user, token: session.token }}
                />
              )}
            </section>
          </div>
        </div>
      )}
    </Layout>
  );
}
