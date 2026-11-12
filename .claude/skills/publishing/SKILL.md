---
name: publishing
description: 웹 퍼블리싱(정적 HTML·CSS·JS) 코딩 컨벤션 — 폴더 구조·CSS 분리·시맨틱 HTML·케밥 네이밍·반응형·접근성·SEO·폰트·JS·완료 체크리스트. 웹 페이지의 HTML·CSS·JS 를 한 줄이라도 만들거나 고치기 전에 반드시 호출한다 (Figma 변환, 페이지 추가, 마크업·스타일 수정, 버그 픽스, 컴포넌트 작업). 프로젝트 실제 값(경로·파일명·브레이크포인트·사이트명)은 CLAUDE.md 「프로젝트 설정」과 PROJECT.md 가 우선한다.
---

# 퍼블리싱 코딩 컨벤션

Figma 변환뿐 아니라 코드 수정, 페이지 추가, 버그 수정 등 **마크업·스타일을 건드리는 모든 작업**에 적용한다.

> ## ⚠️ `CLAUDE.md` 의 「프로젝트 설정」이 우선한다
>
> 이 문서는 어느 프로젝트에나 적용되는 **범용 기본값**이다. 이 프로젝트의 실제 값(산출물 경로·폴더명·파일명·브레이크포인트·사이트명, 건드리면 안 되는 영역, 기존 자산)은 **`CLAUDE.md` 의 「프로젝트 설정」**에, 특정 작업에서만 보는 표(간격 스케일·대비 미달 색상·페이지 프리픽스·브라우저 범위)는 **`PROJECT.md`** 에 있다.
> **두 값이 다르면 그쪽을 따른다.** 아래는 어디까지나 기본값이다. 「프로젝트 설정」이 없는 프로젝트라면 기본값을 그대로 쓴다.
>
> | 항목 | 이 문서의 기본값 |
> | --- | --- |
> | 산출물 루트 · 공통 에셋 폴더 | 프로젝트 루트 · `common/` |
> | 에셋 경로 참조 방식 | 상대경로 |
> | CSS 파일명 | `common.css` **한 파일** (출력 하나 — 소스는 엔트리 `scss/common.scss` + `common/`(`_reset` 맨 앞) · `components/` 부분 파일 — 페이지 전용은 `components/_style` 한 파일) |
> | 브레이크포인트 | `1024px` · `600px` |
> | 루트 글자 크기 | (A) vw 반응형 — 인증 대상이면 다시 고른다 (§7) |
> | 클래스 네이밍 | 케밥 |
> | 폰트 로드 방식 | 로컬 `@font-face` (`common/fonts/` woff2) |
> | 라이브러리 로드 | 로컬 `common/js/lib/` — jQuery 3.7.1 · GSAP 3.12.5 + ScrollTrigger · Swiper 11.2.10 core(탭 스와이퍼를 쓰는 페이지만) (CDN 없음) |
> | 사이트명 | 저장소 루트 폴더명 |

## 본문은 references/ 에 있다 — 언제 여는가

이 파일은 **매 작업에 걸리는 규칙**만 둔다. 아래 상황이 되면 해당 파일을 연다. 열지 않고 기억으로 쓰지 않는다.

| 상황 | 파일 |
| --- | --- |
| 이미지·아이콘을 넣거나 이름 짓기, 포맷·배율 결정 | [`assets.md`](references/assets.md) |
| 어느 부분 파일에 넣을지, 섹션 순서, 페이지 전용 파일, 로드 순서, 경로 | [`css-architecture.md`](references/css-architecture.md) |
| `<head>` 메타·heading 구조, 표, 빈 링크 | [`markup.md`](references/markup.md) |
| 클래스 이름 짓기, 컴포넌트를 `components/` 에 올리기, 변형 클래스, 결합자 | [`naming-components.md`](references/naming-components.md) |
| 레이아웃 컨테이너·여백, 브레이크포인트, 단위, 변수, z-index, 이미지 위 텍스트(이미지를 absolute 로), sticky | [`css-rules.md`](references/css-rules.md) |
| rem 기준 방식을 고를 때 (프로젝트 시작 · 접근성 인증 대상일 때) | [`rem-options.md`](references/rem-options.md) |
| 글자 스타일 적용 · 텍스트 스타일 추가 · MO 글자 | [`typography.md`](references/typography.md) |
| 폰트 결정 · `@font-face` · 로드 방식 | [`fonts.md`](references/fonts.md) |
| 폼·표·캐러셀·모달·새 창 링크·오류 메시지, 인증(KWCAG) 대응 | [`accessibility.md`](references/accessibility.md) |
| JS 를 한 줄이라도 쓰거나 고칠 때 | [`javascript.md`](references/javascript.md) |
| 크로스브라우저 · 실기기 확인, 브라우저 지원 범위 | [`qa.md`](references/qa.md) |
| 안 쓰는 클래스 · 이미지, 무거운 사진, id 참조를 한 번에 볼 때 | [`scripts/audit.js`](scripts/audit.js) — 사용법은 파일 머리 |
| 작업을 끝내고 완료 보고하기 전 | [`checklist.md`](references/checklist.md) |

