"use client";

import Link from "next/link";
import { XCircle, Home, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-3xl mx-auto py-16">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />
            <XCircle className="relative w-24 h-24 text-orange-500" />
          </div>
        </div>

        <div className="space-y-3">
          <Badge variant="secondary" className="mb-2">
            <Info className="w-3 h-3 mr-1" />
            Order Not Completed
          </Badge>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Payment Cancelled
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Your payment was cancelled. No charges have been made to your account.
          </p>
        </div>

        <Separator className="my-8" />

        <div className="bg-muted/50 rounded-xl border border-border p-6">
          <p className="text-muted-foreground">
            If you experienced any issues during checkout, please try again. 
            All your items are still available in our catalog.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="w-5 h-5" />
              Browse Posters
            </Link>
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            size="lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
