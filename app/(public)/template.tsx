import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
