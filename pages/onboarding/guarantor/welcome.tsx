import Container from "@/components/container";
import Layout from "@/components/layout";

export default function Welcome() {
  return (
    <Layout>
      <Container className="max-w-4xl flex justify-center items-center py-16 h-[calc(100vh_-_4rem)]">
        <p className="text-lg sm:text-2xl font-medium text-center">
          Your response has been successfully recorded and your details are
          being verified. Thank you for taking the time to fill out the
          guarantor form.
        </p>
      </Container>
    </Layout>
  );
}
