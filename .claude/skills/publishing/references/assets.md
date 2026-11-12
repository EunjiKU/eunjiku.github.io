# 에셋 배치 · 네이밍 · 포맷 — publishing 스킬 §1 의 본문

> **언제 여는가** — 이미지·아이콘을 새로 넣거나 이름을 지을 때, 포맷(PNG/JPG/SVG)·배율을 정할 때 연다. 실제 경로·파일명·값은 `CLAUDE.md` 「프로젝트 설정」과 `PROJECT.md` 가 우선한다.

### 에셋 배치 규칙

- **이미지**: 모든 이미지/아이콘은 `images/` 에 저장한다. 페이지별 폴더에 넣지 않는다. 모바일 전용 이미지는 `images/MO/` 에 둔다 — 같은 그림의 PC · MO 짝이 몇 장뿐이면 폴더 없이 PC 파일 옆에 `-mo` 를 붙여 둔다(`img-popup-1.jpg` · `img-popup-1-mo.jpg`). 한 프로젝트에서 두 방식을 섞지 않는다. 파일명은 아래 「에셋 네이밍」을 따른다.
- **CSS**: 스타일은 `scss/` 부분 파일에 쓴다 (`css/` 는 컴파일 산출물이라 직접 고치지 않는다). HTML 내 `<style>` 태그를 사용하지 않는다.
- **JS**: 라이브러리는 `js/lib/`, 프로젝트 스크립트는 `js/` 루트에 둔다. (기존 자산이 평면 배치라면 그쪽에 맞춘다 — 「프로젝트 설정」 확인)

> **예외 — 워크리스트**: 작업 보드는 의도적으로 자체 CSS/JS 를 갖는 독립 페이지다. 컨벤션 적용 대상이 아니다.

### 에셋 네이밍 — 평면 폴더라 접두어로 구분한다

`images/` 는 모든 페이지가 공유하는 한 폴더다. 충돌과 중복을 막기 위해 **용도 접두어 + 의미 + (크기)** 로 짓는다. 전부 소문자·하이픈.

| 용도 | 규칙 | 예 |
| --- | --- | --- |
| 공통 아이콘 | `icon-의미-크기.svg` — 크기는 피그마 노드 폭 | `icon-search-24.svg`, `icon-arrow-down-20.svg` |
| 페이지 전용 아이콘 | `icon-페이지프리픽스-의미-크기.svg` | `icon-news-filter-16.svg` |
| 로고 | `logo-대상(-변형).svg` | `logo-brand.svg`, `logo-brand-footer.svg` |
| 콘텐츠 이미지(사진·썸네일·일러스트) | `img-의미.(jpg|png)` — 페이지 전용은 `img-페이지프리픽스-의미` (CSS 프리픽스 — `css-architecture.md` 「페이지 전용 CSS」와 같게). 확장자는 아래 「포맷」 기준 | `img-news-kv.jpg`(사진), `img-hist-2024-01.png`(일러스트) |
| 배경 이미지 | `bg-의미.(jpg|png)` — 페이지 전용은 `bg-페이지프리픽스-의미`. 확장자는 아래 「포맷」 기준 | `bg-page-gradient.png`, `bg-news-visual.jpg` |
| 공유 이미지(OG) | `og-default.jpg` (1200×630) | — |
| 파비콘 | `favicon.ico`(16 · 32 · 48) · `favicon-크기.png`(180 · 192 · 512) — `markup.md` 「파비콘」 | `favicon-180.png` |
| 더미(임시) 에셋 | 위 규칙대로 짓고 맨 앞에 `@` — 실제 에셋이 오면 `@` 를 뗀 이름으로 교체 | `@icon-filter-16.svg`, `@img-news-kv.jpg`, `@bg-page-gradient.png` |
| 작업용 참고(시안 캡처) | `@sample-의미.png` — 저장소에는 남기지 않고 완료 시 삭제 | `@sample-job-detail.png` |

