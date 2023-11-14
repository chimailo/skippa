import { cn } from "@/lib/utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
  compact?: boolean;
};

export default function Container({ children, className, compact }: Props) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        compact && "max-w-screen-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
