import { Poster, PosterCard } from "@/entities/poster";

interface PosterGridProps {
  posters: Poster[];
}

export function PosterGrid({ posters }: PosterGridProps) {
  if (posters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posters available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {posters.map((poster) => (
        <PosterCard key={poster.id} poster={poster} />
      ))}
    </div>
  );
}
