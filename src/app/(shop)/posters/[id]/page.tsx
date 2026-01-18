import Image from "next/image";
import { notFound } from "next/navigation";
import { getPosterById } from "@/entities/poster";
import { formatPrice } from "@/shared/lib/formatPrice";
import { AddToCartButton } from "@/features/add-to-cart";
import { BuyButton } from "@/features/purchase-poster";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Separator } from "@/shared/ui/separator";
import { Download, Shield, Sparkles, Image as ImageIcon, FileCheck } from "lucide-react";
import type { Metadata } from "next";

interface PosterPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PosterPageProps): Promise<Metadata> {
  const { id } = await params;
  const poster = await getPosterById(id);

  if (!poster) {
    return {
      title: "Poster Not Found",
    };
  }

  return {
    title: poster.title,
    description: poster.description || `Buy ${poster.title} - High-resolution digital art poster. Instant download after purchase.`,
    openGraph: {
      title: poster.title,
      description: poster.description || `High-resolution digital art poster`,
      images: [
        {
          url: poster.imageUrl,
          alt: poster.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: poster.title,
      description: poster.description || `High-resolution digital art poster`,
      images: [poster.imageUrl],
    },
  };
}

export default async function PosterPage({ params }: PosterPageProps) {
  const { id } = await params;
  const poster = await getPosterById(id);

  if (!poster) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-3">
          <div className="sticky top-8">
            <div className="relative aspect-3/4 bg-muted rounded-2xl overflow-hidden border border-border shadow-2xl">
              <Image
                src={poster.imageUrl}
                alt={poster.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <div className="space-y-6">
            {poster.category && (
              <Badge variant="secondary" className="w-fit">
                <Sparkles className="w-3 h-3 mr-1" />
                {poster.category}
              </Badge>
            )}
            
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">{poster.title}</h1>
              {poster.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">{poster.description}</p>
              )}
            </div>

            <Separator />

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details" className=" hover:bg-neutral-900">Details</TabsTrigger>
                <TabsTrigger value="features" className=" hover:bg-neutral-900">Features</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Format</p>
                      <p className="text-muted-foreground">High-resolution JPG</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FileCheck className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Quality</p>
                      <p className="text-muted-foreground">Museum-grade print quality</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Download className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Delivery</p>
                      <p className="text-muted-foreground">Instant digital download</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="features" className="space-y-3 mt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5" />
                    <p className="text-muted-foreground">Secure payment processing via Stripe</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Download className="w-4 h-4 text-primary mt-0.5" />
                    <p className="text-muted-foreground">Unlimited downloads after purchase</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                    <p className="text-muted-foreground">Perfect for framing and display</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileCheck className="w-4 h-4 text-primary mt-0.5" />
                    <p className="text-muted-foreground">Personal use license included</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="rounded-xl border border-border bg-muted/50 p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-5xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-white">
                    {formatPrice(poster.price)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <BuyButton posterId={poster.id} />
                
                <AddToCartButton 
                  posterId={poster.id} 
                  title={poster.title}
                  price={poster.price}
                  imageUrl={poster.imageUrl}
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-2">
                <Shield className="w-3 h-3" />
                <span>Secure checkout powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
