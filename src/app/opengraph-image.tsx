import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "CogFeed — AI 인지 오류 피드백 서비스";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fontData = readFileSync(join(process.cwd(), "public/Inter-Bold.woff"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* 아이콘 배경 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 22,
            background: "rgba(167, 139, 250, 0.2)",
            marginBottom: 28,
          }}
        >
          {/* lucide Brain SVG */}
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 18V5" />
            <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
            <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
            <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
            <path d="M18 18a4 4 0 0 0 2-7.464" />
            <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
            <path d="M6 18a4 4 0 0 1-2-7.464" />
            <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
          </svg>
        </div>

        {/* 서비스명 */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-2px",
            marginBottom: 20,
          }}
        >
          CogFeed
        </div>

        {/* 구분선 */}
        <div
          style={{
            width: 60,
            height: 3,
            background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
            borderRadius: 2,
            marginBottom: 24,
          }}
        />

        {/* 설명 */}
        <div
          style={{
            fontSize: 28,
            color: "#c4b5fd",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          AI 인지 오류 피드백 서비스
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: fontData, weight: 700 }],
    }
  );
}
