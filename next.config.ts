import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com",
              "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
              "img-src 'self' data: https://pagead2.googlesyndication.com",
              "connect-src 'self' https://pagead2.googlesyndication.com",
              "style-src 'self' 'unsafe-inline'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