---

## 설계 원칙 — 공통 템플릿 우선 (전사 합의)

**페이지를 하나씩 따로 만들지 않는다.** 개발팀이 공통 구조를 한 번 구축하고 관리자가 데이터만 바꿔 페이지를 운영하는 것이 목표다. 퍼블리싱 단계에서 페이지마다 마크업을 복제하면 그 구조가 불가능해진다.

**아래 1·2번은 아래 모든 섹션보다 먼저 판단한다.**

1. **새 마크업을 쓰기 전에 기존 것을 찾는다.** 유사한 목록·상세 페이지는 **같은 구조·같은 클래스를 재사용**한다. `scss/components/` 와 이미 만든 페이지를 먼저 확인하고, 거기 있는 컴포넌트는 새로 만들지 않는다. **이후 페이지를 대비해 만든다** — 다른 화면에도 나올 UI 부품은 첫 등장부터 `components/_부품.scss` + 가이드(`guide/list/`) + `common.js` 모듈로, 페이지 전용 구획(`components/_style.scss`)에는 그 화면의 디자인만 (`naming-components.md` 「컴포넌트 작성 규칙」 8).

2. **콘텐츠를 마크업에 고정하지 않는다.** 텍스트·이미지·항목 수·노출 순서는 나중에 관리자가 바꾸는 **데이터**다. 그러니 시안에 카드가 3개 그려져 있어도 **3개를 전제로 짜지 않는다.**
   - 항목이 1개일 때와 10개일 때 모두 깨지지 않게 (`grid`/`flex` + `gap`, 고정 높이·고정 개수 금지)
   - 이미지 없는 항목, 텍스트가 2배 긴 항목, 뱃지 없는 항목에서도 레이아웃이 유지되게
   - 순서가 바뀌어도 되게 — `:nth-child` 로 개별 항목에 다른 스타일을 주지 않는다 (지그재그 같은 의도적 패턴은 예외)

3. **반복은 샘플 2~3건으로 보여 준다.** `<!-- 반복 시작/끝 -->` 주석은 달지 않는다 — 같은 구조가 여러 건이면 개발이 반복 단위를 안다. 서버 템플릿 반복은 항목(`<li>`) 자체에 걸고 감쌀 태그는 출력되지 않는 태그(`th:block`)로 — 항목 사이 `~` 구분선 때문 (`naming-components.md` 「컴포넌트 작성 규칙」 6 표).

4. **기존 컴포넌트는 확장으로 대응한다.** 변형이 필요하면 새 컴포넌트를 만들지 말고 변형 클래스를 더한다 — `.card` 에 `.card-wide` 를 붙이는 식.

5. **단, 억지로 합치지 않는다.** 구조나 동작이 실질적으로 다르면 별개로 만드는 게 맞다. 무리한 통합은 선택자만 복잡해진다.

> 공통화를 **먼저** 시도하고, 그 페이지에만 있는 것이 확실할 때만 `components/_style.scss` 의 그 페이지 구획으로 뺀다. 페이지 전용 스타일이 늘어나는 것은 공통화에 실패했다는 신호다.

---

## 0. 디자인 토큰

`scss/common/_tokens.scss` 의 `:root` 가 디자인 토큰 원본(SoT)이다. 변수 이름은 피그마 Variable 이름을 `/` → `-` 로 바꿔 그대로 쓴다 (`color/text/default/highest` → `--color-text-default-highest`). **별도 JSON 은 두지 않는다** — 두 벌이면 어긋난다. 토큰 교체 상태는 `_tokens.scss` 머리 주석에 적되, 피그마 파일 주소는 `PROJECT.md` 「피그마」에 둔다 (운영 소스 주석에 피그마 주소 · 노드번호를 쓰지 않는다 — §2).

