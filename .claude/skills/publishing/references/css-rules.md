# 레이아웃 · 반응형 · CSS 작성 규칙 — publishing 스킬 §4 · §5 · §7 의 본문

> **언제 여는가** — 레이아웃 컨테이너·여백, 브레이크포인트, 단위, 변수, z-index, 이미지 위 텍스트, sticky 를 다룰 때 연다. 실제 경로·파일명·값은 `CLAUDE.md` 「프로젝트 설정」과 `PROJECT.md` 가 우선한다.

## 4. 레이아웃 컨테이너 — `.wrapper` / `.inner`

- **`.wrapper`** — 페이지 최상위 래퍼. `max-width를 지정하지 않는다`. 항상 뷰포트 전체 너비(100%)를 사용한다.
- **`.inner`** — 각 섹션 내부에서 콘텐츠 최대 폭을 제한하는 컨테이너. `width: 100%` + `max-width: calc(var(--content-width) + var(--side-padding) * 2)` + `margin: 0 auto` + `padding: 0 var(--side-padding)`을 가진다 (border-box 라 max-width 에 좌우 여백을 더해야 콘텐츠 폭이 `--content-width` 가 된다).
- 히어로(Hero), 탭, 풀 블리드 배경 등 **전체 너비가 필요한 요소**는 `.inner`로 감싸지 않는다. 해당 요소 자체가 100% 너비를 차지하고, 내부 텍스트/콘텐츠만 `.inner`로 제한한다.

```html
<div class="wrapper">
  <main>
    <!-- Hero: 전체 너비 (inner 없음) -->
    <section class="hero">
      <div class="hero-content">...</div>
    </section>

    <!-- 콘텐츠 섹션: inner로 최대 폭 제한 -->
    <section class="sec">
      <div class="inner">
        <h2>...</h2>
        <p>...</p>
      </div>
    </section>
  </main>
</div>
```

### 좌우 여백 소유권 규칙

- **페이지 기본 좌우 여백은 레이아웃 컨테이너(`.inner`)가 담당한다.** 페이지 컴포넌트(툴바·리스트·카드)가 `calc(100% - N)`, 좌우 `margin`, 고정폭 중앙정렬로 **기본 여백을 중복 구현하지 않는다.**
- 컨테이너의 자식 컴포넌트는 **`width: 100%` 기준**으로 작성한다.
- 기본 여백보다 더 들어가야 하는 컴포넌트는 **차이만큼의 `padding`(델타)** 을 자신이 갖는다. 변환 근거를 소스 주석으로 남긴다. (`// 시안 인셋 268 − 기본 여백 228 = 40` — 「SCSS 작성 규칙」 주석 항목)
- 여백 값 변경은 `_tokens.scss` 의 `--side-padding` / `--header-padding` 한 곳에서 끝나야 한다.
- **서브페이지 본문은 `.page-body > .inner` 하나**로 감싼다 — 섹션마다 `.inner` 를 반복하지 않는다 (모션 때문에 구조를 갈라야 하는 특별한 경우만 예외). 화면 폭을 채우는 블록은 공통 클래스를 두지 않고 그 부품이 폭을 직접 계산한다 — `100vw` + `margin-left: calc(50% - 50vw)` (`.parallax-visual` 참고). 스크롤바 폭 넘침은 `.page-body:has(그 부품) { overflow-x: clip }` 으로 자른다 — `hidden` 은 스크롤 컨테이너가 돼 안의 sticky · 핀이 깨진다. 그 안에 콘텐츠 폭이 필요하면 블록 안에 `.inner` 를 다시 둔다. 쓰는 곳이 없는 공통 클래스는 남겨 두지 않는다.
- **본문 섹션은 `<section class="sec">` — 섹션 옆에 이름(`{페이지}-{이름}`)을 붙이지 않는다.** — `.sec` 은 `<section>` 에만 붙인다(사진 블록 `<figure>` 도 `<section class="sec">` 로 감싼다). 섹션 사이 간격은 공통 `.sec`(`common/_page.scss` 의 `.sec ~ .sec`, 같은 클래스 반복 항목이라 형제 결합자 예외 — `+` 가 아니라 `~` 라 섹션 사이에 개발 마크업(숨김 요소)이 끼어도 간격이 유지된다)가 갖고, 안의 배치는 안쪽 블록(공통 변형 `.sec-head-side` · `.sec-split`, 공통 속성 `.pos-end`, 부품, 프리픽스 붙은 페이지 블록)이 갖는다. 섹션 이름은 섹션 자체에 예외 디자인(전용 바탕 · 풀스크린 · 핀 무대 — `.{페이지}-{섹션}`)이 있을 때만 붙인다. 시안의 섹션 간격이 몇 px 씩 다르면 공통 값으로 맞추고 보고한다. 첫 마지막 섹션 아래(푸터 위) 여백은 `.page-body` 의 `padding-bottom` 이 갖는다. KV 와 본문 사이 간격은 KV 가 갖는다 — `.page-kv-fixed` 는 `margin-bottom`(`clip-path` 창이라 `padding` 이면 창이 그만큼 넓어져 사진이 보인다), `.page-kv-expand` 는 덮고 올라오는 본문 위 `padding`(`main:has(.page-kv-expand) .page-body` — margin 이면 본문이 늦게 올라와 핀이 끝날 때 다 덮지 못한다). KV 가 없으면 본문이 타이틀 바로 아래에 붙는다 (간격은 `.page-head` 아래 padding).
- 메인처럼 섹션 루트가 배경 · 보더 · `position: absolute` 기준을 갖는 풀스크린 페이지는 섹션 루트를 전체 폭으로 두고 섹션 안에 `.inner` 를 둔다.

