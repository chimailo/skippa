import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/navigation";
import { getIronSession } from "iron-session";
import useSWR from "swr";

import BusinessForm from "@/components/profile/forms/business";
import IndividualForm from "@/components/profile/forms/individual";
import ProfileLayout from "@/components/profile/layout";
import ProfileSkeleton from "@/components/loading/profile";
import { useToast } from "@/components/ui/use-toast";
import FetchError from "@/components/error";
import useSession from "@/hooks/session";
import { sessionOptions } from "@/lib/session";
import { SessionData } from "@/types";
import $api from "@/lib/axios";
import { splitCamelCaseText } from "@/lib/utils";

export default function MerchantProfile({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { signOut, update } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    `/users/me`,
    () => $api({ token: session.token, url: `/users/me` }),
    {
      onSuccess(data) {
        const status = data.data.business.status;
        update({ ...session.user, status });
      },
      onError(err) {
        if (err.data.name === "UnauthorizedError") {
          signOut();
          toast({
            duration: 1000 * 5,
            variant: "destructive",
            title: splitCamelCaseText(error.name) || undefined,
            description:
              error.message ||
              error.data?.message ||
              "Your session has expired",
          });
          router.push(`/login?callbackUrl=/profile`);
          return;
        }
      },
    }
  );

  return (
    <>
      {session.user && (
        <ProfileLayout user={session.user}>
          {isLoading ? (
            <ProfileSkeleton />
          ) : error ? (
            <FetchError message={error.message} />
          ) : (
            <section className="sm:px-5">
              {session.user.type === "business" ? (
                <BusinessForm
                  data={data?.data}
                  token={session.token}
                  user={session.user}
                />
              ) : (
                <IndividualForm
                  data={data?.data}
                  token={session.token}
                  user={session.user}
                />
              )}
            </section>
          )}
        </ProfileLayout>
      )}
    </>
  );
}

export const getServerSideProps = (async (context) => {
  const session = await getIronSession<SessionData>(
    context.req,
    context.res,
    sessionOptions
  );

  if (!session.isLoggedIn) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }

  return { props: { session } };
}) satisfies GetServerSideProps<{ session: SessionData }>;
