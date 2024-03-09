import Image from "next/image";
import Link from "next/link";

import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import welcome from "../../public/welcome.png";
import Layout from "@/components/layout";

export default function Welcome() {
  return (
    <Layout>
      <Container className="max-w-4xl flex flex-col gap-5 items-center py-16 md:py-24">
        <div className="w-64 h-64">
          <Image
            src={welcome}
            alt="Enthusiastically welcome the user"
            placeholder="blur"
          />
        </div>
        <h1 className="text-3xl font-bold">Welcome</h1>
        <p className="text-lg md:text-2xl font-medium text-center">
          You are officially part of the{" "}
          <span className="text-primary">Skippa</span> family! To maintain a
          safe and trustworthy environment, we kindly request you to complete
          our verification form.
        </p>
        <div className="max-w-xs w-full">
          <Button
            className="text-white text-xl font-semibold w-full hover:bg-primary"
            size="lg"
            asChild
          >
            <Link href="/onboarding">Continue</Link>
          </Button>
        </div>
      </Container>
    </Layout>
  );
}
