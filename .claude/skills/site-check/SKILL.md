---
name: site-check
description: 포트폴리오 사이트 전체 점검 — 코드 정리(안 쓰는 클래스 · 이미지 · 토큰 · 믹스인) · 반응형(PC · 아이패드 mini · 아이패드 프로 12.9 · 갤럭시 폴드 접힘/펼침 · 휴대폰) · 접근성 · SEO(검색엔진 최적화)를 한 번에 확인하고 보고한다. "전체 점검", "검수해줘", "반응형 확인", "SEO 확인", "정리해줘", "배포 전 확인" 요청 시 사용한다. 파일을 고치기 전에 보고부터 하고, 고치라는 지시가 함께 있으면 고친 뒤 다시 잰다.
---

# 사이트 점검 (site-check)

이 저장소(GitHub Pages 포트폴리오)의 **배포 전 점검 순서와 보고 형식**만 정한다. 판정 기준은 `publishing` 스킬(컨벤션) · `a11y-check` 스킬(접근성 실측)에 있고, 이 사이트 값은 루트 `CLAUDE.md` 「프로젝트 설정」이 우선한다.

대상 페이지 — 루트의 `index.html`(메인) · `projects.html`(전체 프로젝트 — 메인 「전체 프로젝트 보기」 팝업 화면) · `index2.html`(백업). 페이지를 더하면 이 목록과 `CLAUDE.md` 를 같이 고친다.

## 1. 코드 정리 — 안 쓰는 것 찾기

```bash
node .claude/skills/publishing/scripts/audit.js
```

- ① 안 쓰는 클래스 — `lenis-smooth` · `lenis-stopped` 는 Lenis 가 실행 중에 `<html>` 에 붙이는 클래스라 정상
- ② 안 쓰는 이미지 · ④ 페이지(중복 id · 없는 id 참조 · h1 · alt · heading 건너뜀)는 0 이 목표
- 토큰 · 믹스인은 스크립트가 보지 않는다 — `_tokens.scss` 의 `--변수` 가 `var(--변수)` 로 어디에도 안 쓰이는지, `_tools.scss` 의 `@mixin` 이 `_tools.scss` **밖에서** `@include` 되는지 grep 한다 (`_tools.scss` 안의 사용 예시 주석은 사용이 아니다)
- JS — `main.js` · `common.js` 의 함수 · 상수가 정의된 곳 말고 또 쓰이는지. 마크업이 없는 모듈은 지운다
- 낡은 주석 — 지운 기능 · 이전 디자인(색 이름 · 라운드 · 다크 모드 · 지운 섹션)을 말하는 주석을 찾아 고친다
- 지운 뒤에는 `npm run scss`(또는 `sass`)로 `common/css/` 를 다시 만든다

## 2. 반응형 — 화면 폭별 실측

로컬 서버(`.claude/launch.json` 「preview」 또는 `npm run serve`)로 연다. `file://` 은 쓰지 않는다. 폭마다 **세 페이지**를 새로 불러(크기를 바꾼 뒤 새로고침) 잰다.

| 기기 | 폭 × 높이 | 확인 |
| --- | --- | --- |
| PC | 1920×1080 · 1440×900 | 프로젝트 3칸 틀(메인) · 카드 3열(전체 프로젝트) |
| 아이패드 프로 12.9 가로 / 세로 | 1366×1024 / 1024×1366 | 1024 는 모바일 구간 시작 — 1칸 · 카드 2열 |
| 아이패드 mini 세로 / 가로 | 768×1024 / 1024×768 | 낮은 화면(768)에서 화면에 붙는 카드가 다 들어오는지 |
| 갤럭시 폴드 펼침 | 884×1104 · 717×512(가로) | 낮은 가로 화면 |
| 휴대폰 | 390×844 | 600↓ — 햄버거 메뉴 · 카드 1열 |
| 갤럭시 폴드 접힘 | 344×882 · 280×653 | 가장 좁은 폭 |

폭마다 아래를 실행한다 — `of` 가 `false`, `off` 가 빈 배열이 목표. 흐르는 띠(`.client-flow` · `.sec-band`) · 큰 영문(`.hero-name`) · 커서 · 모달은 화면 밖이 정상이라 뺀다.

