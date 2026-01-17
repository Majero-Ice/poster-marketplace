export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Poster Marketplace. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Digital art posters marketplace
          </p>
        </div>
      </div>
    </footer>
  );
}
