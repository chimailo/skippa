"use client";

import Spinner from "../components/loading";

export default function Loading() {
  return (
    <div className="w-full py-12 flex items-center justify-center">
      <Spinner twColor="text-primary before:bg-primary" twSize="w-8 h-8" />
    </div>
  );
}
