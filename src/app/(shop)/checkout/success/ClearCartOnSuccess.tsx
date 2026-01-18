"use client";

import { useEffect } from "react";
import { useCartStore } from "@/features/cart-management";

export function ClearCartOnSuccess() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
