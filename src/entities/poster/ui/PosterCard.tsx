import Link from "next/link";
import Image from "next/image";
import { Poster } from "../model/types";
import { formatPrice } from "@/shared/lib/formatPrice";
import { cn } from "@/shared/lib/utils";

interface PosterCardProps {
  poster: Poster;
  className?: string;
}

export function PosterCard({ poster, className }: PosterCardProps) {
  return (
    <Link href={`/posters/${poster.id}`} className={cn("group block", className)}>
      <div className="relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg hover:scale-[1.02]">
        <div className="aspect-[3/4] relative bg-muted">
          <Image
            src={poster.imageUrl}
            alt={poster.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 text-card-foreground group-hover:text-primary transition-colors">
            {poster.title}
          </h3>
          {poster.category && (
            <p className="text-sm text-muted-foreground mb-2">{poster.category}</p>
          )}
          <p className="text-xl font-bold text-primary">{formatPrice(poster.price)}</p>
        </div>
      </div>
    </Link>
  );
}