> ⚠️ **템플릿에 들어있는 값(HEX·폰트·크기·간격)은 전부 구조 예시용 임의값이다.** 시안을 받으면 **가장 먼저 `_tokens.scss` 토큰부터 교체**한다. 교체 전에는 이 값으로 페이지를 만들지 않는다.

## 1. 폴더 구조 · 파일 역할

공통 에셋 폴더(기본 `common/`) 아래 `scss/` · `css/` · `images/` · `fonts/` · `js/`(+ `js/lib/`). 페이지는 `html/` 에 **`_template.html` 을 복사해** `FO-XXX-XX-XX-XXX.html`(정보구조도 화면 ID)로 만든다. 공통 조각은 `html/header.html` · `footer.html`, 작업 보드와 UI 가이드는 `html/worklist/` · `html/worklist/guide/`. 없는 파일을 읽으라는 지시를 만나면 만드는 것이 그 단계의 일이다 — 멈추지 않는다. 전체 트리는 `project-setup.md`.

**CSS 출력은 `common/css/common.css` 한 파일**이고, 페이지는 `<link>` 하나만 건다. 역할은 소스 폴더로 나눈다 — 엔트리 `scss/common.scss` 의 `@use` 순서(= 출력 순서)가 아래 표 순서다.

| 소스 | 역할 | `:root` |
| --- | --- | :-: |
| `scss/common/_reset.scss` | 브라우저 기본값 초기화 (맨 앞). 프로젝트 고유 값 없음 — 어느 프로젝트에도 그대로 복사 | X |
| `scss/common/` | **모든 페이지가 쓰는 것** — 토큰(`_tokens`) · `@font-face`(`_fonts`) · html rem 기준 · `.blind`/`.skip` · 글자 정렬 `.txt-left`/`.txt-center`/`.txt-right` · 진입 모션 · `.font-*` · `.wrapper`/`.inner` · GNB · 푸터 · 페이지 타이틀 | O (`_tokens` 에만) |
| `scss/components/` | **본문 안의 독립 부품** — 폼 · 버튼 · 라벨 · 카드 · 게시글 · 탭 · 페이지네이션 · 아코디언 · 모달 | X |
| `scss/components/_style.scss` | **페이지 전용** — 한 페이지에만 있는 디자인. 파일을 페이지마다 만들지 않고 이 한 파일에 페이지마다 구획 하나(화면명 · 프리픽스). 메인은 분량이 커서 `components/_main.scss` 따로. 엔트리 맨 아래 — 출력의 맨 뒤 | X |

- **스타일 소스는 `common/scss/`, `common/css/common.css` + `.map` 은 컴파일 산출물**이다 (`npm run scss:watch`, 넘기기 전 `npm run scss`). `css/` 를 직접 고치지 않는다. **부품 하나에 부분 파일 하나** — 고치는 파일은 `scss/common/_header.scss` · `scss/components/_form.scss` · `scss/components/_style.scss` 같은 부분 파일이고, 엔트리 `scss/common.scss` 는 `@use` 목록(= 출력 순서)뿐이다. 믹스인은 `scss/_tools.scss`(출력 없음 — 쓰는 부분 파일 맨 위에 `@use "../tools" as *;`). 반응형은 부분 파일마다 그 파일 끝에. 주석 규칙은 CSS 기준 그대로. **마크업(DOM) 구조대로 끝까지 중첩한다** — 루트부터 대상까지 클래스가 있는 조상을 하나씩 거친다 (단계를 건너뛰거나 한 줄에 이어 쓰지 않는다). 상태 · 덮어쓰기 · 반응형도 같은 경로로 · `&-접미` 금지 · 토큰은 CSS 변수 유지 — 예시는 `css-rules.md` 「SCSS 작성 규칙」.
- 골격/부품이 헷갈리면 세 질문(템플릿에 있나 · 한 번만 같은 자리인가 · 빼면 페이지가 성립 안 하나)으로 가른다 — `css-architecture.md`.
- 이미지는 `images/` 한 폴더, 접두어 `icon-` · `img-` · `bg-` (+ `logo-` · `og-`), 더미는 맨 앞 `@`. 아이콘은 SVG 파일 + CSS 로, 인라인 `<svg>` 금지. `img-`·`bg-` 는 2배율 — `assets.md`. 버튼 · 링크가 아닌 단독 아이콘은 `{이름}-icon` 공통 클래스(`components/_icon.scss` — `.mail-icon`)로, 페이지 프리픽스를 붙이지 않는다.
- HTML 안에 `<style>` · 인라인 `style` · 인라인 `<script>` 를 쓰지 않는다. **예외는 표 열 폭 하나** — 표마다 열 구성이 달라 `<colgroup><col style="width: 240rem">` 로 준다(`components/_table.scss` 머리 · 가이드 Table).

