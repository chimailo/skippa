import { cn } from "@/lib/utils";

type Props = {
  name: string;
  view: string;
  className?: string;
  handleChange: () => void;
};

export default function TransactionsView({
  className,
  name,
  view,
  handleChange,
}: Props) {
  return (
    <div className="w-40">
      <label
        htmlFor={name}
        className={cn(
          "px-9 py-2 text-sm font-bold w-full block text-center capitalize rounded-full hover:cursor-pointer",
          className,
          view === name
            ? "bg-primary text-white"
            : "text-primary border border-primary"
        )}
      >
        {name}
        <input
          id={name}
          type="radio"
          value={view}
          checked={view === name}
          className="sr-only"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
