import { type ReactNode, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type SvgIconProps = ComponentProps<"svg"> & {
  viewBox?: string;
  children: ReactNode;
  className?: string;
};

export default function Svg(props: SvgIconProps): JSX.Element {
  const { children, className, viewBox = "0 0 24 24", ...rest } = props;

  return (
    <svg
      viewBox={viewBox}
      aria-hidden
      className={cn("select-none inline-block flex-shrink-0", className)}
      {...rest}
    >
      {children}
    </svg>
  );
}
