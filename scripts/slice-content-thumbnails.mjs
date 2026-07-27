/**
 * 콘텐츠 썸네일 스프라이트(4열×3행, 1448×1086, 정사각 362px 칸)를
 * 12개의 개별 정사각 이미지로 분리합니다. 이미지 생성이 아니라 기존 자산의 슬라이스입니다.
 *
 * 스프라이트 + background-position 방식은 컨테이너 종횡비가 칸(정사각)과 다르면
 * 세로가 잘리고, 퍼센트 포지셔닝이라 칸마다 잘리는 위치도 제각각이었습니다.
 * 개별 이미지 + object-cover로 바꾸면 어떤 컨테이너에서도 일관되게 가운데를 담습니다.
 *
 * 출력: public/images/content/content-cell-<row><col>.webp
 * 사용: node scripts/slice-content-thumbnails.mjs
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SRC = "public/images/returnpass-content-thumbnails-v1.webp";
const OUT_DIR = "public/images/content";
const COLS = 4;
const ROWS = 3;

const { width, height } = await sharp(SRC).metadata();
const cellW = Math.round(width / COLS);
const cellH = Math.round(height / ROWS);

await mkdir(OUT_DIR, { recursive: true });

for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const out = `${OUT_DIR}/content-cell-${row}${col}.webp`;
    await sharp(SRC)
      .extract({ left: col * cellW, top: row * cellH, width: cellW, height: cellH })
      .webp({ quality: 82 })
      .toFile(out);
  }
}

console.log(`콘텐츠 썸네일 ${COLS * ROWS}개 분리 완료 (${cellW}×${cellH}) → ${OUT_DIR}`);