## 2. 주석 언어

코드 내 모든 주석은 **한글**로 쓴다 — CSS 섹션·컴포넌트 설명, JS 파일 상단·JSDoc·인라인, HTML 섹션 구분(`<!-- 섹션 01 — 히어로 -->`).

**주석은 개발 · 현업이 소스를 쓰는 데 필요한 것만 둔다 — HTML · CSS · JS 모두.** 운영 소스(`common/` · `html/`)는 현업이 보는 코드다. HTML 은 짧은 섹션 구분, `<!-- @ … -->` 상태 전달(§12), 조각(header · footer) 상단의 사용법 몇 줄(메뉴 키 · 변형 클래스), 개발 착수 이후 수정한 자리의 `<!-- YYYY-MM-DD 수정 : 수정 내용 -->`(§11). CSS · JS 는 섹션 · 컴포넌트 · 동작 설명 — **무엇을 하는지**만 쓰고 구현 이유 · 경위는 쓰지 않는다 (출력 CSS · JS 기준 — SCSS `//` 소스 주석에는 구현 이유 · 브라우저 대응 근거를 써도 된다, `css-rules.md` 「SCSS 작성 규칙」). 형태는 「활성 시 `.is-active` 추가」 · 「탭은 `aria-selected` 로 선택 표시」 · 「열림 `.is-open` + 버튼 `aria-expanded`」처럼 **상태 · 속성 · 사용법 한 줄**이다 — 현업 · 운영이 이어받아 쓰는 소스라 설명을 남발하지 않고, 코드를 읽으면 보이는 것은 적지 않는다. `<!-- @ -->` 에는 개발이 바꿀 상태만 — 퍼블 JS 가 이미 하는 동작 · 옵션(`data-multiple` 등)은 가이드 설명에. 아래는 어디에도 달지 않는다.

- 페이지 맨 위 화면 ID · 피그마 노드 · 설계서 버전 · 수정 이력 블록, 「동작 · 공통 부품」 설명 블록 (이력은 워크리스트 `.col-note`, 동작은 설계서)
- CSS · SCSS 안의 마크업 구조도 (HTML · 가이드가 원본 — `css-rules.md` 「SCSS 작성 규칙」 주석)
- 반복 시작/끝 표시, 설계서 번호, 시안 출처, HTML 안의 CSS 설명, 링크 뒤 이동 경로(`<!-- 실제 경로: … -->` · `<!-- FO-… -->`)
- 화면 ID(`FO-…`) · 피그마 노드번호 · 피그마 주소 — CSS · JS 주석에도 쓰지 않는다. 다른 화면은 화면명으로 가리키고, 피그마 주소는 `PROJECT.md` 「피그마」에 둔다
- 결정 · 요청 날짜(「사용자 요청 YYYY-MM-DD」), 참고 사이트, 내부 문서 참조(`publishing §N` · `TODO.md` · 완료 보고 「가정」 · 가이드 승격 후보)
- 확인 대기 · 가정은 주석이 아니라 `TODO.md` 에. 「MO 시안 없음 — 임시값」 같은 임시값 표시도 주석에 남기지 않는다

## 3. 시맨틱 HTML

용도에 맞는 태그를 고른다 (`<header>` · `<nav aria-label>` · `<main>` · `<article>` · `<section>` · `<figure>` · `<dl>` · `<footer>` · `<address>`). `<div>`·`<span>` 은 대체할 수 없을 때만. 전체 표와 예시는 `markup.md`.

- 제목 + 콘텐츠는 간격만으로 나뉘어 있어도 `<section>` 으로 묶는다. 그룹 간격은 그룹 요소의 마진으로.
- 이동할 URL 이 없는 `<a>` 는 `href="javascript:"` (`#` 은 맨 위로 스크롤된다). 이동할 경로를 주석으로 달지 않는다.
- `<table>` 은 `<caption>` + `<th scope>` 필수. 달력은 반드시 `<table>`.

