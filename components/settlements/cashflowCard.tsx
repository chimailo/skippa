import { cn, formatAmount } from "@/lib/utils";

type Props = {
  title: string;
  amount: number;
  arrow?: string;
};

export default function CashflowCard({ amount, title, arrow }: Props) {
  return (
    <div className="rounded-lg bg-white p-3 space-y-3">
      <span className="flex items-center gap-1">
        <p className="text-xs">{title}</p>
        {arrow && (
          <span
            className={cn(
              "",
              title === "outflow" ? "text-red-600" : "text-green-600"
            )}
          >
            {arrow === "up" ? "&darr;" : "&uarr;"}
          </span>
        )}
      </span>
      <span
        className={cn(
          "font-bold",
          title === "inflow" ? "text-red-600" : "text-green-600"
        )}
      >
        {formatAmount(amount)}
      </span>
    </div>
  );
}
