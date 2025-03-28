import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname: "image.mux.",
      }
    ],
    domains: ["utfs.io"],
  }
};

export default nextConfig;
