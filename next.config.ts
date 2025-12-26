import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow subdomain access in development - include all possible subdomain patterns
  allowedDevOrigins: [
    'localhost',
    'localhost:3000',
    'dineos.localhost',
    'dineos.localhost:3000',
    '*.dineos.localhost',
    '*.dineos.localhost:3000',
    '*.localhost',
    '*.localhost:3000',
    'local-origin.dev', 
    '*.local-origin.dev',
    '*.menuly',
    '*.menuly:3000',
    '*.menuly:8080',
  ],

  // Development server configuration for subdomain WebSocket support
  devIndicators: false,
  
  // Add rewrites to proxy API calls to avoid CORS issues
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: 'http://:tenant.menuly:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;

