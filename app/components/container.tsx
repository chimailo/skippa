import { cn } from "@/app/utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export default function Container({ children, className }: Props) {
  return (
    <div
      className={cn("mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl", className)}
    >
      {children}
    </div>
  );
}
