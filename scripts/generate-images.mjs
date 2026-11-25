// Studiya suratlarini yaratadi va ekran o‘lchamlariga moslab WebP qiladi.
// Ishga tushirish: npm run images
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { studioScenes } from './scenes.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = `${root}public/studios`;
const WIDTHS = [480, 800, 1200];

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const manifest = {};
let total = 0;
for (const [slug, scenes] of Object.entries(studioScenes)) {
  manifest[slug] = [];
  for (let i = 0; i < scenes.length; i++) {
    const svg = Buffer.from(scenes[i]());
    const base = sharp(svg, { density: 96 });
    const png = await base.png().toBuffer();
    for (const w of WIDTHS) {
      const buf = await sharp(png).resize({ width: w }).webp({ quality: 74, effort: 6 }).toBuffer();
      total += buf.length;
      await writeFile(`${outDir}/${slug}-${i + 1}-${w}.webp`, buf);
    }
    const { dominant } = await sharp(png).stats();
    const lqip = await sharp(png).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    const hex = '#' + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, '0')).join('');
    manifest[slug].push({
      file: `${slug}-${i + 1}`,
      color: hex,
      lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
    });
  }
}

const ts = `// Avtomatik yaratilgan fayl: scripts/generate-images.mjs. Qo‘lda tahrirlamang.
export const IMAGE_WIDTHS = ${JSON.stringify(WIDTHS)} as const;
export const IMAGE_RATIO = { width: 4, height: 3 } as const;
export interface GeneratedImage { file: string; color: string; lqip: string }
export const generatedImages: Record<string, GeneratedImage[]> = ${JSON.stringify(manifest, null, 2)};
`;
await mkdir(`${root}src/data`, { recursive: true });
await writeFile(`${root}src/data/images.generated.ts`, ts);
console.log(`Tayyor: ${Object.keys(manifest).length} studiya, jami ${(total / 1024).toFixed(0)} KB`);
