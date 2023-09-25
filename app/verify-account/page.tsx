import Container from "@/app/components/container";
import VerifyAccountForm from "@/app/verify-account/components/form";

export default function VerifyAccount() {
  return (
    <main className="">
      <Container
        compact
        className="flex items-center justify-center my-16 md:my-24"
      >
        <VerifyAccountForm />
      </Container>
    </main>
  );
}