```js
const vw = document.documentElement.clientWidth;
const off = [...document.querySelectorAll("body *")].filter((el) => {
  if (el.closest(".modal, [hidden], .client-flow, .sec-band, .hero-name, .cursor, .cursor-ring, .skip")) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && (r.right > vw + 1 || r.left < -1);
}).slice(0, 8).map((el) => (el.className || el.tagName) + " " + Math.round(el.getBoundingClientRect().left) + "~" + Math.round(el.getBoundingClientRect().right));
JSON.stringify({ w: innerWidth, of: document.documentElement.scrollWidth > vw, off });
```

- 메인 프로젝트 카드 — 두 번째 카드 위치로 스크롤해 카드 위 · 아래가 화면 안(0 ~ 화면 높이)에 있는지 잰다
- 전체 프로젝트 — 카드 열 수(`.project-grid .project-card` 의 서로 다른 left 개수) 3 / 2 / 1, 600↓ 에서 탭이 필터 위
- 메인에서 「전체 프로젝트 보기」를 눌러 팝업 안(iframe — `html[data-embed]`, 헤더 · 푸터 없음)에서도 같은 배치인지
- 끝나면 화면 크기 흉내를 해제한다
- 콘솔의 `ERR_CONNECTION_REFUSED` 는 앞서 끈 미리보기 서버의 흔적일 수 있다 — 페이지를 새로 불러 네트워크 응답(모두 200)으로 확인한 뒤 판단한다
- 미리보기 창이 가려져 있으면 애니메이션 프레임이 멈춘다 — 헤더 내려오기 같은 GSAP 모션이 시작점에 멈춰 위치가 어긋나 보인다. `gsap.ticker.frame` 이 0.5초 동안 늘지 않으면 측정값이 아니라 환경 탓이다 (코드를 고치지 않는다)

## 3. 접근성

`a11y-check` 스킬 절차(자동 점검 스니펫 · 터치 타깃 44px · 대비)를 세 페이지에 돌린다. 터치 타깃은 `::before` · `::after` 로 넓힌 영역(`touch-area` · `touch-area-before` 믹스인)이 44px 이상이면 통과로 본다.

## 4. SEO — 검색엔진 최적화

| 항목 | 메인 `index.html` | `projects.html` · `index2.html` |
| --- | --- | --- |
| `<title>` | `웹 퍼블리셔 포트폴리오: 구은지` | 페이지별 |
| `description` | 80 ~ 160자 — 직무 · 기술 · 대표 프로젝트 | 있음 |
| `robots` | `index, follow` | `noindex, follow` |
| `canonical` | `https://eunjiku.github.io/` | (`index2` 는 메인을 가리킴) |
| OG · 트위터 카드 | `og:title` · `description` · `url` · `image`(1200×630 절대주소) · `image:alt` · `twitter:card` | 없어도 됨 |
| 구조화 데이터 | JSON-LD `WebSite` + `Person` — JSON 이 깨지지 않았는지(`JSON.parse`) | 없음 |
| `sitemap.xml` | 메인만 · `lastmod` 를 배포 날짜로 | 넣지 않음 |
| `robots.txt` | `Sitemap:` 주소 | — |
| 문서 구조 | `<html lang="ko">` · `<h1>` 하나 · heading 건너뜀 없음 · 이미지 `alt` | 같음 |
| 속도 | 첫 화면 밖 사진은 `loading="lazy" decoding="async"` · 폰트 400/700 preload · 사진 1MB 이하 | 같음 |

```js
JSON.stringify({
  title: document.title,
  desc: (document.querySelector("meta[name=description]")?.content || "").length,
  robots: document.querySelector("meta[name=robots]")?.content,
  canonical: document.querySelector("link[rel=canonical]")?.href,
  og: [...document.querySelectorAll("meta[property^='og:']")].map((m) => m.getAttribute("property")),
  ld: [...document.querySelectorAll("script[type='application/ld+json']")].map((s) => { try { return JSON.parse(s.textContent)["@graph"]?.map((g) => g["@type"]); } catch (e) { return "JSON 오류"; } }),
  h1: document.querySelectorAll("h1").length,
  lazy: document.querySelectorAll("img[loading=lazy]").length,
});
```

## 5. 보고

항목마다 표 한 줄 — **통과 / 고침 / 남김(이유)**. 고친 것은 파일과 무엇을, 남긴 것은 왜(사용자 결정 · 더미 대기 등)를 적는다. 마지막에 확인하지 못한 것(실기기 · 실제 검색 노출 · 배포 화면)을 한 줄로 고지한다. 결정이 바뀌면 `PROJECT.md` 「결정 기록」 · `TODO.md` · `README.md` 를 같이 고친다.
