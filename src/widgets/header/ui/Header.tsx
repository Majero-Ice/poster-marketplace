import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
            Poster Marketplace
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Catalog
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
