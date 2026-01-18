import { Skeleton } from "@/shared/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-3">
          <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="rounded-xl border p-6 space-y-4">
            <Skeleton className="h-16 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
