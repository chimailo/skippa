import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getIronSession } from "iron-session";
import useSWR from "swr";

import UserForm from "@/components/profile/forms/user";
import Security from "@/components/profile/security";
import ProfileLayout from "@/components/profile/layout";
import { sessionOptions } from "@/lib/session";
import { SessionData } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import useSession from "@/hooks/session";
import $api from "@/lib/axios";
import { splitCamelCaseText } from "@/lib/utils";
import ProfileSkeleton from "@/components/loading/profile";
import FetchError from "@/components/error";

export default function Profile({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { update, signOut } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const { error, isLoading } = useSWR(
    `/users/me`,
    () => $api({ token: session.token, url: `/users/me` }),
    {
      onSuccess(data) {
        const status = data.data.business.status;
        const role = data.data.role;
        update({ ...session.user, status, role });
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
    <ProfileLayout user={session.user!}>
      {isLoading ? (
        <ProfileSkeleton />
      ) : error ? (
        <FetchError message={error.message} />
      ) : (
        <>
          <section className="sm:px-5">
            <h1 className="font-bold mb-8">User Information</h1>
            <UserForm user={session.user!} />
          </section>
          <hr className="bg-zinc-300 my-4 h-0.5" />
          <section className="sm:px-5">
            <h1 className="font-bold mb-4">Security</h1>
          </section>
          <Security user={session.user!} />
        </>
      )}
    </ProfileLayout>
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

  if (!session.user?.verificationCount && session.user?.type !== "admin") {
    return {
      redirect: {
        destination: `/onboarding`,
        permanent: false,
      },
    };
  }

  return { props: { session } };
}) satisfies GetServerSideProps<{ session: SessionData }>;
