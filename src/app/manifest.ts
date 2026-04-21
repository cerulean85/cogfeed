import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CogFeed",
    short_name: "CogFeed",
    description: "AI가 당신의 기록을 분석해 인지 오류를 진단하고 개인화 피드백을 제공합니다.",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#7c3aed",
    theme_color: "#7c3aed",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["productivity", "health"],
  };
}
