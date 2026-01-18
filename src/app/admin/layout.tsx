import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - PosterMart",
  description: "Admin panel for managing the poster marketplace",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased min-h-screen">
      {children}
    </div>
  );
}
