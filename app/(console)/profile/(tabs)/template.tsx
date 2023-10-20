import UserSection from "./components/user";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="block sm:flex space-y-4 sm:space-y-0">
      <UserSection />
      {children}
    </div>
  );
}