---

## 5. 반응형 브레이크포인트

**데스크톱 퍼스트**로 작성하고, `max-width` 미디어 쿼리로 축소한다.
**브레이크포인트는 2단계만 사용한다. 그 외 브레이크포인트(1280px, 768px, 480px 등)는 사용하지 않는다.**

```css
/* Desktop first (기본 스타일) */

@media (max-width: 1024px) {
  /* 모바일 */
}
@media (max-width: 600px) {
  /* 소형 모바일 */
}
```

각 브레이크포인트에서 조정해야 할 대표 항목:

- **1024px (모바일)** — GNB 메뉴 숨기기(햄버거 전환), 2열 → 1열 레이아웃, 사이드 패딩 축소, 폰트 사이즈 축소, 보조 비주얼 요소 `display: none`
- **600px (소형 모바일)** — 최소 패딩, 풀 와이드 레이아웃, 그리드 1열 고정

JS에서 PC/모바일 분기가 필요한 경우 `(min-width: 1025px)` 또는 `(max-width: 1024px)`를 사용한다.

### 구간마다 내용이 다를 때 — `.only-pc` · `.only-mob`

배치 · 크기만 다르면 미디어 쿼리로 바꾼다. **내용 자체(이미지 파일 · 문구)가 PC 와 MO 에서 다를 때만** 둘 다 마크업에 두고 공통 클래스로 한쪽만 보인다 (`common/_utilities`).

- `.only-pc` 는 1025px 이상, `.only-mob` 은 1024px 이하(태블릿 포함)에서만 보인다. **두 구간뿐이다** — 태블릿 전용 같은 세 번째 클래스를 만들지 않는다
- 다른 구간에서 **숨기기만** 한다 — 보이는 구간의 `display` 는 요소 · 부품 값 그대로다. 보이는 쪽에 `display: block` 을 강제하지 않는다 (`hidden` 속성을 되살리고 flex 부품을 block 으로 바꾼다)
- 관리자가 PC · MO 이미지를 따로 등록하는 영역(팝업 · 배너)은 `<img class="only-pc">` + `<img class="only-mob">` 두 장으로 짠다. `alt` 는 둘 다 같은 값(숨긴 쪽은 읽히지 않는다), 권장 사이즈는 `<!-- @ … (개발) -->` 주석으로 남긴다. 더미가 한 장뿐이어도 구조는 두 장
- 한 요소의 일부 속성만 다르면 이 클래스를 쓰지 않는다 — 마크업을 두 벌 두는 만큼 운영 때 두 곳을 고치게 된다

