import UserSection from "./components/user";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="block sm:flex space-y-4 sm:space-y-0 px-5 md:py-14 py-7 ">
      <UserSection />
      {children}
    </div>
  );
}
