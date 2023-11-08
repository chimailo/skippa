import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="block sm:flex space-y-4 sm:space-y-0 px-5 md:py-14 py-7 ">
      <section className="sm:w-64 w-full flex flex-col items-center">
        <div className="space-y-2 py-6 border-b-2 border-zinc-300 w-full flex flex-col items-center">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="w-full max-w-xs h-4 rounded-full" />
          <Skeleton className="w-full max-w-xs h-2.5 rounded-full" />
        </div>
        <div className="p-5 flex flex-col items-center gap-3 w-full">
          <Skeleton className="w-full h-10 rounded-lg" />
          <Skeleton className="w-full h-10 rounded-lg" />
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
      </section>
      <div className="p-5 sm:border-l-2 border-zinc-300 flex-1 space-y-8">
        <Skeleton className="w-full max-w-xs h-4 rounded-full" />
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
          {Array.from({ length: 4 }, (_, k) => (
            <div key={k} className="w-full">
              <Skeleton className="w-3/5 h-4 mb-3 rounded-full" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>
          ))}
        </div>
        <hr className="bg-zinc-100 my-4 h-0.5" />
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
          {Array.from({ length: 3 }, (_, k) => (
            <div key={k} className="w-full">
              <Skeleton className="w-3/5 h-4 mb-3 rounded-full" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