### 강제 줄바꿈 `<br>` — 앞에 공백을 둔다

모바일에서 `br { display: none }` 으로 줄바꿈을 풀 때 `<br>` 은 공백을 삽입하지 않으므로 앞뒤 단어가 붙는다. `<p>Creative Innovation <br />for a Better Future</p>` 처럼 `<br>` 앞에 공백을 둔다. 줄 끝 공백은 데스크톱 렌더링에 영향이 없다.

### 반응형에서 CSS 변수를 되돌릴 때 — 특이도를 올린다

**미디어 쿼리는 특이도를 올려주지 않는다.** 변형 클래스(`.card.card-wide`)로 지정한 변수를 브레이크포인트에서 되돌리려면 선택자 특이도가 변형 클래스보다 높아야 한다. `.card { --x: 0 }` 은 `.card.card-wide` 를 못 이기므로 `.list .card { --x: 0 }` 처럼 부모를 끼운다. 되돌리기가 누락되면 모바일에서 **가로 오버플로**로 나타난다 — `figma-to-html` §4-4 점검으로 잡는다.

> **소형 브레이크포인트 값과 미디어쿼리 표기는 「프로젝트 설정」을 확인한다.** 기존 자산이 `599px` 이나 `@media all and (...)` 형식을 쓰고 있으면 그쪽에 맞춘다 — 한 저장소에 두 값이 섞이면 유지보수가 어려워진다.

> **참고 — `rem` 단위**: `html { font-size: 0.052vw }` (`common/_base.scss` 「3. 문서 기준」, `_reset.scss` 는 건드리지 않는다) 로 `rem` 을 **vw 반응형**으로 쓰는 프로젝트가 많다. 그 경우 `16rem` 은 16px 이 아니라 뷰포트 비율로 스케일된다. 픽셀 절대값이 필요하면 `px` 를 명시한다. 기존 자산이 이 방식이면 **신규 CSS 에도 같은 선언을 넣어 동작을 일치시킨다.**

---

## 7. CSS 작성 규칙

### 단위 — rem. 기준은 「프로젝트 설정」이 정한다

길이 값은 `rem` 으로 쓴다. **`rem` 이 몇 px 인지(루트 글자 크기 방식)는 `CLAUDE.md` 「프로젝트 설정」의 「루트 글자 크기」가 정한다.** 세 방식이 있고(비교와 선택 기준은 [`rem-options.md`](rem-options.md)), 어느 쪽이든 아래 단위 표는 같다. 루트 선언은 `common/_base.scss`(「3. 문서 기준」)에 둔다 — `_reset.scss` 에 두지 않는다.

| 방식 | 루트 선언 (`common/_base.scss`) | 시안 px → 코드 | 언제 |
| --- | --- | --- | --- |
| **(A) vw 반응형** (기본값) | `html { font-size: 0.052vw }` + 브레이크포인트마다 재선언 | **숫자 그대로** `24px` → `24rem` (시안 폭에서 1rem = 1px) | 시안을 비율 그대로 축소해야 하는 PC 퍼스트 사이트. 기존 자산이 이 방식이면 반드시 따른다 |
| (B) 100% | `html { font-size: 100% }` (브라우저 기본 16px) | `24px` → `1.5rem` (÷16) | 앱 웹뷰·모바일 퍼스트처럼 폭 변동이 작을 때, 접근성 인증(브라우저 글자 확대) 대상일 때 |
| (C) 62.5% | `html { font-size: 62.5% }` (기본 10px) | `24px` → `2.4rem` (÷10) | (B) 와 같은 이유인데 시안 환산을 쉽게 하고 싶을 때 |

루트를 `16px` · `10px` 처럼 **px 로 고정하지 않는다** — (A) 처럼 브라우저 글자 크기 설정을 무시하게 된다. (B)·(C) 는 반드시 `%`.