- **접두어는 세 가지뿐이다** — `icon-`(SVG 아이콘) · `img-`(콘텐츠 이미지) · `bg-`(CSS background 로 까는 이미지). `<img>` 로 넣으면 `img-`, `background` 로 깔면 `bg-` 다 (판단 기준은 `figma-to-html` §3 「배경 이미지 vs `<img>`」). 로고(`logo-`) · OG(`og-`) · 파비콘(`favicon`)만 예외다. `ic-` 같은 줄임 접두어를 새로 만들지 않는다.
- **`@` 는 "최종 아님" 표시다.** 더미 이미지는 실제 에셋이 쓸 이름 그대로 짓고 `@` 만 붙인다 (`@img-news-kv.jpg`). `alt` 는 비워 둔다(`alt=""`) — 예시 사진이라 내용을 지어 적지 않는다. CSS·HTML 도 `@` 붙은 경로를 그대로 참조한다 — 실제 에셋이 오면 파일명의 `@` 를 떼고 참조를 바꾸면 끝이다. 완료 보고에 남은 `@` 파일을 적는다 (`ls images/ | grep '^@'`).
- **배율** — 아이콘은 SVG 라 배율이 없다. `img-`·`bg-` 는 **2배율(@2x)로 추출**하고 CSS 에서 피그마 1배 크기로 지정한다 (틀 rem 크기 · `background-size`. `<img>` width/height 속성은 `markup.md`). 3배율은 쓰지 않는다 — 사진·배경에서는 2배와 3배의 체감 차이가 거의 없고 용량은 2.25배다. 예외는 이미지 안의 작은 글자·가는 선이 모바일에서 뭉개질 때 그 파일만 3배율이며, 그 전에 SVG 로 뺄 수 없는지 먼저 본다. 풀블리드 배경(1920 폭)은 2배율이 3840 이 되므로 가로 2560 으로 리사이즈해 넣는다 — 피그마에서 받은 3840 사진은 장당 5~9MB 라 그대로 두면 안 된다. 줄이기는 `scripts/resize-images.ps1`(JPG · 설치 없음), 빠뜨린 사진은 `scripts/audit.js` ③ 이 찾는다. 파일명에 `@2x` 를 붙이지 않는다 — 1배 파일을 따로 두지 않으므로 구분할 게 없다.
- **포맷** — 아이콘·로고는 SVG 가 1순위다. SVG 로 안 되는 것과 `img-`·`bg-` 는 아래 기준으로 PNG/JPG 를 고른다. **WebP 는 쓰지 않는다** (용량 이득보다 개발·운영 파이프라인 정리 비용이 커서 기본값에서 뺐다. 쓰는 프로젝트는 「프로젝트 설정」에 적는다).

  | 이미지 | 포맷 | 이유 |
  | --- | --- | --- |
  | 배경이 투명해야 하는 이미지 (SVG 가 안 되는 아이콘·로고, 누끼) | `.png` | JPG 는 투명을 지원하지 않아 흰색·검은색으로 채워진다 |
  | 색상이 화려한 실제 사진 · 인물 · 풍경 | `.jpg` | PNG 로 저장하면 용량이 너무 커져 로딩이 느려진다 |
  | 글자가 포함된 이미지 · 일러스트 · 라인 아트 | `.png` | JPG 는 압축 시 글자·선 주변이 깨진다 (열화) |
  | 단색 위주 로고 · 간단한 그래픽 (SVG 가 안 될 때) | `.png` | 용량도 작고 경계선이 깨끗하다 |

  기준이 겹치면 투명이 필요한지부터 본다 — 투명이 필요하면 사진이라도 PNG 다. JPG 는 피그마 export 품질 80 으로 뽑는다. 다운로드한 파일은 실제 포맷을 확인한다 (`file -b`) — URL 확장자와 실제 포맷이 다를 수 있다. 큰 사진은 `loading="lazy"` 로 대응한다.
- **같은 모양 다른 크기는 별개 파일**이다 (`icon-arrow-tail-left-20.svg` 와 `-40.svg`). `viewBox` 와 path 까지 같을 때만 중복으로 보고 하나로 합친다.
- 새 에셋을 넣기 전에 같은 의미의 파일이 있는지 `ls images/ | grep 의미` 로 확인한다.
- **SVG 안에 `<svg>` 가 중첩돼 있으면 편다** (`grep -c '<svg' 파일` 이 2 이상 — 피그마가 여러 조각을 묶어 내보낸 로고에 흔하다). VS Code Live Server 는 SVG 파일에도 새로고침 스크립트를 `</svg>` 마다 끼워 넣어 중첩 파일은 XML 이 깨지고 이미지가 안 보인다 (`npm run serve` · 실서버에서는 정상). 안쪽 `<svg x y width height viewBox="0 0 W H">` 를 `<g transform="translate(x y) scale(width/W height/H)">` 로, 그 `</svg>` 를 `</g>` 로 바꿔 루트 `<svg>` 하나만 남긴다.

