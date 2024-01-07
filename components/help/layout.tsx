import Container from "@/components/container";
import Layout from "@/components/layout";
import Header from "@/components/help/header";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function FAQs({ title, children }: Props) {
  return (
    <Layout>
      <main className="min-h-[calc(100vh_-_25rem)]">
        <Container compact className="my-8 sm:my-16 max-w-5xl">
          <Header />
          {title && (
            <h1 className="font-bold text-2xl text-center text-primary">
              {title}
            </h1>
          )}
          {children}
        </Container>
      </main>
    </Layout>
  );
}