(A) 에서는 브레이크포인트마다 `html` 의 `font-size` 가 바뀌어 전체가 비례 축소된다. (B)·(C) 에서는 폭·여백만 %/flex 로 유동 처리하고 타이포·세로 간격을 rem 으로 둔다. **한 프로젝트에 두 방식을 섞지 않는다.**

| 값 | 단위 | 이유 |
| --- | --- | --- |
| 폭·높이·간격·패딩·글자 크기·라운드·아이콘 크기 | **rem** | 뷰포트에 비례해야 하는 값 |
| 보더·아웃라인 두께 | **px** (`1px`, `2px`) | rem 이면 좁은 화면에서 0.3px 가 되어 사라진다 |
| `box-shadow` 오프셋·블러 | px | 〃 |
| 헤어라인·sr-only 보정(`1px`, `-1px`) | px | 〃 |
| 미디어쿼리 브레이크포인트 | px | `html` 글자 크기에 영향받으면 안 된다 |
| `letter-spacing` | em | 글자 크기에 비례 |
| `line-height` | 단위 없음 | 글자 크기에 비례 |

- 한 속성 안에서 px 와 rem 을 `calc()` 로 섞지 않는다. 보더 보정(`calc(100% - 1px)`)만 예외다.
- `vw`·`vh` 를 레이아웃 값에 직접 쓰지 않는다. rem 이 이미 vw 기반이라 이중 비례가 된다.
- 간격·라운드는 변수 없이 `rem` 값으로 쓴다 (`padding: 0 24rem`). `PROJECT.md` 「간격 · 라운드 스케일」 밖의 값이 시안에 나오면 "토큰 외 간격"으로 보고한다 (`figma-to-html` §4-1). 글자는 폰트 토큰 `--font-*` 를 쓴다.

### CSS 변수 (Custom Properties)

디자인 토큰을 `common/_tokens.scss` 의 `:root` 에 CSS 변수로 정의한다. **변수 이름은 Figma Variable 이름과 1:1 매칭한다** (`/` → `-`). 이 파일이 토큰의 원본이다.

```css
/* common/_tokens.scss — 1. 디자인 토큰 */
:root {
  /* Colors — 피그마 Variable color/* 이름 그대로 */
  --color-bg-primary: { color.bg.primary };
  --color-text-default-highest: { color.text.default/highest };
  --color-text-default-medium: { color.text.default/medium };

  /* Fonts — 피그마 텍스트 스타일 이름 그대로. 값은 「굵기 크기 / 행간 글꼴」 리터럴 (§10) */
  --font-b3-reg: 400 16rem / 1.6 "Pretendard", sans-serif;  --font-b3-reg-ls: -0.015em;

  /* Layout — 시안의 콘텐츠 폭·사이드 여백으로 교체 */
  --content-width: 1600rem;
  --side-padding: 160rem;
}
```

- **HEX 를 CSS 에 직접 박지 않는다.** 시안(피그마 Variable)에서 확인한 값만 `:root` 변수로 등록해 쓴다.
- 시안에 있는데 `:root` 에 없는 값이 나오면, 임의로 쓰지 말고 **토큰으로 먼저 추가한 뒤** 사용한다.
- 반응형에서는 `:root` 변수를 재선언하여 일괄 조정한다.
- **변수로 두는 것은 폰트와 컬러뿐이다**. 글자 굵기(`400`·`600`)·행간(`1.5`)·자간(`-0.015em`)·간격(`24rem`)·라운드(`500rem`) 는 변수를 만들지 않고 **값을 그대로 박는다.** 폰트 토큰(텍스트 스타일 `--font-{style}` 한 층)과 컬러 토큰(`--color-*`)만 `:root` 에 둔다. 레이아웃(`--content-width` · `--side-padding` · `--header-padding` · `--gnb-height`)과 `--z-*` 는 한 곳에서 바꿔야 하는 구조값이라 예외로 남긴다.

