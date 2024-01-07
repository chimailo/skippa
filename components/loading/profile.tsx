import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="px-5 flex-1 space-y-8">
      <Skeleton className="w-full max-w-xs h-4 rounded-full" />
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        {Array.from({ length: 12 }, (_, k) => (
          <div key={k} className="w-full">
            <Skeleton className="w-3/5 h-4 mb-3 rounded-full" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
