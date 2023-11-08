"use client";

import Spinner from "@/app/components/loading";
import { Button } from "@/app/components/ui/button";
import { AlertCircle, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleRefetch = () => {
    setRetrying(true);
    reset();
    setRetrying(false);
  };

  return (
    <div className="flex-1 flex flex-col py-8 items-center gap-5">
      <div className="flex items-center gap-4">
        <AlertCircle className="w-10 h-10 text-zinc-300"></AlertCircle>
        <h3 className="text-xl font-semibold text-zinc-500">
          {error.message || "Failed to fetch merchant information!"}
        </h3>
      </div>
      <Button
        size="lg"
        variant="secondary"
        className="text-lg gap-2 font-semibold text-primary hover:text-primary"
        onClick={handleRefetch}
      >
        Refetch
        {retrying ? (
          <Spinner twColor="text-primary before:bg-primary" twSize="w-8 h-8" />
        ) : (
          <RotateCw className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