> **기존 자산에 SCSS 변수(`$Navy`, `$Gray50` …)가 있어도 그것이 토큰의 출처가 아니다.** SoT 는 언제나 `_tokens.scss` 의 `:root` 이고, 신규 CSS 는 그 변수만 쓴다. 두 체계를 섞거나 `$` 변수를 CSS 로 옮겨 적지 않는다. 기존 값이 시안과 같다면 `:root` 에 그 값을 토큰으로 넣어 맞춘다.

### z-index — 스케일 토큰만 쓴다

겹침 순서는 `_tokens.scss` 의 `--z-*` 토큰으로만 지정한다. `z-index: 9999` 같은 임의 숫자를 쓰지 않는다. 새 층이 필요하면 토큰을 먼저 추가한다.

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--z-behind` | -1 | 쌓임 맥락 안에서 콘텐츠 뒤로 (헤더 안 딤 등) |
| `--z-base` | 1 | 겹치는 장식·카드 호버 등 기본 |
| `--z-sticky` | 100 | 고정 헤더·탭·스크롤 고정 요소 |
| `--z-dropdown` | 200 | 셀렉트·드롭다운·툴팁 |
| `--z-overlay` | 300 | 딤 |
| `--z-modal` | 400 | 모달·레이어 팝업·바텀시트 |
| `--z-toast` | 500 | 토스트·알림 |
| `--z-skip` | 1000 | 스킵 링크 (항상 최상단) |

### 선언 순서

1. Layout (`display`, `grid`, `flex`, `position`)
2. Box model (`width`, `height`, `margin`, `padding`)
3. Typography (`font-size`, `line-height`, `color`)
4. Visual (`background`, `border`, `border-radius`, `box-shadow`)
5. Animation (`transition`, `animation`)

### SCSS 작성 규칙

소스는 `scss/`, 출력은 `css/` + `.map` (`css-architecture.md` 「SCSS 소스 · CSS 출력」). **출력 CSS 가 아래 규칙을 전부 만족해야 한다** — SCSS 는 쓰는 편의일 뿐 결과물의 기준은 CSS 다.

- **마크업(DOM) 구조대로 끝까지 중첩한다.** 루트에서 시작해 대상까지 **클래스가 있는 조상을 마크업 순서대로 하나씩** 중첩하고, 대상이 태그면 맨 끝에 태그(`img { }`)를 둔다. 루트 선택자를 반복해 적는 CSS 식 작성(`.info-list { … }` 다음 줄에 `.info-list .info-item { … }`)도, 중간 단계를 건너뛰거나 한 줄에 이어 쓰는 것(`.viewer .img-item img`)도 금지다. 클래스가 없는 중간 요소(`<li>` 등)만 건너뛴다. 소스가 마크업 모양 그대로라 어느 요소의 스타일인지 경로로 바로 찾는다.

  ```scss
  // X — 단계를 건너뛰고 한 줄에 (실제 마크업은 .side > .thumb-list > .thumb-item > .thumb > img)
  .thumb-gallery {
    .thumb img { filter: grayscale(1); }
  }

  // O — 마크업 경로 그대로
  .thumb-gallery {
    display: flex;

    .side {
      .thumb-list {
        .thumb-item {
          .thumb {
            img { filter: grayscale(1); }

            &.is-active {
              img { filter: none; }
            }
          }
        }
      }
    }
  }
  ```

- **상태 · 가상 요소 · hover 는 그 요소 블록 안에 `&` 로** — `&.is-active { img { } }` · `&::after` · `&[aria-expanded="true"]` · `@media (hover: hover) { &:hover, &:focus-visible { img { } } }`. 부모 상태가 자식을 바꾸면 부모 블록 안에 `&.is-open { .menu { .depth1 { … } } }` 처럼 자식 경로를 다시 끝까지 쓴다.
- **덮어쓰기는 기본 규칙과 같은 경로로 끝까지 쓴다** — 상태(`&.is-open`) · 변형 루트(`.news-card-wide` 가 `.news-card` 자식을 바꿀 때) · 조건 루트(투명 헤더) · 파일 끝 반응형 블록 모두. 경로가 깊어지면 특이도도 올라가므로, 덮어쓰는 쪽 경로가 기본보다 짧으면 진다 (`.gnb.is-open .depth1-item` 은 `.gnb .menu .depth1 .depth1-item` 에 진다). 반응형 예: `@media (max-width: 1024px) { .info-list { .info-item { padding: 24rem; } } }`.
- **한 규칙이 두 갈래 경로에 걸리면** 갈라지는 단계에서 선택자 목록으로 묶는다 (`.links { .support, .address { .label { … } } }`). 같은 선언을 갈래마다 복사하지 않는다.
- **예외** — 에디터 본문(`.editor` — 태그 구성을 알 수 없어 태그 선택자. 블록 간격은 CSS 로 주지 않고 관리자가 넣은 빈 줄 `<br>`), 진입 모션 유틸(`[data-motion]` 속성 기준 · `[data-motion-group] > *`), 같은 클래스 반복 항목의 형제 간격(`.info-item { & ~ .info-item { } }` · `.sec ~ .sec` — `+` 대신 `~`), 조건이 붙은 문서 루트(`main:has(.page-kv-expand) { .page-body { } }`).
- **`&-접미` 로 클래스를 조립하지 않는다** (`.card { &-title { } }` X). 클래스 전체 이름(`.card-title`)을 소스에서 grep 할 수 있어야 한다 — 가이드 · 개발이 이름으로 찾는다.
- **반응형은 부분 파일마다 그 파일 끝**에 `@media (max-width: 1024px)` → `600px` 순으로 둔다 (`css-architecture.md` 「SCSS 소스 · CSS 출력」). 선택자 안에 네스팅해도 되지만 그 부품 하나의 반응형이 한눈에 보일 때만 — 한 파일 안에서 두 방식을 섞지 않는다.
- **부품 하나에 부분 파일 하나.** `common/_header.scss` · `components/_tab.scss` · `components/_main.scss` 처럼 나누고 엔트리(`common.scss` 등)에는 `@use` 만 둔다. 출력 CSS 의 순서는 엔트리의 `@use` 순서다.
- 디자인 토큰은 SCSS 변수가 아니라 CSS 변수(`:root`)다 — 런타임에 1024/600 재선언하고 개발 · 가이드가 같은 이름으로 쓴다. SCSS 변수 · 믹스인은 반복되는 **구조**(예: 줄 수 제한 말줄임, 아이콘 mask 선언)에만 `_tools.scss` 로 두고 값은 넣지 않는다.
- `@extend` 를 쓰지 않는다 — 출력 선택자가 예상과 다르게 묶여 개발이 읽기 어렵다. 공통 모양은 변형 클래스(§6)로.
- 주석 — `expanded` 출력은 `/* */` 를 CSS 에 그대로 남기고 `//` 는 지운다. **CSS 를 받는 개발이 클래스를 쓰는 데 필요한 것**(섹션 제목 · 목차 · 상태 클래스 · 변형 · 사용법 · 토큰 값 메모)은 `/* */`, **SCSS 를 고치는 사람만 필요한 것**(구현 이유 · 브라우저 대응 근거 · 교체 상태)은 `//`. **남길지는 「코드만 봐서는 알 수 없는가」로 정한다** — 마크업 구조도(`<div class="…"><span …>` 를 옮겨 적은 것)는 HTML · 가이드가 원본이라 쓰지 않는다(마크업이 바뀌어도 안 고쳐져 틀린 채 남는다. 구조 대신 「없으면 그리지 않는다」 · 「`aria-hidden`」 같은 마크업에서 안 보이는 조건만). 아래 선언을 다시 읽어 주는 값 설명(「크기 48 · -large 60」), 모든 파일에 같은 배치 안내(「반응형은 이 파일 끝에」 — §1 에 있다), 작성 규칙 「~금지」(스킬에 있다)도 쓰지 않는다. 남기는 것은 **이유** — 지우면 누군가 「고칠」 코드(`outline` 을 끈 이유 · iOS 확대 방지 16px 처럼). 한 머리 주석에 둘이 섞이면 `/* */` 블록 바로 아래에 `//` 줄로 나눈다. 리셋은 번호 섹션 제목만 `/* */`. 출력 CSS 에도 §2 주석 규칙이 그대로 적용되므로 화면 ID · 노드 · 날짜는 어느 쪽에도 쓰지 않는다.
- 결합자 · 특이도 규칙은 CSS 와 같다 — 네스팅 때문에 `>` 가 생기거나 변형 클래스가 부모 안에 묻히지 않게, 덮어쓰기가 기본 규칙보다 짧은 경로라 지지 않게 출력 CSS 로 확인한다 (`figma-to-html` §4-1 grep 은 `scss/` 소스에 돌린다).

