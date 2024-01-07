import Container from "@/components/container";
import Footer from "@/components/footer";
import Layout from "@/components/layout";
import Link from "next/link";

export default function FAQs() {
  return (
    <Layout>
      <main className="min-h-[calc(100vh_-_25rem)]">
        <Container compact className="my-8 md:my-16">
          <h1 className="font-bold text-2xl text-center my-6">
            Page not found
          </h1>
          <p className="text-center">
            You have reached a page that does not exist. Go to
            <Link href="/" className="underline text-primary ml-1">
              Home
            </Link>
          </p>
        </Container>
      </main>
      <Footer />
    </Layout>
  );
}
