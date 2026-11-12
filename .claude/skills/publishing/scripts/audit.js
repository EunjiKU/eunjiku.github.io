#!/usr/bin/env node
/*
 * 산출물 기계 점검 — 의존성 없음 (Node 18+). 산출물 루트에서 실행한다.
 *   node .claude/skills/publishing/scripts/audit.js [산출물 루트=.] [공통 에셋 폴더=common]
 *
 * ① 안 쓰는 클래스 — common.css 선택자 중 html · js 어디에도 없는 것 / 가이드(worklist)에만 있는 것
 *    scss/common/_utilities.scss 의 공통 클래스는 안 써도 유지하는 킷 기본 세트라 「공통 유틸」로 따로 보여 준다 (정리 대상 아님)
 * ② 안 쓰는 이미지 — images/ 파일 중 html · scss · js 어디에도 이름이 없는 것 (믹스인 인자 "icon-x-24" 처럼 확장자 없이 불러도 쓴 것으로 본다)
 * ③ 무거운 이미지 — 가로 2880 초과 · 1MB 초과 jpg/png (assets.md 「배율」)
 * ④ 페이지 — 중복 id · 없는 id 를 가리키는 aria-controls/labelledby/describedby · for, <h1> 개수, 숨김 제목(<h_ class="blind">), alt 없는 <img>, heading 건너뜀, description 없음
 *
 * 결과는 후보다 — 개발이 JS 로 붙이는 클래스 · 다른 화면이 쓸 공통 부품, 팝업을 따로 뺀 화면(-P01 — <h1> 없음 · 부모 페이지의 aria-controls 가 그 파일의 id) · 대표 타이틀이 안 보이는 메인(<h1> 0개)은 사람이 거른다.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const root = path.resolve(process.argv[2] || ".");
const assetDir = path.join(root, process.argv[3] || "common");
const htmlDir = path.join(root, "html");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (!/^(node_modules|lib)$/.test(name)) walk(p, out);
    } else out.push(p);
  }
  return out;
}
const read = (files) => files.map((f) => fs.readFileSync(f, "utf8")).join("\n");
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
const hasWord = (txt, w) => new RegExp("(^|[^\\w-])" + escapeRe(w) + "([^\\w-]|$)").test(txt);
const rel = (p) => path.relative(root, p).replace(/\\/g, "/");

const htmlFiles = walk(htmlDir).filter((f) => f.endsWith(".html"));
const jsFiles = walk(path.join(assetDir, "js")).filter((f) => f.endsWith(".js"));
const scssFiles = walk(path.join(assetDir, "scss")).filter((f) => f.endsWith(".scss"));
const isGuide = (f) => /[\\/]worklist[\\/]/.test(f);
const guideFiles = walk(htmlDir).filter((f) => isGuide(f) && /\.(html|js)$/.test(f));
const prodTxt = read(htmlFiles.filter((f) => !isGuide(f)).concat(jsFiles));
const guideTxt = read(guideFiles);

/* ① 안 쓰는 클래스 */
const cssFile = path.join(assetDir, "css", "common.css");
if (fs.existsSync(cssFile)) {
  const css = fs.readFileSync(cssFile, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const classes = new Set();
  for (const m of css.matchAll(/([^{}]+)\{/g)) {
    if (m[1].trim().startsWith("@")) continue;
    for (const c of m[1].matchAll(/\.([a-zA-Z_][\w-]*)/g)) classes.add(c[1]);
  }
  /* 공통 유틸(scss/common/_utilities.scss)에 선언된 클래스 — 안 써도 유지 */
  const utilFile = path.join(assetDir, "scss", "common", "_utilities.scss");
  const utilTxt = fs.existsSync(utilFile) ? fs.readFileSync(utilFile, "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "") : "";
  const isUtil = (c) => new RegExp("\\." + escapeRe(c) + "(?![\\w-])").test(utilTxt);
  const unused = [], guideOnly = [], utilKeep = [];
  for (const c of [...classes].sort()) {
    if (hasWord(prodTxt, c)) continue;
    if (isUtil(c)) { utilKeep.push(c); continue; }
    (hasWord(guideTxt, c) ? guideOnly : unused).push(c);
  }
  console.log("① 안 쓰는 클래스 (" + unused.length + ")\n  " + (unused.join(" ") || "없음"));
  console.log("   공통 유틸 — 안 써도 유지 (" + utilKeep.length + ")\n  " + (utilKeep.join(" ") || "없음"));
  console.log("   가이드에만 있는 클래스 (" + guideOnly.length + ") — 공통 부품 변형이면 정상\n  " + (guideOnly.join(" ") || "없음"));
} else {
  console.log("① 건너뜀 — " + rel(cssFile) + " 없음 (npm run scss 먼저)");
}

/* ② · ③ 이미지 */
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xc3) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}
const imgDir = path.join(assetDir, "images");
const refTxt = prodTxt + "\n" + guideTxt + "\n" + read(scssFiles);
const unusedImg = [], heavyImg = [];
for (const f of walk(imgDir)) {
  const base = path.basename(f);
  const stem = base.replace(/\.[^.]+$/, "");
  if (!refTxt.includes(base) && !refTxt.includes("\"" + stem + "\"") && !refTxt.includes("'" + stem + "'")) unusedImg.push(base);
  if (/\.(jpe?g|png)$/i.test(base)) {
    const kb = Math.round(fs.statSync(f).size / 1024);
    const s = imageSize(f);
    if ((s && s.w > 2880) || kb > 1024) heavyImg.push(base + "  " + (s ? s.w + "×" + s.h : "?") + "  " + kb + "KB");
  }
}
console.log("\n② 안 쓰는 이미지 (" + unusedImg.length + ")\n  " + (unusedImg.join("\n  ") || "없음"));
console.log("\n③ 무거운 이미지 — 가로 2880 초과 · 1MB 초과 (" + heavyImg.length + ")\n  " + (heavyImg.join("\n  ") || "없음"));

/* ④ 페이지 */
const fragmentIds = read(htmlFiles.filter((f) => /[\\/](header|footer)\.html$/.test(f)));
const pageIssues = [];
for (const f of htmlFiles) {
  const name = path.basename(f);
  if (isGuide(f) || name.startsWith("_") || /^(header|footer)\.html$/.test(name)) continue;
  const s = fs.readFileSync(f, "utf8").replace(/<!--[\s\S]*?-->/g, "");
  const p = [];
  const ids = [...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))];
  if (dup.length) p.push("중복 id " + dup.join(", "));
  for (const attr of ["aria-controls", "aria-labelledby", "aria-describedby", "for"]) {
    for (const m of s.matchAll(new RegExp("\\s" + attr + "=\"([^\"]+)\"", "g"))) {
      for (const id of m[1].split(/\s+/)) {
        if (!ids.includes(id) && !fragmentIds.includes("id=\"" + id + "\"")) p.push(attr + " → 없는 id " + id);
      }
    }
  }
  const h1 = (s.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) p.push("<h1> " + h1 + "개");
  const hiddenH = (s.match(/<h[1-6][^>]*class="[^"]*blind/g) || []).length;
  if (hiddenH) p.push("숨김 제목 " + hiddenH);
  const noAlt = (s.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (noAlt) p.push("alt 없는 <img> " + noAlt);
  const hs = [...s.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  for (let i = 1; i < hs.length; i++) {
    if (hs[i] > hs[i - 1] + 1) { p.push("heading 건너뜀 h" + hs[i - 1] + " → h" + hs[i]); break; }
  }
  if (!/<meta\s+name="description"/.test(s)) p.push("description 없음");
  if (p.length) pageIssues.push(name + " — " + p.join(" | "));
}
console.log("\n④ 페이지 (" + pageIssues.length + ")\n  " + (pageIssues.join("\n  ") || "없음"));
