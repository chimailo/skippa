import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
  return (
    <div className="block space-y-3 py-3">
      <div className="px-3">
        <Skeleton className="h-10 w-full max-w-lg rounded-md" />
      </div>
      <hr className="bg-slate-100" />
      <div className="flex justify-end px-5">
        <Skeleton className="h-9 w-14" />
      </div>
      <Skeleton className="h-[60px] w-full"></Skeleton>
      {Array.from({ length: 20 }, (_, k) => (
        <div
          key={k}
          className="flex items-center justify-around h-12 overflow-auto shrink-0"
        >
          <Skeleton className="w-6 h-4 rounded"></Skeleton>
          <Skeleton className="w-48 h-4 rounded-full"></Skeleton>
          <Skeleton className="w-32 h-4 rounded-full"></Skeleton>
          <Skeleton className="w-36 h-4 rounded-full"></Skeleton>
          <Skeleton className="w-32 h-4 rounded-full"></Skeleton>
          <Skeleton className="w-24 h-4 rounded-full"></Skeleton>
        </div>
      ))}
      <div className="flex justify-end px-5">
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}
