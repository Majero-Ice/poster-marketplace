import { CatalogWithSearch } from "@/widgets/poster-grid";
import { getPosters } from "@/entities/poster";
import { Badge } from "@/shared/ui/badge";
import { Sparkles, Download, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Browse Premium Digital Art",
  description: "Browse our curated collection of museum-quality digital art posters, classic paintings, and photography. Instant download, high-resolution files.",
  openGraph: {
    title: "Digital Posters Marketplace - Browse Premium Art",
    description: "Browse our curated collection of museum-quality digital art posters.",
  },
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  const posters = await getPosters();

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/20 via-primary/10 to-background border border-border/50 p-12 md:p-16">
        <div className="absolute inset-0 bg-grid-white/5 mask-[radial-gradient(white,transparent_85%)]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Premium Digital Art
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Curated Digital Posters
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover museum-quality digital art, classic paintings, and photography. 
            Instant download, high-resolution files for your collection.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Download className="w-4 h-4 text-primary" />
              <span>Instant Download</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>High Resolution</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <CatalogWithSearch initialPosters={posters} />
      </section>
    </div>
  );
}
