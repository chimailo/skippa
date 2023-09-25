import Container from "@/app/components/container";
import Footer from "@/app/components/footer";
import WhySkippa from "@/app/components/whyskippa";
import SignUpForm from "@/app/signup/components/form";
import HeroText from "@/app/signup/components/hero";

export default function Signup() {
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
