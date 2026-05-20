import sharp from "sharp";

await sharp("public/og/kakao-thumbnail.svg")
  .resize(1200, 630)
  .png()
  .toFile("public/og/kakao-thumbnail.png");

await sharp("public/brand/gympass-icon.svg")
  .resize(512, 512)
  .png()
  .toFile("public/brand/gympass-icon-512.png");

await sharp("public/brand/gympass-icon.svg")
  .resize(192, 192)
  .png()
  .toFile("public/brand/gympass-icon-192.png");
