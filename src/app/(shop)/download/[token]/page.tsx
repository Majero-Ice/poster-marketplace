import { getPurchaseByToken } from "@/entities/purchase";
import { getPosterById } from "@/entities/poster";
import { DownloadButton } from "@/features/download-file";
import { CheckCircle, XCircle, Calendar, Mail, FileCheck, Home, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";

interface DownloadPageProps {
  params: Promise<{ token: string }>;
}

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { token } = await params;

  const purchase = await getPurchaseByToken(token);

  if (!purchase) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
            <XCircle className="relative w-24 h-24 text-destructive" />
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Invalid Download Link
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
          This download link is invalid or has expired. Please check your email
          for the correct link or contact support.
        </p>

        <Button asChild size="lg">
          <Link href="/">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  const poster = await getPosterById(purchase.posterId);

  if (!poster) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Poster Not Found
        </h1>
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-16">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
            <CheckCircle className="relative w-20 h-20 text-green-500" />
          </div>
        </div>

        <Badge variant="secondary" className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          Purchase Verified
        </Badge>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Your Download is Ready
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Thank you for your purchase! Click the button below to download your high-resolution poster.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted border border-border shadow-2xl">
          <Image
            src={poster.imageUrl}
            alt={poster.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        <div className="flex flex-col justify-center space-y-8">
          <div>
            {poster.category && (
              <Badge variant="secondary" className="mb-3">
                {poster.category}
              </Badge>
            )}
            <h2 className="text-3xl font-bold mb-3">{poster.title}</h2>
            {poster.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">{poster.description}</p>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {new Date(purchase.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-muted-foreground">Customer Email</p>
                <p className="font-medium">{purchase.customerEmail}</p>
              </div>
            </div>
            {purchase.downloadedAt && (
              <div className="flex items-center gap-3 text-sm">
                <FileCheck className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-muted-foreground">First Downloaded</p>
                  <p className="font-medium">
                    {new Date(purchase.downloadedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <DownloadButton token={token} />
        </div>
      </div>

      <div className="text-center">
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="w-4 h-4" />
            Browse More Posters
          </Link>
        </Button>
      </div>
    </div>
  );
}
