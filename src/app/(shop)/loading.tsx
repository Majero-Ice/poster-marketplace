import { PosterGridSkeleton } from "@/widgets/poster-grid";
import { Skeleton } from "@/shared/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-border p-12 md:p-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
          <Skeleton className="h-6 w-full max-w-xl mx-auto" />
          <div className="flex justify-center gap-6 pt-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
        <PosterGridSkeleton />
      </section>
    </div>
  );
}
