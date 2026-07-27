/**
 * 색상 유틸리티 클래스가 실제로 컴파일됐는지 검사합니다.
 *
 * Tailwind는 존재하지 않는 클래스를 조용히 무시합니다. 그러면
 * `ring-1 ring-lime/16` 같은 코드가 기본 ring 색(파랑)으로 폴백되고,
 * 오타(`text-limeSoftSoft`)는 색이 아예 적용되지 않은 채 지나갑니다.
 * 화면을 직접 보기 전에는 발견하기 어려워 빌드 단계에서 걸러냅니다.
 *
 * 사용: node scripts/check-color-classes.mjs
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const SRC = "src";
const CSS_DIR = "docs/assets";

// tailwind.config.ts에 정의한 커스텀 색 + 투명도를 붙여 쓰는 기본 색
const TRACKED = ["brand", "lime", "limeSoft", "blue", "sand", "warm", "surface", "card", "white", "black"];
const PREFIXES = ["bg", "text", "ring", "border", "fill", "stroke", "divide", "from", "via", "to", "outline", "decoration"];

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
};

const classPattern = new RegExp(`\\b(${PREFIXES.join("|")})-(${TRACKED.join("|")})(\\/[0-9.]+)?\\b`, "g");

const cssFiles = (await readdir(CSS_DIR)).filter((f) => f.endsWith(".css"));
if (!cssFiles.length) {
  console.error(`빌드된 CSS를 찾을 수 없습니다 (${CSS_DIR}). 먼저 vite build를 실행하세요.`);
  process.exit(1);
}
const css = (await Promise.all(cssFiles.map((f) => readFile(path.join(CSS_DIR, f), "utf8")))).join("\n");

const missing = new Map();

for (const file of await walk(SRC)) {
  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(classPattern)) {
    const cls = match[0];
    // CSS에서는 `/`와 `.`이 백슬래시로 이스케이프됩니다.
    // 앞에 `.`을 붙여 찾으면 안 됩니다. `hover:ring-black/10`은
    // `.hover\:ring-black\/10:hover`로 컴파일되어 클래스명이 문장 중간에 옵니다.
    const escaped = cls.replace(/\//g, "\\/").replace(/\./g, "\\.");
    if (css.includes(escaped)) continue;
    if (!missing.has(cls)) missing.set(cls, new Set());
    missing.get(cls).add(file);
  }
}

if (!missing.size) {
  console.log("색상 클래스 검사 통과: 모든 클래스가 CSS에 존재합니다.");
  process.exit(0);
}

console.error("컴파일되지 않은 색상 클래스가 있습니다. 오타이거나 Tailwind 기본 스케일에 없는 투명도 값입니다.\n");
for (const [cls, files] of missing) {
  console.error(`  ✗ ${cls}`);
  for (const f of files) console.error(`      ${f}`);
}
console.error("\n투명도는 5 단위(5,10,15,...,95)만 생성됩니다. 그 외 값은 임의값 표기를 쓰세요: bg-white/[0.06]");
process.exit(1);
