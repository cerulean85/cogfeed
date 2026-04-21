import sharp from "sharp";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/icons");
await mkdir(outDir, { recursive: true });

function makeSvg(size) {
  const r = size / 2;
  const iconScale = size / 512;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- 배경 원 -->
  <circle cx="${r}" cy="${r}" r="${r}" fill="#7c3aed"/>

  <!-- 뇌 아이콘 (Brain) — lucide brain 패스를 중앙 배치 -->
  <g transform="translate(${r - 120 * iconScale}, ${r - 120 * iconScale}) scale(${iconScale})">
    <svg width="240" height="240" viewBox="0 0 24 24" fill="none"
         stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <!-- lucide brain paths -->
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
      <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
      <path d="M6 18a4 4 0 0 1-1.967-.516"/>
      <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
    </svg>
  </g>
</svg>`;
}

for (const size of [192, 512]) {
  await sharp(Buffer.from(makeSvg(size)))
    .png()
    .toFile(join(outDir, `icon-${size}.png`));
  console.log(`✅ icon-${size}.png 생성 완료`);
}
