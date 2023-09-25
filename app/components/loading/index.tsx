import { cn } from "@/app/utils";
import "./styles.css";

type Props = {
  className?: string;
  twColor?: string;
  twSize?: string;
};

export default function Spinner({ className, twColor, twSize }: Props) {
  // color: 'text-secondary-500 before:bg-secondary-500'
  // size: 'w-3 h-3'

  return (
    <div className={cn("loader relative", twSize, className)}>
      <div
        className={cn(
          "loader-dot absolute left-0 top-0 h-full w-full",
          twColor
        )}
      />
      <div
        className={cn(
          "loader-dot absolute left-0 top-0 h-full w-full",
          twColor
        )}
      />
      <div
        className={cn(
          "loader-dot absolute left-0 top-0 h-full w-full",
          twColor
        )}
      />
      <div
        className={cn(
          "loader-dot absolute left-0 top-0 h-full w-full",
          twColor
        )}
      />
      <div
        className={cn(
          "loader-dot absolute left-0 top-0 h-full w-full",
          twColor
        )}
      />
      <div
        className={cn(
          "loader-dot absolute left-0 top-0 h-full w-full",
          twColor
        )}
      />
    </div>
  );
}
