"use client";

import Link from "next/link";
import Image from "next/image";
import { Poster } from "../model/types";
import { formatPrice } from "@/shared/lib/formatPrice";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Sparkles, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/features/cart-management";
import { useEffect, useState } from "react";

interface PosterCardProps {
  poster: Poster;
  className?: string;
}

export function PosterCard({ poster, className }: PosterCardProps) {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    setIsInCart(items.some((item) => item.posterId === poster.id));
  }, [items, poster.id]);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart) {
      removeItem(poster.id);
    } else {
      addItem({
        posterId: poster.id,
        title: poster.title,
        price: poster.price,
        imageUrl: poster.imageUrl,
      });
    }
  };

  return (
    <Link href={`/posters/${poster.id}`} className={cn("group block", className)}>
      <div className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02] hover:border-primary/50">
        <div className="aspect-3/4 relative bg-muted overflow-hidden">
          <Image
            src={poster.imageUrl}
            alt={poster.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {poster.category && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                {poster.category}
              </Badge>
            </div>
          )}
          <button
            onClick={handleCartClick}
            className={cn(
              "absolute top-3 right-3 rounded-full p-2 backdrop-blur-sm transition-all duration-300",
              isInCart
                ? "bg-green-500/90 hover:bg-green-600/90"
                : "bg-primary/90 hover:bg-primary opacity-0 group-hover:opacity-100"
            )}
            aria-label={isInCart ? "Remove from cart" : "Add to cart"}
          >
            {isInCart ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <ShoppingCart className="w-4 h-4 text-primary-foreground" />
            )}
          </button>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
            {poster.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold bg-linear-to-r from-primary to-primary/70 bg-white bg-clip-text text-transparent">
              {formatPrice(poster.price)}
            </p>
            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
              View details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
