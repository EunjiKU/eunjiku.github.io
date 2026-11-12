# CSS 파일 구조 · 로드 순서 · 경로 — publishing 스킬 §1 의 본문

> **언제 여는가** — 어느 CSS 파일에 넣을지 헷갈릴 때, 새 섹션을 만들 때, 페이지 전용 블록을 쓸 때, 경로를 정할 때 연다. 실제 경로·파일명·값은 `CLAUDE.md` 「프로젝트 설정」과 `PROJECT.md` 가 우선한다.

### SCSS 소스 · CSS 출력

스타일은 **`common/scss/` 가 소스**이고 **`common/css/common.css` + `common.css.map` 한 벌이 컴파일 산출물**이다. HTML 은 `common.css` 하나를 로드하고, 개발팀도 그 파일을 받는다 — 그래서 출력 섹션 순서 · 주석 규칙은 아래 CSS 규칙 그대로다. 이 문서와 다른 스킬이 `common.css` 의 어느 섹션을 말하면 **고치는 파일은 그 섹션의 부분 파일**(`scss/common/_header.scss` 등)이다.

```
common/
├── scss/               ← 소스 (여기만 고친다)
│   ├── common.scss     ← 유일한 엔트리 — @use 목록만 (출력 common.css 하나)
│   ├── _tools.scss     ← 믹스인 (출력 없음 — 쓰는 부분 파일 맨 위에 @use "../tools" as *;)
│   ├── common/         ← 골격 부분 파일 — _reset(맨 앞) · _tokens · _fonts(+ .font-*) · _base(+ .wrapper · .inner) · _utilities · _header · _footer · _page
│   └── components/     ← 부품 부분 파일 — _form(+ 첨부 상자 · 파일 목록 · 첨부한 파일) · _button · _label · _card · _box(정보 상자) · _visual(사진 블록) · _list · _post · _board(+ 페이지네이션) · _tab · _table · _icon(단독 아이콘 {이름}-icon) · _accordion · _modal (종류가 늘면 파일 추가) · _main(메인) · _style(페이지 전용 — 맨 아래 한 파일)
└── css/                ← 출력 (직접 고치지 않는다 — 다음 컴파일에 덮인다)
    ├── common.css
    └── common.css.map  ← 소스맵. 브라우저 개발자 도구가 scss 줄 번호를 보여 준다
```

- 컴파일은 dart-sass. **VS Code 에서는 Live Sass Compiler 「Watch Sass」**(출력 설정은 `.vscode/settings.json` — `common/css/` · expanded · map · autoprefix 끔), 확장이 없거나 Watch 가 꺼진 채 SCSS 를 고쳤으면 `npm install` 한 번 뒤 `npm run scss:watch` · 넘기기 전 `npm run scss`(킷 폴더 루트의 `package.json`). 부분 파일의 믹스인 로드는 `@use "../tools"` 상대경로라 어느 쪽으로 돌려도 같다. `scss/` 에 `_` 없는 파일은 `common.scss` 하나만 둔다 — 밑줄 없는 파일은 각자 CSS 로 출력된다. 옵션은 `--style=expanded --source-map` — 출력이 사람이 읽는 CSS 여야 개발이 그대로 가져간다 (압축은 개발 빌드 몫).
- **`css/` 와 `.map` 을 함께 커밋한다.** 개발이 sass 를 돌리지 않고도 쓸 수 있어야 한다. 컴파일을 빼먹으면 HTML 이 옛 CSS 를 보므로, 완료 보고 전 `npm run scss` 가 돌았는지 확인한다 (`checklist.md`).
- **엔트리 1개 + 부분 파일** — `common.scss` 는 `@use` 목록과 목차 주석만 있는 엔트리고, 내용은 `common/_header.scss` · `components/_form.scss` · `components/_main.scss` 처럼 **부품(컴포넌트) 하나에 부분 파일 하나**다. `@use` 순서가 곧 출력 순서(목차)다 — `common/`(`_reset` 맨 앞) → `components/`(부품 → `_main` → 맨 아래 `_style`). 새 종류의 부품은 부분 파일을 만들고 컴포넌트 `@use` 끝(`_main` 앞)과 목차에 한 줄 더한다. **새 페이지는 파일을 만들지 않는다** — 페이지 전용 디자인은 `components/_style.scss` 에 구획 하나 (SCSS 파일 수가 늘지 않게. `pages/` 폴더는 두지 않는다). 같은 부분 파일을 두 번 `@use` 하지 않는다.
- **반응형(1024 → 600)은 부분 파일마다 그 파일 끝에** 둔다 — 한 부품의 PC · MO 가 한 파일에서 보인다. 파일 끝에 한 번만 모으는 「반응형 섹션」은 없다 (토큰 재선언은 `_tokens` 끝, rem 재설정은 `_base` 끝).
- `@import` 는 쓰지 않는다 (sass 에서 폐기). 변수 · 믹스인이 필요하면 `_tools.scss` 하나에 모으고 `@use "../tools" as *;` 로 받는다 — 디자인 토큰은 여전히 CSS 변수(`:root`)다 (SCSS 변수로 바꾸지 않는다 — 런타임 재선언 · 개발 재사용 때문).
- 작성 규칙(마크업 경로대로 중첩 · `&-` 금지 · 주석 종류)은 `css-rules.md` 「SCSS 작성 규칙」.

