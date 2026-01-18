"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Zap, Loader2 } from "lucide-react";

interface BuyButtonProps {
  posterId: string;
}

export function BuyButton({ posterId }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ posterId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error starting checkout:", error);
      alert("Failed to start checkout. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePurchase}
      disabled={isLoading}
      size="lg"
      className="w-full text-base transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25 hover:bg-neutral-900 active:scale-95 group"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Zap className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
          Buy Now
        </>
      )}
    </Button>
  );
}
