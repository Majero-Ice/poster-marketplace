import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Digital Posters Marketplace - Premium Art & Photography",
    template: "%s | Digital Posters Marketplace",
  },
  description: "Discover museum-quality digital art posters, classic paintings, and photography. Instant download, high-resolution files for your collection. Secure payment via Stripe.",
  keywords: ["digital art", "posters", "art prints", "photography", "classic paintings", "museum quality", "high resolution"],
  authors: [{ name: "Digital Posters Marketplace" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Digital Posters Marketplace",
    title: "Digital Posters Marketplace - Premium Art & Photography",
    description: "Discover museum-quality digital art posters. Instant download, high-resolution files.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Posters Marketplace - Premium Art & Photography",
    description: "Discover museum-quality digital art posters. Instant download, high-resolution files.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