### 소스 폴더 역할 분리

> 경로는 `CLAUDE.md` 「프로젝트 설정」이 우선한다. 역할 구분 자체는 어느 프로젝트나 동일하다. **출력 CSS 는 `common.css` 한 파일**이고 역할은 소스 폴더로 나눈다 — 출력 순서는 엔트리 `@use` 순서가 정한다 (위 「SCSS 소스 · CSS 출력」).

| 소스 | 역할 | 들어가는 것 | `:root` 변수 |
| --- | --- | --- | :-: |
| `common/_reset.scss` | 리셋 (맨 앞) | 브라우저 기본값(UA) 초기화. 토큰·프로젝트 고유 값 없음 — 어느 프로젝트에도 그대로 복사 | X |
| `common/` | **공통** — 모든 페이지가 쓰는 것 전부 | 디자인 토큰(`_tokens` `:root`) · `@font-face` · html rem 기준 · body · `.blind`/`.skip` · 진입 모션 · `.font-*` 텍스트 스타일 클래스 · 레이아웃 컨테이너(`.wrapper`/`.inner`) · GNB · 푸터 · 페이지 타이틀 영역 | O (`_tokens` 에만) |
| `components/` | **컴포넌트 조각** — 본문 안에 여러 번·여러 페이지에 들어가는 독립 부품 | 폼(인풋·셀렉트·체크박스) · 버튼 · 라벨 · 카드 · 게시글 블록 · 페이지네이션 · 탭 · 아코디언 · 모달 | X |
| `components/_style.scss` | **페이지 전용** — 한 페이지에만 나오는 디자인 | 한 파일에 페이지마다 구획 하나(화면명 · 프리픽스). 그 페이지들의 미디어쿼리는 파일 끝 반응형 블록에 구획 순서대로. 메인은 분량이 커서 `components/_main.scss` 따로. UI 부품은 처음부터 `components/_부품`, 두 번째 페이지에서 또 나온 것도 승격 | X |
| `guide.css` | `/html/worklist/guide/` 안. 가이드 전용 (SCSS 아님) | 가이드 문서 레이아웃 (`guide-` 프리픽스 + 스니펫 틀 `.sample` · `.sample-wrap` · `.sample-code`) | X |

**`common/` 과 `components/` 의 경계 — 세 가지 질문으로 가른다.** 하나라도 "예"면 `common/`.

