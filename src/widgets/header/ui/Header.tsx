"use client";

import Link from "next/link";
import { Sparkles, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/features/cart-management";
import { useEffect, useState } from "react";

export function Header() {
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setTotalItems(getTotalItems());
  }, [getTotalItems]);

  useEffect(() => {
    const unsubscribe = useCartStore.subscribe(() => {
      setTotalItems(getTotalItems());
    });
    return unsubscribe;
  }, [getTotalItems]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between min-h-[56px]">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-2xl font-bold text-foreground hover:text-primary transition-colors group focus:outline-none focus-visible:outline-none active:outline-none"
          >
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Sparkles className="w-5 h-5 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Poster Marketplace
            </span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link 
              href="/cart" 
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-primary/10 transition-colors group focus:outline-none focus-visible:outline-none active:outline-none"
            >
              <ShoppingCart className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
