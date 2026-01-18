import { Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold text-white bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
              Poster Marketplace
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Curated digital art posters for collectors and enthusiasts. 
            Museum-quality prints, instant downloads, secure payments.
          </p>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