| 질문 | 예 → `common/` | 아니오 → `components/` |
| --- | --- | --- |
| `_template.html` · `header.html` · `footer.html` 에 이미 들어 있는가? | GNB · 푸터 · 스킵 링크 · `.wrapper` · 페이지 타이틀 영역 | 버튼 · 셀렉트 · 카드 |
| 한 페이지에 **한 번만**, 항상 **같은 자리**에 있는가? | `<h1>` 영역(`.page-head`) | 같은 페이지에 n개 들어갈 수 있는 것 |
| 그것을 빼면 페이지가 **성립하지 않는가**? | 레이아웃 컨테이너 | 빼도 페이지가 되는 부품 — 가이드(`guide/list/`)에 복사용 마크업으로 올라가는 것 |

경계 사례 — 푸터 안의 패밀리사이트 드롭다운: 동작은 `common.js` 「드롭다운」 공통 모듈, 모양은 푸터에만 나와 `common/_footer`. 같은 모양이 다른 화면에도 나오면 그때 `components/` 부품으로 올린다. 페이지 타이틀 영역(`.page-head`)은 템플릿에 있으니 `common/_page`, 게시글 상세 헤더(`.post-head`)는 상세 페이지 본문에만 있는 부품이라 `components/_post`.

**`_style.scss` 는 페이지 전용만** — 한 페이지에만 있는 디자인을 **페이지마다 파일을 만들지 않고** `components/_style.scss` 한 파일에 페이지마다 구획 하나(구획 머리에 화면명 · 프리픽스)로 쓰고, 그 페이지의 1024/600 미디어쿼리는 파일 끝 반응형 블록에 구획 순서대로 둔다. 공통 부품 · 골격 변형으로 풀리는 페이지는 구획이 없다. 두 번째 페이지에서 같은 것이 나오면 `components/` 로 올리고 구획에서 지운다. `_style` 은 **출력의 맨 뒤**다 — 페이지 전용이 공통을 덮을 수 있어야 한다. 토큰·타이포 클래스처럼 "어디서나 쓰는 작은 단위"는 페이지 전용이 아니므로 `common/` 이다.

**`:root` CSS 변수는 `common/_tokens.scss` 한 곳에만 선언한다.** 다른 부분 파일이나 페이지 파일에 `:root` 를 두지 않는다.

#### `common.css` 섹션 순서 — 고정 (= `common.scss` 의 `@use` 순서, 부분 파일 하나가 섹션 하나)

```
0. 리셋 — common/_reset             브라우저 기본값 초기화
1. 디자인 토큰 — common/_tokens      :root (+ 1024/600 재선언은 파일 끝)
2. 웹폰트 — common/_fonts           @font-face
2-1. 텍스트 스타일 클래스 — common/_fonts  .font-{style}
3. 문서 기준 — common/_base         html(rem) · body (+ rem 재설정은 파일 끝)
3-1. 레이아웃 컨테이너 — common/_base  .wrapper · .inner
4. 접근성·공통 클래스 — common/_utilities  .blind · .skip · :focus-visible · 진입 모션
7. GNB (헤더) — common/_header
8. 푸터 — common/_footer
9. 페이지 타이틀 영역 — common/_page
```

7~9 의 반응형은 각 파일 끝에.

이어서 컴포넌트 — 부품 종류마다 부분 파일 하나다 (`components/_이름.scss`). 새 컴포넌트는 **해당 파일 안**에 넣고, 종류가 새로우면 파일을 만들어 엔트리의 컴포넌트 `@use` 끝과 목차에 한 줄 더한다. 각 파일의 반응형은 그 파일 끝에.

```
10. 폼 — components/_form            인풋 · 셀렉트 · 검색 · 체크박스 · 라디오 · 텍스트에어리어 · 입력 표 · 첨부 상자 · 파일 목록 · 첨부한 파일
11. 버튼 — components/_button
12. 라벨 — components/_label         라벨 · 뱃지 · 태그
13. 카드 — components/_card
13-1. 정보 상자 — components/_box
13-2. 사진 블록 — components/_visual
13-3. 리스트 — components/_list      번호 · 단계 · 점 목록
14. 게시글 · 콘텐츠 — components/_post   상세 골격 · 에디터 본문 · 이전다음
14-1. 썸네일 갤러리 — components/_post
14-2. 게시판 목록 — components/_board   목록 · 펼침 · 빈 목록 · 페이지네이션
15. 탭 — components/_tab
15-2. 표 — components/_table
15-3. 아이콘 — components/_icon     단독 아이콘 {이름}-icon
17. 아코디언 — components/_accordion
18. 오버레이 — components/_modal     레이어 팝업 · 알림
19. 메인 — components/_main
20. 페이지 전용 — components/_style    페이지마다 구획 하나 · 맨 아래
```

