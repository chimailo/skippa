import { getServerSession } from "next-auth";
import UserSection from "./components/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await getServerSession(authOptions);

  return (
    <>
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
            {children}
          </>
        )}
      </div>
    </>
  );
}
