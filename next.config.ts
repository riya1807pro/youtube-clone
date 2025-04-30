import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname: "image.mux.",
      }
    ],
    domains: ["utfs.io"],
  }
=======
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
      {
        protocol: "https",
        hostname: "vt38fw71wp.ufs.sh",
      },
    ],
  },
>>>>>>> 9f21a4b (internal structure improvements)
};

export default nextConfig;