### 여백 책임 — 컨테이너 원칙

콘텐츠와 푸터(또는 다음 섹션) 사이의 여백은 **감싸는 컨테이너**가 담당한다. 페이지네이션·버튼 같은 하위 컴포넌트에 `padding-bottom`/`margin-bottom` 을 직접 주지 않는다. 컴포넌트가 다른 자리에 재사용될 때 여백이 따라가면 안 된다.

### 디자인 데이터에 없는 속성은 넣지 않는다

"보통 카드에는 그림자가 있다" 같은 관성으로 시안에 없는 그림자·보더·전환·hover 를 추가하지 않는다. 필요하다고 판단되면 코드가 아니라 완료 보고에 "피그마에 없음 — 추가 제안"으로 분리한다. 반대로 UA 기본값(`<button>` 배경, `<address>` 이탤릭, `<ul>` 마커)은 반드시 리셋한다 — `common.css` 가 이미 리셋하는 것은 다시 쓰지 않는다.

같은 이유로 `transition` 은 `all` 이 아니라 **바뀌는 속성만** 적는다 — `all` 은 시안에 없는 속성(레이아웃 · 포커스 링 · 반응형 전환)까지 움직인다.

### 이미지 위에 텍스트 — 이미지를 absolute 로 깐다

배경처럼 깔린 이미지 위에 제목·설명이 얹힌 카드·배너·비주얼은 **이미지를 `position: absolute` 로 깔고, 텍스트는 일반 흐름에 둔다.** 텍스트를 absolute 로 띄우지 않는다.

