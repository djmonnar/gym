import sharp from "sharp";

await sharp("public/og/returnpass-og-master.png")
  .resize(1200, 630, { fit: "cover", position: "center" })
  .png()
  .toFile("public/og/kakao-thumbnail.png");

await sharp("public/brand/returnpass-icon-master.png")
  .resize(512, 512, { fit: "cover", position: "center" })
  .png()
  .toFile("public/brand/returnpass-icon-512.png");

await sharp("public/brand/returnpass-icon-master.png")
  .resize(192, 192, { fit: "cover", position: "center" })
  .png()
  .toFile("public/brand/returnpass-icon-192.png");