실제 목록은 엔트리 `common.scss` 머리 목차가 원본이다 — 이 표는 순서 규칙(골격 → 부품 → 메인 → 페이지 전용)을 보여 주는 예시다.

페이지 시작용 빈 문서는 `html/_template.html` 이다. 새 페이지는 **이 파일을 복사**해서 시작한다 — 메타·CSS/JS 로드·스킵 링크, 그리고 `common.js` 가 `header.html` · `footer.html` 로 채우는 빈 `<header>` · `<footer>` 자리가 들어 있다.

서브페이지 골격은 `<main id="content">` 안에 `.page-head`(분류 `.cate` → `<h1 class="tit">` → 설명 `.txt`) → KV 래퍼 `.page-kv` > `.page-kv-fixed` 또는 `.page-kv-expand`(선택, 둘 중 하나) → `.page-body > .inner > section.sec` 순서다 (골격 스타일은 `common/_page.scss` — 사진 블록은 `components/_visual`, 서브 메뉴 탭은 `components/_tab`).

- **섹션 공통 부품 — `.sec-head` · `.sec-txt`.** 섹션 제목 묶음은 `.sec-head`(`.label` · `h2.tit` · `.txt`), 문단(`<p>`)만 오는 글 영역은 `.sec-txt` 다 (`<div class="sec-txt"><div class="txt"><p>…</p></div></div>` — 글자 · 문단 간격은 `.txt` 가, 폭 · 위치 변형은 `.sec-txt` 가 갖는다). 글자 · 문단 간격은 `common/_page.scss` 한 곳이 갖고, 폭 · 위치(그리드 · 좌우)도 섹션 이름으로 덮지 않고 모양 이름 변형(`.sec-head-side` · `.sec-head-large` · `.sec-head-medium`(h3) · 좌우 배치 `.sec-split` 처럼)으로 `common/_page.scss` 에 두고, 어느 블록에나 같은 뜻인 자리 · 고정은 공통 속성 클래스(`.pos-end` · `.pos-sticky` — `common/_utilities.scss`)로 더한다. **제목 아래 간격은 `.sec-head` 의 공통 `margin-bottom` 이 갖는다** — 뒤에 오는 블록(목록 · 글 · 툴바 · 에디터)에 `margin-top` 을 주지 않는다. 값이 다른 섹션만 페이지에서 `.sec-head` 의 `margin-bottom` 을 덮고, 제목과 콘텐츠가 좌우로 놓이는 배치(flex row)는 여백이 화면에 영향이 없어 그대로 둔다. MO 에서 세로로 쌓을 때 `gap` 을 따로 주지 않는다 (겹친다). 여러 섹션에 나올 영역을 페이지 블록의 자식(`.srch-intro .copy`)으로 만들지 않는다.
- **사진 블록 `.swap-visual` · `.parallax-visual`.** 사진 블록은 글 섹션 안에 넣지 않고 별도 섹션으로 둔다 — `<section class="sec"><figure class="swap-visual">(.pin-spacer >) .stage > img</figure></section>`. `.sec` 은 `<section>` 에만 붙이고, 사진 블록도 `<section class="sec">` 로 감싸 공통 `.sec ~ .sec` 간격 하나로 바뀌게 한다. 본문 부품이라 `components/_visual.scss`(틀 크기 · 라운드 · `object-fit`), 핀 · 전환 · 패럴랙스 동작은 `common.js`. 라운드 틀(두 장이면 `.front` · `.back` 전환)은 `.swap-visual`, 화면 폭 + 패럴랙스는 `.parallax-visual` 하나(화면 폭 계산 `100vw` + `calc(50% - 50vw)` 를 자기가 갖는다).
- **타이틀 바로 아래 탭은 공통 래퍼 `.page-tab`** — 첫 섹션 맨 위의 `.tab-head` 를 스타일 없는 래퍼 `.page-tab` 으로 감싸고, 타이틀 여백은 `main:has(.page-tab) .page-head` 가 바꾼다 (KV 와 같은 방식). 래퍼가 `.tab-head` 만 감싸면 `.pos-sticky` 의 붙는 범위가 래퍼가 되어 붙지 않는다 — 붙는 탭이면 래퍼가 `.tab-head` + `.tab-body` 를 함께 감싼다.
- **KV 는 공통 래퍼 `.page-kv` 가 모양 블록 `.page-kv-{이름}` 을 감싼다.** 키비주얼 모양은 늘어날 수 있어 모든 KV 를 스타일 없는 래퍼 `.page-kv` 로 감싸고, KV 유무로 바뀌는 스타일(타이틀 여백 `main:has(.page-kv) .page-head`)은 공통 클래스에 건다 — 새 모양을 더할 때 그 규칙을 고치지 않는다. 모양별 스타일 · JS 선택자는 래퍼가 아니라 모양 블록으로 잡는다 (`.page-kv .visual` 은 모든 모양의 사진에 걸린다). 래퍼에는 스타일을 두지 않는다 — 모양 블록의 margin(확대 창의 음수 끌어올림 포함)이 래퍼를 지나 그대로 적용되고, 타이틀 등 형제를 찾는 JS 는 래퍼 기준(`closest(".page-kv").prev()`)으로 찾는다.
- **`.page-kv-fixed` — KV 고정 창.** 타이틀 아래 일정 높이의 빈 창이고, 안쪽 사진(`.visual img`)은 `position: fixed` 로 화면에 고정되고, 창의 `clip-path: inset(0)` 이 그 사진을 창 안에서만 그린다 — 스크롤하면 창이 고정 사진 위를 지나간다. `overflow: hidden` 은 fixed 자손을 자르지 못해 쓰지 않는다. 사진을 `--z-behind` 로 페이지 전체 뒤에 깔고 앞뒤 블록의 흰 바탕으로 덮는 방식은 쓰지 않는다 — 창 밖에도 사진이 계속 그려지고, 바탕이 빠진 블록마다 사진이 비친다. 블록을 넣으면 모션 페이지, 빼면 일반 페이지다. 들어올 때 사진이 확대된 채 시작해 원래 크기로 돌아오는 연출은 시작 배율을 CSS(`common/_page` — 모션 줄이기 제외)가, 원래 크기로 돌리는 것을 `common.js`(`PAGE_KV`)가 한다 (GNB 가 위에서 내려오는 첫 진입은 KV 와 상관없이 전 페이지 공통 — `introGnb` · `GNB_DROP`) — 페이지 JS 에 다시 만들지 않는다.
- `.page-kv-fixed` 에 `transform` · `filter` · `will-change: transform` 을 두지 않는다 — 고정 기준이 창으로 바뀌어 고정이 풀린다. 진입 확대(`PAGE_KV`)는 창이 아니라 `.visual` 에 건다.
- **`.page-kv-expand` — KV 확대 창.** `.page-kv-expand > .pin-spacer > .stage(100vh) > .visual > img`. 사진은 처음부터 화면 크기이고 보이는 창(`clip-path`)만 타이틀 아래 창(CSS 변수 `--kv-window-w` · `-h`, 무대 아래끝에 붙음)에서 시작한다. 무대가 놓인 자리에서 화면 위로 올라오는 동안 스크롤을 따라 창이 넓어져 화면 위에 닿는 순간 전체가 되고(스크럽 · 핀 없음), 넓어지는 동안 바로 앞 타이틀 글(`.page-head .inner`)은 위로 밀리며 사라진다(`headShift`). 그때부터 멈춰(`common.js` 「KV 창 확대」, 수치 `PAGE_KV_EXPAND`) 잠깐 기다린 뒤 화면 높이만큼 더 멈춰 있는 동안 본문(`.page-body`)이 그 위로 올라와 덮는다 — 본문 끌어올림(`margin-top: -100vh` · `position: relative` · `z-index`)은 `main:has(.page-kv-expand) .page-body` 로 CSS 가, 모션 줄이기(핀 없음)에서는 걸지 않는다. 창 윗변이 타이틀 바로 아래에 오도록 블록 자체는 `margin-top: calc(창 높이 - 100vh)` — 핀 무대 100vh 예외. 페이지 JS 에 다시 만들지 않고, `.page-kv-fixed` 와 둘 중 하나만 쓴다.

