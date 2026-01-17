import Image from "next/image";
import { notFound } from "next/navigation";
import { getPosterById } from "@/entities/poster";
import { formatPrice } from "@/shared/lib/formatPrice";

interface PosterPageProps {
  params: Promise<{ id: string }>;
}

export default async function PosterPage({ params }: PosterPageProps) {
  const { id } = await params;
  const poster = await getPosterById(id);

  if (!poster) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
          <Image
            src={poster.imageUrl}
            alt={poster.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            {poster.category && (
              <p className="text-sm text-muted-foreground mb-2">{poster.category}</p>
            )}
            <h1 className="text-4xl font-bold mb-4">{poster.title}</h1>
            {poster.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">{poster.description}</p>
            )}
          </div>

          <div className="mt-auto pt-8 border-t border-border">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="text-4xl font-bold text-primary">{formatPrice(poster.price)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-md font-semibold hover:bg-primary/90 transition-colors">
                Buy Now
              </button>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✓ High-resolution digital file</p>
                <p>✓ Instant download after purchase</p>
                <p>✓ Multiple formats available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