## 4. 레이아웃 컨테이너 — `.wrapper` / `.inner`

- `.wrapper` 는 전체 폭(max-width 없음), `.inner` 는 섹션 안에서 콘텐츠 폭을 제한하는 정렬 도구다 (`max-width: calc(var(--content-width) + var(--side-padding) * 2)` + 좌우 `padding`).
- **기본 좌우 여백은 컨테이너가 담당한다.** 컴포넌트가 `calc(100% - N)`·좌우 margin·고정폭 중앙정렬로 여백을 중복 구현하지 않는다. 더 들어가야 하면 차이만큼의 padding 을 갖고 근거를 주석으로.
- 풀 블리드는 섹션 루트가 담당하고, `.inner` 안에서 음수 마진으로 탈출하지 않는다. 상세는 `css-rules.md`.

## 5. 반응형 브레이크포인트

**데스크톱 퍼스트**, `max-width` 2단계만 쓴다 — `@media (max-width: 1024px)`(모바일) · `@media (max-width: 600px)`(소형). 1280·768·480 등 다른 값은 쓰지 않는다. JS 분기는 `matchMedia("(max-width: 1024px)")`.

- `<br>` 앞에 공백을 둔다 (모바일에서 숨기면 단어가 붙는다).
- 미디어쿼리는 특이도를 올리지 않는다 — 변형 클래스 값을 되돌릴 때는 부모를 끼워 특이도를 올린다. 누락되면 가로 오버플로로 나타난다.
- 기존 자산이 `599px` · `@media all and` 를 쓰면 「프로젝트 설정」을 따른다.
- **PC 시안만 있을 때** — 1024 / 600 은 "깨지지 않는" 값으로 먼저 짜고(가이드에 MO 값이 있으면 그 값, 없으면 PC 값 유지), 임시인 화면 · 부품은 `TODO.md` 「MO 시안 수령 대기」 한 항목에 모아 둔다. 주석에는 임시 표시를 하지 않는다 (§2). MO 시안이 영역별로 오면 그 영역의 1024 이하 블록을 통째로 교체하고 TODO 항목에서 지운다 — CSS 만 바뀌면 워크리스트 기록은 없다 (§11).

## 6. Class 네이밍 — 케밥 케이스

전체 규칙·예시·결합자 표는 `naming-components.md`.

- **하이픈 단일 체계** — `.block` · `.block-element` · `.block-variant`. BEM `__` `--` 를 쓰지 않는다 (BEM 프로젝트면 「프로젝트 설정」에 적혀 있다).
- **값을 이름에 넣지 않는다** (`.h64` · `.mt20` · `.basic-btn-blue` X) — 역할·상대어로 (`.basic-btn-large` · `.basic-btn-primary`). 색 이름도 값이다 — 역할로 부를 수 없는 색 고르기는 `-bg{번호}` (`.label-chip-bg1` · `.info-box-bg1`).
- **최대 3단어.** 넘으면 자손 선택자로 푼다.
- **이름 첫머리만 보고 종류를 안다** — 루트는 부품 이름(`.card-list` · `.gnb`), 변형 · 모양은 루트 접두어(`.basic-btn-primary` · `.card-list-fill`), 상태는 `is-`, 진입 모션 대상은 클래스가 아니라 `data-motion` 속성. **자식은 루트 접두어 없이 역할 이름만** — CSS 는 `.card-list .tit-wrap .tit` 처럼 루트 아래 자손으로. **예외 — 목록 항목은 `{목록}-item`** (`.faq-list .faq-item`). 태그 이름 금지 · `-wrap` · 버튼 `-btn` · 역할 이름의 뜻은 `naming-components.md` 「자식 이름」. 모양 이름은 용도가 아니라 형태로.
- **축약어** — `tit` · `txt`(설명도 기본 `txt`, 구분할 때만 `desc`) · `thumb` · `btn` · `img` · `wrap` · `num` · `cont` 만 줄인다 (`title` · `text` 풀네임 금지, 임의 축약 금지) — 표는 `naming-components.md` 「자식 이름」.
- **상태는 `is-` 로 시작하는 독립 클래스** — 정해진 목록(`naming-components.md` 「상태 클래스」) 밖의 이름을 만들지 않는다. 진입 모션은 대상을 `data-motion` 속성으로 표시하고 상태만 `.is-shown` 이다 (`javascript.md` 「모션」).
- 새 컴포넌트 전에 같은 이름이 기존 CSS 에 있는지 grep 한다.

