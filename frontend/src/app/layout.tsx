// frontend/src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutClient from "./LayoutClient";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://viraldiffusion.com";

// This is where the Metadata goes. It MUST be in a server component.
export const metadata: Metadata = {
  title: {
    default: "Viral Diffusion | Content Automation Platform",
    template: "%s | Viral Diffusion"
  },
  description: "Generate Stunning Panoramic Posts, Reels, Avatars, and Ads with bleeding-edge AI. The professional OS for creators and business automation.",
  keywords: ["AI Panoramic Photos", "AI Panoramic Posts", "AI Carousal Posts", "AI Ads Easy", "AI Avatars", "Content Automation", "Panoramic Edge", "Viral Diffusion"],
  authors: [{ name: "Viral Diffusion Team" }],
  creator: "Viral Diffusion",
  publisher: "Viral Diffusion",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Viral Diffusion | Content Automation Platform",
    description: "Bleeding-edge AI for Stunning Panoramic Posts, Avatars, and Ads.",
    url: siteUrl,
    siteName: "Viral Diffusion",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Viral Diffusion Platform Preview" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Viral Diffusion | Content Automation Platform",
    description: "Generate high-end AI content in minutes.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#e7e5e4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased overflow-hidden overscroll-none selection:bg-purple-500/30">
        {/* We wrap the client-side logic here */}
        <LayoutClient>
          {children}
          <Toaster />
          <Analytics />
        </LayoutClient>
      </body>
    </html>
  );
}