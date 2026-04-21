import sharp from "sharp";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/icons");
await mkdir(outDir, { recursive: true });

// 원형 배경 — any 아이콘 (투명 배경 + 원)
function makeSvg(size) {
  const r = size / 2;
  const iconScale = size / 512;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${r}" cy="${r}" r="${r}" fill="#7c3aed"/>
  <g transform="translate(${r - 120 * iconScale}, ${r - 120 * iconScale}) scale(${iconScale})">
    <svg width="240" height="240" viewBox="0 0 24 24" fill="none"
         stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
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

// 정사각형 배경 — maskable 아이콘 (safe zone 80% 안에 아이콘)
function makeMaskableSvg(size) {
  const iconScale = (size * 0.5) / 512;
  const offset = size * 0.25;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#7c3aed"/>
  <g transform="translate(${offset}, ${offset}) scale(${iconScale})">
    <svg width="512" height="512" viewBox="0 0 24 24" fill="none"
         stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
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

// any 아이콘 (원형)
for (const size of [192, 512]) {
  await sharp(Buffer.from(makeSvg(size))).png().toFile(join(outDir, `icon-${size}.png`));
  console.log(`✅ icon-${size}.png 생성 완료`);
}

// maskable 아이콘 (정사각형, safe zone 준수)
for (const size of [192, 512]) {
  await sharp(Buffer.from(makeMaskableSvg(size))).png().toFile(join(outDir, `icon-${size}-maskable.png`));
  console.log(`✅ icon-${size}-maskable.png 생성 완료`);
}

// iOS apple-touch-icon (180×180, 정사각형)
await sharp(Buffer.from(makeMaskableSvg(180))).png().toFile(join(outDir, `apple-touch-icon.png`));
console.log(`✅ apple-touch-icon.png (180×180) 생성 완료`);
