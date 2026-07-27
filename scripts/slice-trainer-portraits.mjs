/**
 * 트레이너 포트레이트 스프라이트(4열×2행, 1774×887)를 8개 개별 이미지로 분리합니다.
 * 이미지 생성이 아니라 기존 자산의 슬라이스입니다.
 *
 * 예전에는 background-size: 400% 200%로 각 칸을 컨테이너에 늘려-채워서(stretch)
 * 정사각이 아닌 컨테이너에서 인물이 왜곡됐습니다. 개별 이미지 + object-cover로 바꿉니다.
 *
 * 출력: public/images/trainers/trainer-<row><col>.webp
 * 사용: node scripts/slice-trainer-portraits.mjs
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SRC = "public/images/returnpass-trainer-portraits-v1.png";
const OUT_DIR = "public/images/trainers";
const COLS = 4;
const ROWS = 2;

const { width, height } = await sharp(SRC).metadata();
await mkdir(OUT_DIR, { recursive: true });

for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    // 비정수 그리드도 정확히 나누도록 셀 경계를 반올림해 계산합니다.
    const left = Math.round((col * width) / COLS);
    const right = Math.round(((col + 1) * width) / COLS);
    const top = Math.round((row * height) / ROWS);
    const bottom = Math.round(((row + 1) * height) / ROWS);
    await sharp(SRC)
      .extract({ left, top, width: right - left, height: bottom - top })
      .webp({ quality: 88 })
      .toFile(`${OUT_DIR}/trainer-${row}${col}.webp`);
  }
}

console.log(`트레이너 포트레이트 ${COLS * ROWS}개 분리 완료 → ${OUT_DIR}`);
