import { Skeleton } from "@/shared/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Skeleton className="h-10 w-48" />

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl border">
            <Skeleton className="w-24 h-24 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
