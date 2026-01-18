import Link from "next/link";
import { CheckCircle, Download, Sparkles, Home } from "lucide-react";
import { getPurchasesBySessionId } from "@/entities/purchase";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import Image from "next/image";
import { ClearCartOnSuccess } from "./ClearCartOnSuccess";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your payment was successful. Download your purchased digital posters.",
  robots: {
    index: false,
    follow: false,
  },
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  let purchases: any[] = [];

  if (sessionId) {
    purchases = await getPurchasesBySessionId(sessionId);
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <ClearCartOnSuccess />
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
            <CheckCircle className="relative w-24 h-24 text-green-500" />
          </div>
        </div>

        <div className="space-y-3">
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="w-3 h-3 mr-1" />
            Order Confirmed
          </Badge>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Payment Successful!
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
        </div>

        <Separator className="my-8" />

        {sessionId && (
          <div className="bg-muted/50 rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Order ID</p>
            <p className="font-mono text-sm break-all bg-background px-4 py-2 rounded-md">
              {sessionId}
            </p>
          </div>
        )}

        <div className="space-y-6 pt-4">
          {purchases.length > 0 ? (
            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl p-8 space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="bg-green-500/20 p-3 rounded-xl">
                  <Download className="w-6 h-6 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">Your Downloads are Ready</h2>
              </div>
              <p className="text-muted-foreground">
                Click the buttons below to download your high-resolution poster files. 
                You can download them unlimited times.
              </p>
              
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div 
                    key={purchase.id} 
                    className="bg-background rounded-lg p-4 flex items-center gap-4 border border-border"
                  >
                    <div className="relative w-16 h-20 flex-shrink-0">
                      <Image
                        src={purchase.poster.imageUrl}
                        alt={purchase.poster.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold">{purchase.poster.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {purchase.quantity}
                      </p>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/download/${purchase.downloadToken}`}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-xl border border-border p-6">
              <p className="text-muted-foreground">
                Your download links will be ready shortly. Please refresh this page in a few moments.
              </p>
            </div>
          )}

          <div className="pt-4">
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <Home className="w-5 h-5" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
