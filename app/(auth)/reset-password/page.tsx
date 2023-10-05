import Container from "@/app/components/container";
import Footer from "@/app/components/footer";
import ResetPasswordForm from "@/app/(auth)/reset-password/components/form";

export default function ResetPassword() {
  return (
    <>
      <main className="">
        <Container
          compact
          className="flex items-center justify-center my-16 md:my-24"
        >
          <ResetPasswordForm />
        </Container>
      </main>
      <Footer bg="light" />
    </>
  );
}
