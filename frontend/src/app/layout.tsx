// frontend/src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutClient from "./LayoutClient";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://optimizemaximal.com";

// This is where the Metadata goes. It MUST be in a server component.
export const metadata: Metadata = {
  title: {
    default: "Optimize Maximal AI | Agentic App Template",
    template: "%s | Optimize Maximal AI"
  },
  description: "Agentic AI Optimized Application Development Template. Build custom AI apps fast and autonomously.",
  keywords: ["Agentic AI", "NextJS", "Python", "Antigravity IDE", "Ollama", "Open Router", "Optimize Maximal AI"],
  authors: [{ name: "Optimize Maximal AI Team" }],
  creator: "Optimize Maximal AI",
  publisher: "Optimize Maximal AI",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Optimize Maximal AI | Agentic App Template",
    description: "Agentic AI Optimized Application Development Template.",
    url: siteUrl,
    siteName: "Optimize Maximal AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Optimize Maximal AI Platform Preview" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Optimize Maximal AI | Agentic App Template",
    description: "Agentic AI Optimized Application Development Template.",
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