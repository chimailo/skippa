import Container from "@/app/components/container";
import ResetPasswordForm from "@/app/(passwords)/reset-password/components/form";

export default function ResetPassword() {
  return (
    <main className="">
      <Container
        compact
        className="flex items-center justify-center my-16 md:my-24"
      >
        <ResetPasswordForm />
      </Container>
    </main>
  );
}
