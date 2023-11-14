import { cn } from "@/lib/utils";
import styles from "./styles.module.css";

type Props = {
  className?: string;
  twColor?: string;
  twSize?: string;
};

export default function Spinner({ className, twColor, twSize }: Props) {
  const color = twColor || "text-white before:bg-white";

  return (
    <div className={cn("relative", styles.loader, twSize, className)}>
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full",
          styles.loaderChild,
          color
        )}
      />
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full",
          styles.loaderChild,
          color
        )}
      />
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full",
          styles.loaderChild,
          color
        )}
      />
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full",
          styles.loaderChild,
          color
        )}
      />
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full",
          styles.loaderChild,
          color
        )}
      />
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full",
          styles.loaderChild,
          color
        )}
      />
    </div>
  );
}