### 아이콘 — SVG 파일 + mask

**아이콘은 인라인 `<svg>` 로 넣지 않는다.** 피그마에서 SVG 로 추출해 `images/` 에 파일로 두고 CSS 로 그린다. 요소 크기 = 피그마 노드 크기. 두 방법 중 고른다.

| 방법 | 언제 | 쓰는 법 |
| --- | --- | --- |
| **mask** (기본) | 색이 상태(hover · 포커스 · 비활성 · 투명 헤더)에 따라 바뀌는 단색 아이콘 — 대부분 | 색은 `background-color`(토큰), 모양은 `mask`. 상태마다 아이콘 파일을 따로 두지 않는다 |
| background | 여러 색이 섞인 아이콘 · 색이 절대 바뀌지 않는 아이콘 | `background: url() no-repeat center / contain` |

```css
/* mask — 아이콘이 있는 요소 자신이 아니라 ::before 에 건다 */
.search-btn { position: relative; width: 24rem; height: 24rem; color: var(--color-{아이콘 기본}); }
.search-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: currentColor;   /* 색은 부모 color 를 따른다 — 상태는 부모의 color 만 바꾼다 */
  -webkit-mask: url("../images/icon-search-24.svg") no-repeat center / contain;
  mask: url("../images/icon-search-24.svg") no-repeat center / contain;
}
@media (hover: hover) {
  .search-btn:hover,
  .search-btn:focus-visible { color: var(--color-{아이콘 강조}); }
}
```

- **포커스를 받는 요소(`<a>` · `<button>`) 자체에 `mask` 를 걸지 않는다.** mask 는 outline 까지 아이콘 모양으로 잘라 키보드 포커스 표시가 사라진다. 항상 `::before`/`::after` 에 건다 (`accessibility.md` 「포커스 링 · Hover」).
- `-webkit-mask` 를 같이 쓴다 (Safari).
- 아이콘 크기가 박스보다 작으면 mask 크기를 따로 준다 (`center / 24rem`).
- **버튼 · 링크가 아닌 단독 아이콘은 `{이름}-icon` 공통 클래스**로 `components/_icon.scss` 에 둔다 (`.mail-icon`) — 페이지 전용으로 만들지 않는다 (`naming-components.md` 「자식 이름」).

### 폼 표시 — 상태별 통 SVG 를 input 배경으로

체크박스 · 라디오(· 토글)는 **박스와 표시(체크 · 점)를 합친 피그마 SVG 를 상태별로 추출**해 `icon-{checkbox|radio}-{selected|unselected|disabled|readonly}-{크기}.svg` 로 두고, 선택 안 된 그림(unselected · disabled)은 `appearance: none` 한 `input` 의 `background-image`, 선택된 그림(selected · readonly)은 라벨 `::before` 를 같은 자리 · 크기로 겹쳐 두고 `:has(input:checked)` 일 때 `opacity` 0 → 1 로 전환한다 (비활성은 `:has(input:disabled)` 로 두 그림을 함께 바꾼다).

- `background-image` 를 `:checked` 로 갈아 끼우면 전환이 안 되거나 브라우저마다 다르게 보인다 — 입력창 테두리처럼 부드럽게 바뀌게 겹친 층의 opacity 로. 박스 크기 · 위치는 지역 변수(`--choice-size` · `--choice-top`) 한 곳에 두고 input 과 `::before` 가 같이 쓴다.

- CSS 테두리로 박스를 그리거나 도형 · mask 로 표시를 그리지 않는다 — 1px 테두리는 vw 기반 rem 과 함께 커지지 않아 시안과 비율이 어긋나고, 안쪽 mask 는 표시가 줄어든다.
- 색은 SVG 안에 있으므로 색 토큰을 따로 두지 않는다. 색이 바뀌면 재추출한다.
- 피그마에서 사각형 레이어라 SVG 가 안 나오는 상태는 같은 수치 · 같은 형식으로 SVG 를 직접 쓴다.
- 새 폼 컨트롤도 상태별 통 SVG 를 먼저 검토한다.
