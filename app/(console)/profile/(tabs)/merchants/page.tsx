import { getServerSession } from "next-auth";
import BusinessForm from "../components/forms/business";
import IndividualForm from "../components/forms/individual";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Spinner from "@/app/components/loading";

const fetchMerchant = async (token: string, id: string) => {
  const res = await fetch(`${process.env.baseUrl}/merchants/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch data");
  }

  return data;
};

export default async function Profile() {
  const session = await getServerSession(authOptions);

  return (
    <div className="py-5 sm:border-l-2 border-zinc-300 flex-1">
      {session && session.token ? (
        <section className="sm:px-5">
          {/* <h1 className="font-bold mb-8">Guarantor Information</h1> */}
          {session.user.type === "business" ? (
            <BusinessForm user={{ ...session.user, token: session.token }} />
          ) : (
            <IndividualForm user={{ ...session.user, token: session.token }} />
          )}
        </section>
      ) : (
        <div className="w-full py-12 flex items-center justify-center">
          <Spinner twColor="text-primary before:bg-primary" twSize="w-8 h-8" />
        </div>
      )}
    </div>
  );
}