**컴포넌트를 새로 만들거나 고칠 때는 `naming-components.md` 「컴포넌트 작성 규칙」 · 「변형 클래스」 · 「모양 클래스」를 연다.** 매번 걸리는 것만 남긴다.

- 같은 디자인은 같은 마크업·같은 클래스 — 가이드(`guide/list/`)나 먼저 만든 페이지에서 복사. 다르면 변형 클래스(`.basic-btn-primary`)를 더하고, 페이지 스코프 덮어쓰기(`.news-list .basic-btn`)는 X.
- 루트에 바깥 `margin` · 고정 `width` 가 없다 — 간격은 감싸는 컨테이너의 `gap`/`padding`, 고정폭은 변형 클래스로.
- **태그가 아니라 클래스로 잡는다** — `.info-list dt` X → `<dt class="tit">` + `.info-list .tit`. 예외는 에디터 본문 · 틀 안의 사진 · 영상(`.thumb img` · `.bg img` · `.bg video`) · 표 칸(`th` · `td`) 뿐 (`naming-components.md` 「컴포넌트 작성 규칙」 2).
- **구조에 기대는 선택자(`>` · `+` · `~` · `:first-child` · `:nth-child` 류)는 클래스 + 자손 선택자 · `gap` · `padding` · `:has()` 로 안 될 때만** — 개발이 태그를 감싸거나 순서를 바꾸면 깨진다. **형제 결합자는 `+` 대신 `~`** (`.info-item ~ .info-item`). 목적별 기준 표는 `naming-components.md` 「컴포넌트 작성 규칙」 6.

## 7. CSS 작성 규칙

전체 규칙은 `css-rules.md`.

**단위 — rem.** rem 이 몇 px 인지는 「프로젝트 설정」의 「루트 글자 크기」가 정한다. (A) vw 반응형(`html { font-size: 0.052vw }`, 시안 px 숫자 그대로 rem)이 기본값이고, (B) `100%` 는 ÷16, (C) `62.5%` 는 ÷10 이다. 루트 선언은 `common/_base.scss`(「3. 문서 기준」)에 두고, px 로 고정하지 않는다. **(A) 는 브라우저 확대 시 글자가 커지지 않아 WCAG 1.4.4 에 걸린다** — 접근성 인증 대상이면 프로젝트 시작 때 [`rem-options.md`](references/rem-options.md) 로 다시 고른다. 한 프로젝트에 두 방식을 섞지 않는다.

| 값 | 단위 |
| --- | --- |
| 폭·높이·간격·패딩·글자·라운드·아이콘 | rem |
| 보더·아웃라인·`box-shadow`·헤어라인·브레이크포인트·터치 타깃 최소 크기 | px |
| `letter-spacing` | em |
| `line-height` | 단위 없음 |

- **변수는 폰트(`--font-*`)와 컬러(`--color-*`)뿐이다** — 굵기·행간·자간·간격·라운드는 값으로 박는다. 구조값(`--content-width` · `--side-padding` · `--header-padding` · `--gnb-height`)과 `--z-*`, 그리고 컴포넌트 안에서만 쓰는 JS · 지역 상태 변수(`--motion-delay` · `--tabs-gap` 처럼 `:root` 에 두지 않는 것)만 예외. `:root` 는 `common/_tokens.scss` 에만.
- **HEX 를 직접 박지 않는다.** 시안에 있는데 토큰에 없으면 `:root` 에 먼저 추가한다. 간격이 `PROJECT.md` 「간격 · 라운드 스케일」 밖이면 "토큰 외 간격"으로 보고한다.
- `z-index` 는 숫자 없이 `_tokens.scss` `:root` 의 `--z-*` 토큰만 쓴다 (`-1` 포함 — `--z-behind`). 단계 표는 `css-rules.md` 「z-index」, 새 층은 토큰부터.
- 선언 순서 — Layout → Box → Typography → Visual → Animation.
- **디자인 데이터에 없는 속성은 넣지 않는다** (관성으로 넣는 그림자·보더·hover). 필요하면 보고에 "피그마에 없음 — 추가 제안". 반대로 UA 기본값은 리셋한다.
- `vw`·`vh` 를 레이아웃 값에 직접 쓰지 않는다 (rem 이 이미 vw 기반이면 이중 비례).