### 페이지 전용 CSS — 페이지 프리픽스

페이지 전용 CSS(`components/_style.scss`)에서는 **페이지 프리픽스**를 클래스명에 붙여 다중 작업자 간 충돌을 방지한다.

| 페이지 | 프리픽스 | 예시 |
| --- | --- | --- |
| search | `srch-` | `.srch-hero .tit` |
| news | `news-` | `.news-card .label` |
| history | `hist-` | `.hist-timeline .hist-timeline-item` |

프리픽스는 그 페이지 블록의 **루트에만** 붙인다. 자식은 역할 이름(`naming-components.md` 「자식 이름」).

```css
/* components/_style.scss — search 구획 */
.srch-hero { }
.srch-hero .tit { }
.srch-filter .basic-btn { }
```

`common/`(골격) · `components/`(부품) 의 공통 클래스는 프리픽스 없이 쓴다.

```css
/* common/_header.scss · _footer.scss — 골격 */
.gnb { }
.footer { }

/* components/_button.scss · _tab.scss — 부품 */
.basic-btn-primary { }
.tabs .tab.is-active { }
```

### HTML CSS/JS 로드 순서

```html
<!-- CSS — 한 파일 (웹폰트 @font-face 도 이 안에 — common/_fonts. 폰트 CDN <link> 없음) -->
<link rel="stylesheet" href="../common/css/common.css" />

<!-- JS (body 하단) — jQuery → GSAP(+ScrollTrigger) → 라이브러리(있을 때만) → common.js(헤더·푸터 조각 삽입 포함) → 페이지 JS. javascript.md 「공통 조각」 참조
     라이브러리는 전부 로컬 common/js/lib/ — CDN 으로 걸지 않는다 -->
<script src="../common/js/lib/jquery.min.js"></script>
<script src="../common/js/lib/gsap.min.js"></script>
<script src="../common/js/lib/ScrollTrigger.min.js"></script>
<script src="../common/js/common.js"></script>
<script src="../common/js/[page].js"></script>  <!-- 페이지 전용 있을 때만 -->
```

### 경로 참조

**상대경로**가 기본이다. 확인은 로컬 서버(`CLAUDE.md` 「로컬 확인」 명령)로 한다 (`file://` 은 조각이 빈다 — `javascript.md` 「공통 조각」).

- `/html/[file].html` — `../common/...`
- `/html/[section]/[file].html` — 깊이만큼 `../` 를 더한다 (예: `worklist/guide/list/button.html` → `../../../../common/...`)

> **절대경로를 쓰는 프로젝트도 있다.** 백엔드 템플릿(Thymeleaf·JSP 등)이 렌더링하는 프로젝트는 템플릿과 같은 방식이어야 마크업을 그대로 옮겨 담을 수 있어 `/common/...` 절대경로를 쓴다. **어느 쪽인지는 「프로젝트 설정」에서 확인한다.**
>
> 절대경로 프로젝트에서는 `file://` 로 열면 에셋이 깨지므로, 웹 루트를 기준으로 로컬 서버를 띄워 확인한다.
>
> 방법은 `CLAUDE.md` 「로컬 확인」에 적는다 (VS Code Live Server, 또는 `npx http-server . -c-1`).
