import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import Container from "@/app/components/container";
import Footer from "@/app/components/footer";
import WhySkippa from "@/app/components/whyskippa";
import SignUpForm from "@/app/signup/components/form";
import HeroText from "@/app/signup/components/hero";
import { authOptions } from "../api/auth/[...nextauth]/options";

export default async function Signup() {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (session?.user?.email) {
    redirect("/business-verification");
  }

  return (
    <>
      <main className="flex flex-col items-center justify-between">
        <Container
          compact
          className="grid md:grid-flow-col md:auto-cols-fr md:gap-6 gap-12 my-12"
        >
          <HeroText />
          <SignUpForm />
        </Container>
        <WhySkippa />
      </main>
      <Footer />
    </>
  );
}