- 이유 — 텍스트가 흐름에 있어야 박스 높이가 글자 양을 따라 늘어난다. 텍스트를 띄우면 컨테이너에 `height` 를 고정해야 하고, 문구가 길어지거나 모바일에서 줄이 늘거나 브라우저 글자 확대를 하면 이미지 밖으로 넘치거나 잘린다.
- 컨테이너 — `position: relative` + `isolation: isolate`(쌓임 맥락) + `overflow: hidden`. 높이는 `height` 가 아니라 **`min-height`**. 텍스트 위치(하단 정렬 등)는 flex 정렬과 `padding` 으로 잡는다 — `bottom`·`left` 좌표로 잡지 않는다.
- 이미지 — `position: absolute; inset: 0` + `width/height: 100%` + `object-fit: cover` + `z-index: var(--z-behind)`. `<img>` 에 `width`·`height` 속성 없음 (`markup.md` 「콘텐츠 시맨틱」).
- 딤·그라데이션 — 컨테이너 `::after` 를 같은 방식(absolute · `inset: 0` · `--z-behind`)으로 깐다. DOM 순서상 이미지 위, 텍스트 아래에 그려진다.
- 예외 — 모서리에 고정되는 작은 요소(배지·아이콘 버튼·페이지 표시)는 absolute 로 띄워도 된다. 제목·설명처럼 길이가 바뀌는 글은 안 된다.

```html
<li class="visual-card">
  <img class="thumb" src="../common/images/img-welfare-health.jpg" alt="" loading="lazy" />
  <strong class="tit">건강 및 포상</strong>
  <p class="txt">임직원의 건강한 삶을 응원하며, …</p>
</li>
```

