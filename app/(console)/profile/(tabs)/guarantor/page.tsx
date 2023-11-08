import { getServerSession } from "next-auth";
import Guarantor from "../components/forms/guarantor";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Spinner from "@/app/components/loading";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  return (
    <div className="py-5 sm:border-l-2 border-zinc-300 flex-1">
      {session?.token && (
        <section className="sm:px-5">
          <h1 className="font-bold mb-8">Guarantor Information</h1>
          <Guarantor user={{ ...session.user, token: session.token }} />
        </section>
      )}
    </div>
  );
}
