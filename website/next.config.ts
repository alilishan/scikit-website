import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The old "Cloud & Microsoft 365" page was split into Cloud & DevOps and Microsoft 365 & IT.
      { source: "/services/cloud-and-it", destination: "/services/microsoft-365", permanent: true },
    ];
  },
};

export default nextConfig;
