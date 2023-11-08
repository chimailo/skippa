"use client";

import Spinner from "@/app/components/loading";

export default function Loading() {
  return (
    <div className="w-full min-h-[25rem] py-12 flex items-center justify-center">
      <Spinner twColor="text-primary before:bg-primary" twSize="w-8 h-8" />
    </div>
  );
}
