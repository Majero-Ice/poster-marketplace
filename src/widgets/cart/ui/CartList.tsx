"use client";

import { CartItemCard } from "@/entities/cart-item";
import { useCartStore } from "@/features/cart-management";

export function CartList() {
  const items = useCartStore((state) => state.items);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemCard
          key={item.posterId}
          item={item}
          onIncrement={incrementQuantity}
          onDecrement={decrementQuantity}
          onRemove={removeItem}
        />
      ))}
    </div>
  );
}
