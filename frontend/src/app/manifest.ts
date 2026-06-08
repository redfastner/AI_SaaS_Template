import { MetadataRoute } from 'next'

// CRITICAL: Forces this manifest to generate as a static file during 'npm run build'
export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Optimize Maximal AI | Agentic App Template',
    short_name: 'Optimize Maximal AI',
    description: 'Agentic AI Optimized Application Development Template.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}