"use client";

import { useCartStore } from "@/features/cart-management";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface AddToCartButtonProps {
  posterId: string;
  title: string;
  price: number;
  imageUrl: string;
}

export function AddToCartButton({ posterId, title, price, imageUrl }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      posterId,
      title,
      price,
      imageUrl,
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant="outline"
      size="lg"
      className="w-full text-base transition-all border-0 duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25 hover:bg-neutral-900 active:scale-95 group"
    >
      <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12"/>
      Add to Cart
    </Button>
  );
}