## 8. 접근성 (A11y)

**전체 규칙은 [`references/accessibility.md`](references/accessibility.md) 에 있다.** 아래는 매 작업에 걸리는 최소 항목이고, 폼·표·캐러셀·모달·새 창 링크·오류 메시지를 만들 때와 인증(KWCAG 2.2) 대응 점검 때는 그 파일을 반드시 연다. 실측 절차는 `a11y-check` 스킬.

- 포커스 링은 전역 `:focus-visible`(`common/_utilities.scss`) — `outline: none` 금지(입력 부품의 포커스 테두리만 예외). **`:hover` 는 `:focus-visible` 과 같이, `@media (hover: hover)` 안에.** 포커스 요소에 `mask` 금지(`::before` 에) — 이유는 `accessibility.md` 「포커스 링 · Hover」.
- 모든 페이지에 스킵 링크(`.skip` → `<main id="content">`), `<html lang="ko">`, `<h1>` 하나와 건너뜀 없는 heading 위계. **숨김 제목(`<h_ class="blind">` + `aria-labelledby`) 금지** — 보이는 제목이 없으면 `<section>` 만, 메인처럼 대표 타이틀이 안 보이면 `<h1>` 없음 (`markup.md` 「문서 구조」).
- 의미 있는 이미지는 구체적 `alt`, 장식은 `alt=""`, CSS 아이콘 버튼은 `aria-label`. `<label>`–`<input>` 은 `for`/`id` 로 연결.
- 상태(마감·선택·오류)를 **색만으로 구분하지 않는다.** 텍스트·아이콘을 병행한다.
- 텍스트 대비 4.5:1 이상이 기본값. **단 「프로젝트 설정」의 「컬러 대비」가 「신경 쓰지 않음」이면 시안 색을 그대로 쓰고, 대비를 이유로 색을 바꾸거나 이슈로 올리지 않는다** — 다른 접근성 항목은 그대로 챙긴다. 점검하는 프로젝트(인증 대상)만 `PROJECT.md` 「대비 미달 색상」 표의 조합을 정보성 텍스트에 쓰지 않는다.
- 터치 타깃 44×44px, `select` 의 `onchange` 자동 이동 금지, 새 창 링크는 사전 알림, 중복 `id` 없음.
- 탭 UI 는 WAI-ARIA(`role`·`aria-selected`·`aria-controls`, 패널은 `aria-labelledby`). 인증 심사기관이 다른 방식을 요구하면 「프로젝트 설정」에서 바꾼다. 패널 없이 위치로 이동하는 **탭 모양 앵커는 탭 role 대신 `aria-current="true"`** (`accessibility.md`).

## 9. SEO / 시맨틱

신규 페이지 전부에 적용한다. 전체 표·예시는 `markup.md`.

- **사이트명은 「프로젝트 설정」 값**, 없으면 저장소 루트 폴더명. 회사명·서비스명을 지어내지 않는다.
- `<title>` 은 `페이지명 | {사이트명}` (페이지마다 다르게), `<meta name="keywords">`(쉼표 구분 — 값은 지어내지 않는다), `<meta name="description">` 필수, `canonical`, 공유 의미가 있으면 OG. 도메인 미정이면 `https://www.example.com/...` + 주석.
- **SEO 설정표를 받으면 표 값이 우선한다** — `PROJECT.md` 「SEO 태그」에 옮기고 1depth 단위면 하위 페이지까지 같은 값으로 (`markup.md` 「SEO 설정표를 받으면」).
- `<h1>` 1개(보이는 대표 타이틀 — 숨김 제목으로 만들지 않는다), `<h2>` → `<h3>` 건너뛰지 않음, `<main>` 1개. 날짜는 `<time datetime>`. 링크형 카드의 제목은 heading 대신 `<span>`/`<p>`.

## 10. 폰트

폰트 결정·로드 방식·`@font-face` 는 [`fonts.md`](references/fonts.md), 글자 스타일 적용은 [`typography.md`](references/typography.md). 이 프로젝트의 보유 폰트는 `CLAUDE.md`.

