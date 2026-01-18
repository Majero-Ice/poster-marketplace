"use client";

import Image from "next/image";
import { CartItem } from "../model/types";

interface CartItemCardProps {
  item: CartItem;
  onIncrement: (posterId: string) => void;
  onDecrement: (posterId: string) => void;
  onRemove: (posterId: string) => void;
}

export function CartItemCard({ item, onIncrement, onDecrement, onRemove }: CartItemCardProps) {
  const subtotal = item.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl bg-card">
      <div className="relative w-full sm:w-24 h-48 sm:h-32 flex-shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-semibold text-lg truncate">{item.title}</h3>
          <p className="text-muted-foreground">${(item.price / 100).toFixed(2)}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
          <div className="flex items-center gap-2 border rounded-lg w-fit">
            <button
              onClick={() => onDecrement(item.posterId)}
              className="px-3 py-1.5 hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-3 font-medium">{item.quantity}</span>
            <button
              onClick={() => onIncrement(item.posterId)}
              className="px-3 py-1.5 hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          
          <button
            onClick={() => onRemove(item.posterId)}
            className="text-destructive hover:text-destructive/80 text-red-700 text-sm transition-colors w-fit"
          >
            Remove
          </button>
        </div>
      </div>
      
      <div className="text-right sm:text-left sm:self-start">
        <p className="text-lg font-bold text-primary">${(subtotal / 100).toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">Subtotal</p>
      </div>
    </div>
  );
}
