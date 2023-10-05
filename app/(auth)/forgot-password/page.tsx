import Container from "@/app/components/container";
import Footer from "@/app/components/footer";
import ForgotPasswordForm from "@/app/(auth)/forgot-password/components/form";

export default function ForgotPassword() {
  return (
    <>
      <main className="">
        <Container
          compact
          className="flex items-center justify-center my-16 md:my-24"
        >
          <ForgotPasswordForm />
        </Container>
      </main>
      <Footer bg="light" />
    </>
  );
}
