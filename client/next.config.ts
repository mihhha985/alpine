import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
	env: {
    API_URL: "http://localhost:1337",
  },
  images: {
		dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
				pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
