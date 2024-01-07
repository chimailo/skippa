import Layout from "@/components/layout";
import UserSection from "@/components/profile/user";
import { User } from "@/types";

export default function ProfileLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const STATUS_BANNER = [
    "pending-activation",
    "processing-activation",
    "pending",
  ];

  return (
    <Layout auth user={user} sidebar={{ active: "profile" }}>
      {user.type !== "admin" && STATUS_BANNER.includes(user.status) && (
        <div className="bg-[#4CD964] rounded-t-lg py-1 px-3 text-center text-sm font-medium uppercase text-white">
          We are currently verifying your details. You will BE NOTIFIED once the
          verification process is complete.
        </div>
      )}
      <div className="block sm:flex space-y-4 sm:space-y-0 px-5 md:py-8 py-5 ">
        <UserSection user={user} />
        <div className="border-l-2 hidden sm:block min-h-[calc(100vh_-_12rem)] border-zinc-300"></div>
        <section className="py-5 flex-1">{children}</section>
      </div>
    </Layout>
  );
}
