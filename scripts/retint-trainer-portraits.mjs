/**
 * 트레이너 일러스트의 그린 계열 색만 코럴/웜 톤으로 회전시킵니다.
 * 이미지 생성이 아니라 기존 슬라이스 자산(public/images/trainers)의 색 보정입니다.
 *
 * 방식: 픽셀을 HSL로 변환해 hue가 초록 범위(60°~180°)인 픽셀만
 * 웜 오렌지 방향(약 20°)으로 매핑합니다. 피부(주황 계열)·머리카락(저채도)은
 * 초록 범위 밖이라 영향받지 않습니다. 경계 왜곡을 줄이려고 범위 가장자리는
 * 가중치를 줄여 부드럽게 섞습니다.
 *
 * 사용: node scripts/retint-trainer-portraits.mjs
 */
import { readdir } from "node:fs/promises";
import sharp from "sharp";

const DIR = "public/images/trainers";

// 초록으로 판정할 hue 범위(도)와 목표 hue
const GREEN_MIN = 55;
const GREEN_MAX = 185;
const TARGET_HUE = 18; // 웜 코럴/테라코타

const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
};

const hslToRgb = (h, s, l) => {
  h /= 360;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const conv = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [Math.round(conv(h + 1 / 3) * 255), Math.round(conv(h) * 255), Math.round(conv(h - 1 / 3) * 255)];
};

const files = (await readdir(DIR)).filter((f) => /^trainer-\d\d\.webp$/.test(f));

for (const file of files) {
  const path = `${DIR}/${file}`;
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
    if (h < GREEN_MIN || h > GREEN_MAX || s < 0.08) continue;

    // 범위 가장자리(±15°)는 절반만 이동시켜 경계를 부드럽게 합니다.
    const edge = Math.min(h - GREEN_MIN, GREEN_MAX - h);
    const weight = Math.min(1, edge / 15);
    const newHue = h + (TARGET_HUE - h) * weight;
    // 라임처럼 쨍한 초록은 채도를 약간 낮춰 코럴 팔레트 톤에 맞춥니다.
    const newSat = s > 0.55 ? s * 0.82 : s;
    const [r, g, b] = hslToRgb(((newHue % 360) + 360) % 360, newSat, l);
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  await sharp(data, { raw: { width, height, channels } }).webp({ quality: 88 }).toFile(path.replace(".webp", ".tmp.webp"));
}

// 검증 후 덮어쓰도록 .tmp로 출력합니다. 확인이 끝나면 rename 단계에서 교체하세요.
console.log(`트레이너 ${files.length}명 리텐트 완료 (.tmp.webp로 출력, 확인 후 교체)`);
