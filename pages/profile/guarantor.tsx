import { useRouter } from "next/navigation";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getIronSession } from "iron-session";
import useSWR from "swr";

import GuarantorForm from "@/components/profile/forms/guarantor";
import ProfileLayout from "@/components/profile/layout";
import ProfileSkeleton from "@/components/loading/profile";
import FetchError from "@/components/error";
import { useToast } from "@/components/ui/use-toast";
import useSession from "@/hooks/session";
import { splitCamelCaseText } from "@/lib/utils";
import { sessionOptions } from "@/lib/session";
import $api from "@/lib/axios";
import { SessionData } from "@/types";

export default function Guarantor({
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
            duration: 1000 * 4,
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
              <h1 className="font-bold mb-8">Guarantor Information</h1>
              <GuarantorForm
                data={data?.data}
                token={session.token}
                user={session.user}
              />
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

  return { props: { session } };
}) satisfies GetServerSideProps<{ session: SessionData }>;