```css
.visual-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  isolation: isolate;
  min-height: 320rem;
  padding: 40rem;
  border-radius: 20rem;
  overflow: hidden;
}
.visual-card .thumb {
  position: absolute;
  inset: 0;
  z-index: var(--z-behind);
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* X — 텍스트를 띄우고 높이를 고정 */
.visual-card { position: relative; height: 320rem; }
.visual-card .text { position: absolute; left: 40rem; bottom: 40rem; }
```

### `position: sticky` — 그리드 안에서 쓸 때

그리드 아이템을 sticky 로 만들 때는 **`align-self: start`** (기본값 `stretch` 면 행 높이만큼 늘어나 고정이 안 된다)와 **`grid-row` 명시** (DOM 순서와 시각 순서가 다르면 자동 배치가 다음 행으로 밀어낸다)를 함께 지정한다. 고정 헤더가 있으면 `top` 에 헤더 높이를 반영하고 앵커 이동 시에도 같은 값을 뺀다.

### 펼침 높이 전환 — `grid-template-rows`

아코디언처럼 내용 높이만큼 펼치는 전환은 높이를 재지 않고 `grid-template-rows: 0fr → 1fr` 로 한다 (패널 안쪽 요소에 `min-height: 0` · `overflow: hidden`).

- **머리 줄과 패널을 한 그리드에 둘 때 머리 행은 `max-content`** (`max-content 0fr` → `max-content 1fr`). `auto` 로 두면 펼치는 도중 남는 높이를 머리 행이 나눠 받아, 머리 줄이 늘었다 줄어들며 출렁인다
- 닫힌 패널을 `hidden` 으로 숨기는 스크립트는 **그 속성(`grid-template-rows`)의 `transitionend`** 를 기다린다 — 다른 속성으로 전환하면 닫힌 뒤 숨겨지지 않는다
- 펼침 표시 아이콘(+ → − · 화살표 회전)은 패널과 같은 시간으로 전환한다. 두 막대를 겹쳐 − 를 만들면 겹친 자리가 진해 보이므로 돌린 막대는 `opacity: 0` 으로 뺀다

### 고정 헤더(GNB) — 패널을 늘 그려 두고 `clip-path` 로 접는다

헤더 아래로 펼쳐지는 2depth 패널은 `display` · `height` 를 바꿔 열고 닫지 않는다. 호버 · 스크롤을 빠르게 반복하면 한 프레임씩 흰 띠 · 선이 남아 "깜빡"인다.

- 패널(`nav`)은 헤더 위에 `absolute` 로 전체 폭을 덮고 **늘 그려 둔다.** 닫힘은 `clip-path: inset(0 0 calc(100% - var(--gnb-height) + 1px) 0)` 처럼 헤더 줄만 남겨 자르고(높이가 소수 px 라 딱 맞추면 패널이 반 픽셀 비쳐 1px 더 자른다), 열림은 `inset(0)` — `clip-path` 트랜지션으로 아래로 펼쳐지고 위로 접힌다. 패널 높이가 필요하면 JS 가 CSS 변수(가장 긴 2depth 높이)로 넣는다
- 스크롤 중 위로 숨기기(`.is-hidden`)는 `transform` 대신 `top` 으로 — 안의 `clip-path` · 딤과 쌓임 기준이 흔들리지 않는다
- 열림 딤은 헤더 루트의 `::after`(`opacity` 전환 · `pointer-events: none`) — 패널과 같은 속도로 깔리고 걷힌다. 별도 요소 · 마우스를 가로채는 딤을 두지 않는다 (닫힘은 1depth `mouseleave`)
- 투명 헤더는 「아무것도 안 할 때만」 투명 — `:not(.is-open, :hover, :focus-within)` 이고 맨 위(또는 숨는 중)일 때. 맨 위에서 닫힐 때는 패널 바탕 · 2depth 도 헤더 줄과 같은 속도로 함께 투명해지게 한다
- 높이 측정 아코디언 · `visibility` 지연 전환 · `will-change` · 입력 방향 판정 같은 우회책으로 깜빡임을 잡지 않는다 — 구조를 위처럼 바꾼다
