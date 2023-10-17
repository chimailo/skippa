import Container from "@/app/components/container";
import WhySkippa from "@/app/components/whyskippa";
import BusinessTypeForm from "@/app/(public)/(home)/components/form";
import HeroText from "@/app/(public)/(home)/components/hero";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <Container
        compact
        className="grid md:grid-flow-col md:auto-cols-fr md:gap-6 gap-12 my-12"
      >
        <HeroText />
        <BusinessTypeForm />
      </Container>
      <WhySkippa />
    </main>
  );
}
