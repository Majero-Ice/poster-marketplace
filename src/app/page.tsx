import { PosterGrid } from "@/widgets/poster-grid";
import { getPosters } from "@/entities/poster";

export default async function Home() {
  const posters = await getPosters();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Digital Posters Marketplace</h1>
        <p className="text-muted-foreground">Discover beautiful digital art and photography</p>
      </div>
      <PosterGrid posters={posters} />
    </div>
  );
}
