/**
 * 브랜드 아이콘을 코럴 팔레트로 리텐트합니다 (이미지 생성 없이 기존 자산의 색만 매핑).
 *
 * 원본 마스터는 딥그린 배경 + 네온라임 링 + 흰 R 3색 구성입니다.
 * 각 픽셀을 세 앵커색 중 가장 가까운 것으로 분류해 타깃색으로 치환합니다.
 *   딥그린 배경 -> 웜 잉크(#241C1A)
 *   네온라임 링 -> 코럴(#FF5A3C)
 *   흰 R        -> 웜 화이트(유지)
 * 마스터에서 하드 치환 후 512/192로 다운스케일하며 안티에일리어싱이 다시 매끈해집니다.
 *
 * 사용: node scripts/retint-brand-icon.mjs
 */
import sharp from "sharp";

const SRC = "public/brand/returnpass-icon-master.png";

// [앵커색(원본), 타깃색] — RGB
const MAP = [
  { from: [14, 43, 30], to: [36, 28, 26] },     // 딥그린 배경 -> 웜 잉크
  { from: [196, 236, 61], to: [255, 90, 60] },  // 네온라임 링 -> 코럴
  { from: [244, 243, 238], to: [253, 251, 250] } // 흰 R -> 웜 화이트
];

const dist2 = (a, b) =>
  (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
for (let i = 0; i < data.length; i += channels) {
  const px = [data[i], data[i + 1], data[i + 2]];
  let best = MAP[0];
  let bestD = Infinity;
  for (const m of MAP) {
    const d = dist2(px, m.from);
    if (d < bestD) {
      bestD = d;
      best = m;
    }
  }
  data[i] = best.to[0];
  data[i + 1] = best.to[1];
  data[i + 2] = best.to[2];
  // 알파는 그대로 둡니다.
}

const recolored = sharp(data, { raw: { width, height, channels } }).png();
const buffer = await recolored.toBuffer();

const targets = ["public/brand", "brand"];
for (const dir of targets) {
  await sharp(buffer).toFile(`${dir}/returnpass-icon-master.png`);
  await sharp(buffer).resize(512, 512, { fit: "cover", position: "center" }).png().toFile(`${dir}/returnpass-icon-512.png`);
  await sharp(buffer).resize(192, 192, { fit: "cover", position: "center" }).png().toFile(`${dir}/returnpass-icon-192.png`);
}

console.log("브랜드 아이콘 코럴 리텐트 완료:", targets.join(", "));