- 폰트 이름 SoT 는 `--font-family-kor` 하나. 영문 전용 토큰·`.eng` 는 시안에 영문 폰트가 따로 있을 때만 추가한다. `@font-face` 는 쓰는 weight 만, `font-display: swap`, 같은 family 중복 선언 금지. 유료 폰트는 작업 전에 확인하고 임의 대체하지 않는다.
- **선택자의 글자는 `font: var(--font-{style}); letter-spacing: var(--font-{style}-ls);` 두 줄뿐이다.** `--font-{style}` 은 피그마 텍스트 스타일 이름 그대로이고 값은 「굵기 크기 / 행간 글꼴」 리터럴이다 (역할 별칭 없음).
- 같은 스타일에서 **굵기만 다른 변형**만 `font-weight` 한 줄로 덮는다. 문장 안 일부만 굵게는 `<b>` — 리셋이 `<strong>` · `<b>` 굵기를 남긴다. 그 외 `font-size`·`font-weight`·`line-height` 개별 선언은 틀린 것이다. 시안 글자가 스타일 밖이면 "토큰 없음"으로 보고한다.
- **마크업에 폰트 클래스를 붙이지 않는다** — 자리가 정해진 글자는 선택자에서 변수로, `.font-{style}` 은 에디터 본문 같은 콘텐츠 텍스트에만. MO 크기는 변수가 바꾼다 — 미디어쿼리에서 크기를 다시 쓰지 않고, 다른 스타일이면 변수만 바꾼다. 글자 숨김은 `font-size: 0` 대신 `.blind` — `typography.md`.

## 11. 작업 완료 후 — 기록

진행 상황 · 할 일은 `TODO.md` 에 남긴다 (작업 보드는 없다).

프로젝트 전체에 영향을 주는 결정(토큰·경로·브레이크포인트 변경)은 `PROJECT.md` 「결정 기록」에, 보드에 올릴 수 없는 일·결정 대기·물어볼 것은 `TODO.md` 에 적는다. **스킬 본문에 날짜·프로젝트 결정을 적지 않는다.**

## 12. JavaScript

**JS 를 쓰거나 고칠 때는 [`javascript.md`](references/javascript.md) 를 연다.** 매번 걸리는 것만 남긴다.

- 퍼블리싱 JS 는 **화면 모양을 바꾸는 UI 인터랙션**(토글 · 아코디언 · 드롭다운 · 레이어 · 모션)만 한다. **얼럿 · 입력값 검증 · 조회 · 저장 · 이동 요청은 개발 담당**이라 만들지 않는다. 설계서의 동작을 HTML 주석으로 옮겨 적지 않는다 (페이지 상단 설명 주석 없음). **탭은 선택이 곧 조회라 클릭 이벤트를 넣지 않는다** — 정적 `.is-active` 상태만 마크업한다.
- JS 를 넣지 않은 상태 전환(탭 · 페이지 번호 · 비활성 · 오류)은 마크업 바로 위 `<!-- @ … -->` 주석으로 개발에 넘긴다. 가이드에서 복사할 때 이 주석도 같이 가져온다 — 형식은 `javascript.md` 「개발 영역」.
- **개발이 채울 값은 넣지 않는다** — 탭 `<button value>` · `<option value>` 의 구분 코드처럼 DB 에서 오는 값은 비워 둔다 (임의 · 임시값도 금지). 「전체 · 선택 안 함」을 뜻하는 `value=""` 만 유지한다.
- **첫 화면 상태는 CSS 가 갖는다** — 들어올 때 움직이는 것의 시작값(숨김 · 확대)을 JS 가 실행되며 걸지 않는다. 스크립트를 받는 동안 CSS 만으로 먼저 그려져 값이 튄다 (`javascript.md` 「모션」 첫 항목).
- 라이브러리는 **jQuery 3.x + GSAP 3.x(ScrollTrigger)** 를 로컬 `common/js/lib/` 에서 로드한다 (CDN 없음). 파일 구성 · 골격 · 문법 · 상태와 ARIA · 성능 · 모션 · 헤더·푸터 조각 · 로드 순서는 전부 `javascript.md` 에 있다.

---

## 13. 완료 전 체크리스트

**페이지·컴포넌트 작업을 "끝났다"고 보고하기 전에 [`references/checklist.md`](references/checklist.md) 를 열어 전부 확인한다.** 열지 않고 기억으로 체크하지 않는다. 다른 스킬의 공통 체크리스트도 그 파일 하나로 모았다 (`figma-to-html` §4 = 피그마 대조·실측, `a11y-check` = 접근성 실측 절차).
