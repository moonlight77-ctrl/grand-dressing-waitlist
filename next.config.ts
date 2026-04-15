import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      {
        protocol: "https",
        hostname: "aowesutiqjlvavuhcmcg.supabase.co",
      },
      
      {
        protocol: 'https',
        hostname: 'img01.ztat.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
