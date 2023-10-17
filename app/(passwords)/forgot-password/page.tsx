import Container from "@/app/components/container";
import ForgotPasswordForm from "@/app/(passwords)/forgot-password/components/form";

export default function ForgotPassword() {
  return (
    <main className="">
      <Container
        compact
        className="flex items-center justify-center my-16 md:my-24"
      >
        <ForgotPasswordForm />
      </Container>
    </main>
  );
}
