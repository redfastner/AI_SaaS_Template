import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHost = '';

if (supabaseUrl) {
  try {
    supabaseHost = new URL(supabaseUrl).hostname;
  } catch (e) {
    console.warn(
      "next.config.ts: Invalid NEXT_PUBLIC_SUPABASE_URL format. Remote image optimization will be disabled."
    );
  }
} else {
  console.warn(
    "next.config.ts: NEXT_PUBLIC_SUPABASE_URL is not set. Remote image optimization from Supabase Storage will be disabled."
  );
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: 'https' as const,
            hostname: supabaseHost,
            port: '',
            pathname: '/storage/v1/object/public/**',
          },
        ]
      : [],
  },
};

export default nextConfig;