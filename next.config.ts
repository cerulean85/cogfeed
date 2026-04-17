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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://*.adtrafficquality.google",
              "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://coupa.ng https://*.coupang.com https://ads-partners.coupang.com https://*.coupangcdn.com https://*.adtrafficquality.google https://www.google.com",
              "img-src 'self' data: https://pagead2.googlesyndication.com",
              "connect-src 'self' https://pagead2.googlesyndication.com https://*.adtrafficquality.google https://*.googlesyndication.com https://*.doubleclick.net",
              "style-src 'self' 'unsafe-inline'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
