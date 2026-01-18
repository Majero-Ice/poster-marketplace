"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Poster not found</h2>
        <p className="text-muted-foreground">
          The poster you're looking for doesn't exist or has been removed.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to catalog</Link>
        </Button>
      </div>
    </div>
  );
}
