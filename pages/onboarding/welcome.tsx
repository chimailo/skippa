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
        <h1 className="text-3xl font-bold">Thank You</h1>
        <p className="text-lg md:text-2xl font-medium text-center">
          Your information has been received and we are currently verifying your
          details. You will be notified once the verification process is
          complete.
        </p>
        <div className="max-w-xs w-full">
          <Button
            className="text-white text-xl font-semibold w-full hover:bg-primary"
            size="lg"
            asChild
          >
            <Link href="/profile">Continue</Link>
          </Button>
        </div>
      </Container>
    </Layout>
  );
}
