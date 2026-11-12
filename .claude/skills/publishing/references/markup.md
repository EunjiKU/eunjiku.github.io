# 시맨틱 HTML · SEO — publishing 스킬 §3 · §9 의 본문

> **언제 여는가** — 새 페이지의 `<head>`·heading 구조를 잡을 때, 표·빈 링크를 만들 때 연다. 실제 경로·파일명·값은 `CLAUDE.md` 「프로젝트 설정」과 `PROJECT.md` 가 우선한다.

## 3. 시맨틱 HTML

용도에 맞는 HTML 태그를 선택한다.

| 용도 | 태그 |
| --- | --- |
| 페이지 상단 영역 | `<header>` |
| 네비게이션 | `<nav>` + `aria-label` |
| 본문 주요 콘텐츠 | `<main>` |
| 독립적인 콘텐츠 블록 | `<article>` |
| 논리적 그룹 | `<section>` + `aria-label` |
| 이미지 + 캡션 | `<figure>` / `<figcaption>` |
| 용어 목록(연혁 등) | `<dl>` / `<dt>` / `<dd>` |
| 탭 UI | `role="tablist"` / `role="tab"` / `role="tabpanel"` + `aria-selected`, `aria-controls` |
| 탭 모양 앵커 (패널 없이 위치로 이동) | `role="group"` + `aria-label` 안의 `<button>` · 선택 `.is-active` + `aria-current="true"` — 탭 role 없음 (`accessibility.md`) |
| 하단 정보 | `<footer>` |
| 주소 | `<address>` |

`<div>`, `<span>`은 시맨틱 태그로 대체할 수 없을 때만 사용한다.

### 제목 + 콘텐츠는 논리 그룹으로 묶는다

배경·보더 같은 시각적 구분 없이 **간격만으로 나뉘어 있어도**, 제목과 그 콘텐츠가 한 단위면 `<section>`(heading 또는 `aria-label`)으로 묶는다. 그룹 간 간격은 제목에 마진을 거는 트릭(`.tit { margin-top } + :first-child 리셋`)이 아니라 **그룹 요소의 마진**(`.group ~ .group { margin-top }`)으로 처리한다. 그룹 순서 변경·삭제·조건부 숨김에 간격이 깨지지 않고, 개발팀이 그룹 단위로 반복·조건 처리할 수 있다.

### `<a>` 태그 — 빈 링크 처리

실제 이동할 URL 이 없는 `<a>` 에는 `href="#"` 대신 `href="javascript:"` 를 쓴다. `href="#"` 은 클릭 시 페이지 최상단으로 스크롤되는 부작용이 있다. 이동할 경로(화면 ID 등)를 주석으로 달지 않는다.

### `<table>` 작성 규칙

#### `<caption>` 필수

`<table>`을 만들 때 반드시 `<caption>` 태그를 포함한다. 내용은 `<thead>`의 `<th>` 항목들을 요약한 문장으로 작성한다. 시각적으로 숨겨야 하면 `.blind` 를 쓴다.

#### `<th>` 에 `scope` 필수

열 헤더 `scope="col"`, 행 헤더 `scope="row"`, 그룹 헤더 `colgroup`/`rowgroup`.

#### 캘린더(달력) UI 는 반드시 `<table>` 로

날짜 그리드를 `<div>` + grid 로 만들지 않는다. `<thead>` 에 요일 헤더(`<th scope="col">`), `<tbody>` 에 주 단위 행을 두고 위 규칙을 동일하게 적용한다. 선택일·기간 표시는 `<td>` 의 상태 클래스로 처리한다.

#### Border 전략 — 겹침 방지

셀마다 `border: 1px solid` 를 주면 `border-collapse: collapse` 에서도 시각적으로 두꺼워 보일 수 있다. **셀 단위 단방향 전략**을 쓴다.

```css
table { border-collapse: collapse; border-top: 1px solid var(--color-line-medium); border-left: 1px solid var(--color-line-medium); }
th, td { border: 0; border-right: 1px solid var(--color-line-medium); border-bottom: 1px solid var(--color-line-medium); }
```

---

## 9. SEO / 시맨틱

**신규로 만드는 모든 페이지에 아래 기준을 적용한다.** (기존 페이지는 요청 시 소급 적용)

### 사이트명 (필수)

**HTML 문서에 들어가는 사이트/브랜드 이름은 `CLAUDE.md` 「프로젝트 설정」이 지정한 값을 쓴다.**
지정이 없으면 **저장소 루트 폴더명**을 그대로 쓴다. 아래에서 `{사이트명}` 으로 표기한 자리는 모두 이 값으로 치환한다.

- 작업 폴더(`uxui`, `webapp`, `src` 등)를 사이트명으로 쓰지 않는다. 저장소 루트의 이름이 기준이다.
- **임의로 회사명·서비스명을 지어내지 않는다.** 정식 브랜드 표기가 확정되면 그때 사용자 지시에 따라 일괄 교체한다.
- 적용 대상 — `<title>`, `<meta name="description">`, `og:title` / `og:description` / `og:site_name`, 그 외 사이트명이 들어가는 모든 자리.
- 도메인이 확정되지 않았으면 `canonical` / `og:url` / `og:image` 는 `https://www.example.com/...` 를 임시로 두고 주석으로 표기한다.

```html
<!-- 사이트명이 acme 인 경우 -->
<title>뉴스 | acme</title>
<meta property="og:site_name" content="acme" />
```

### 문서 메타 (`<head>`)

| 항목 | 규칙 |
| --- | --- |
| `<title>` | `페이지명 \| {사이트명}` — 페이지명 먼저, `\|` 양옆 공백. 페이지마다 달라야 한다(접근성 「제목 제공」). 상세는 페이지명 자리에 글 제목, 페이지명을 정하기 어려우면 `{사이트명}` 만 |
| `<meta name="keywords">` | 핵심 검색 키워드 — 쉼표 + 공백 구분(`화재안전, 방재시험`). description 바로 위. SEO 설정표가 오기 전에는 템플릿 자리 그대로 두고 지어내지 않는다 |
| `<meta name="description">` | 페이지별 1~2문장 요약(검색 스니펫용). **필수** |
| `<html lang="ko">` / charset / viewport | 항상 포함 (기존과 동일) |
| `<link rel="canonical">` | 페이지 정규 URL 지정 |
| OG 태그 | 대표 이미지·공유가 의미 있는 페이지: `og:title` `og:description` `og:image` `og:type` `og:url` |
| 파비콘 | 크기 **16 · 32 · 48 · 180 · 192 · 512** 여섯 개 — 아래 「파비콘」 |

```html
<title>뉴스 | {사이트명}</title>
<meta name="keywords" content="{사이트명} 뉴스, 보도자료, 공지" />
<meta name="description" content="{사이트명}의 최신 뉴스와 소식을 전합니다." />
<link rel="canonical" href="https://www.example.com/media/news" />
<meta property="og:title" content="뉴스 | {사이트명}" /><!-- <title> 과 같은 값 -->
<meta property="og:description" content="{사이트명}의 최신 뉴스와 소식을 전합니다." /><!-- description 과 같은 값 -->
<meta property="og:image" content="https://www.example.com/common/images/og-default.jpg" />
<meta property="og:site_name" content="{사이트명}" />
<meta property="og:type" content="website" />
```

### 파비콘

시안에 파비콘이 오면 **16 · 32 · 48 · 180 · 192 · 512** 여섯 크기를 받는다 (빠진 크기는 디자인에 요청 — 큰 것을 줄여 쓰면 작은 크기에서 흐려진다).

| 크기 | 쓰이는 곳 | 파일 (`images/`) |
| --- | --- | --- |
| 16 · 32 · 48 | 브라우저 탭 · 작업표시줄 · 바로가기 · 검색 결과 아이콘 | `favicon.ico` 한 파일에 셋을 담는다 |
| 180 | iOS 홈 화면 | `favicon-180.png` |
| 192 · 512 | 안드로이드 홈 화면 · 설치 | `favicon-192.png` · `favicon-512.png` — 공통 에셋 폴더의 `site.webmanifest` `icons` 에 |

- 피그마 프레임을 크기 그대로 PNG 로 뽑는다(배율 없음). `.ico` 는 16 · 32 · 48 PNG 를 그대로 담아 Node 로 만든다 (ICO 머리 6바이트 + 항목당 16바이트 + PNG 원본 — 외부 도구 없이)
- `<head>` 의 `common.css` `<link>` 바로 위에 세 줄. 팝업 파일(`-P01` 등)과 조각(header · footer)에는 넣지 않는다

```html
<link rel="icon" href="../common/images/favicon.ico" /><!-- 파비콘 16 · 32 · 48 -->
<link rel="apple-touch-icon" href="../common/images/favicon-180.png" />
<link rel="manifest" href="../common/site.webmanifest" /><!-- 192 · 512 -->
```

```json
{
  "name": "{사이트명}",
  "short_name": "{짧은 이름}",
  "icons": [
    { "src": "images/favicon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "images/favicon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "browser"
}
```

- 개발 저장소로 옮길 때 `favicon.ico` 를 사이트 루트(`/favicon.ico`)에도 한 벌 둔다 — `<link>` 가 없는 문서(PDF · 오류 페이지)에서도 브라우저가 루트를 찾는다 (`handoff.md`)

### SEO 설정표를 받으면

고객사 · 기획이 SEO 설정표(페이지명 · Title · keyword · description · og:*)를 주면 **위 표의 기본 형식보다 설정표 값이 우선한다.**

1. 표 전체를 `PROJECT.md` 「SEO 태그」에 옮긴다 (출처 파일명 · 적용 단위 · 빈 칸 처리). 결정 기록에 한 줄, `CLAUDE.md` 「프로젝트 설정」의 `<title>` 규칙을 바꾼다
2. 적용 단위를 확인한다 — 행이 1depth 메뉴뿐이면 **하위 페이지는 모두 그 1depth 값 그대로** (파일명 접두어 = 1depth 로 고른다). 이 경우 `<title>` 이 페이지마다 같아진다 — 접근성 인증 대상이면 사용자에게 먼저 알린다
3. 빈 칸 — `og:title` · `og:description` 이 비어 있으면 Title · description 과 같은 값, `og:url` · `og:image` · `canonical` 이 비어 있으면 임시값(`example.com`) 유지
4. 팝업 파일(`-P01` 등 — 페이지에 들어가는 모달 조각)에는 넣지 않는다
5. 여러 페이지에 한꺼번에 넣을 때는 Node 스크립트로 `<title>` · keywords · description · og:title · og:description 다섯 자리를 바꾸고, 끝에 모든 페이지에서 다섯 값이 표와 맞는지 다시 뽑아 본다. 엑셀(.xlsx)은 zip 을 풀어 `xl/sharedStrings.xml` · `xl/worksheets/sheet*.xml` 을 읽는다
6. `_template.html` 의 자리 표시 문구를 「1depth 메뉴의 Title」처럼 바꿔 새 페이지가 같은 값을 쓰게 한다

### 문서 구조 (heading 위계)

- 페이지당 **`<h1>` 1개** (페이지 대표 타이틀 — 서브페이지는 `.page-head` 의 보이는 제목). 이후 섹션은 `<h2>` → `<h3>` 순서로 **건너뛰지 않는다**.
- **숨김 제목을 만들지 않는다** — 화면에 없는 제목을 `<h1~6 class="blind">` 로 넣고 `aria-labelledby` 로 잇지 않는다. 보이지 않는 글자라 문구가 바뀌어도 아무도 못 보고, 관리할 곳만 는다. 보이는 제목이 없는 구획은 `<section>` 만 두고, 그 아래 보이는 제목은 단계를 건너뛰지 않게 올린다(h3 → h2). 메인처럼 보이는 대표 타이틀이 없는 페이지는 `<h1>` 없이 둔다. 이름이 꼭 있어야 하는 창(`role="dialog"` · `role="alertdialog"`)만 `aria-label` — 보이는 제목 없는 알림은 `aria-label="알림"` + 문구에 `aria-describedby`. 버튼 글자 · 표 `<caption>` 의 `.blind` 는 해당 없음
- 시각적 섹션 제목은 `aria-label`만 두지 말고 **실제 heading 요소**로 만든다. (heading 이 필요 없는 순수 링크 카드의 제목은 예외 — 아래 「콘텐츠 시맨틱」)
- `<main>` 1개, 반복 목록은 `<nav>`/`<ul>`, 독립 콘텐츠 블록은 `<article>`.

### 콘텐츠 시맨틱

- **날짜 → `<time datetime="YYYY-MM-DD">`** (게시일/작성일 등 모든 날짜).
- 이미지: **의미 있는 콘텐츠 이미지는 구체적 `alt`** 작성. CSS 배경·크롭 등 장식성 이미지만 `alt=""`. 큰 이미지는 `loading="lazy"`.
- **CSS 가 크기를 정하는 이미지에는 `<img>` `width`·`height` 속성을 넣지 않는다** — 틀 이미지(카드 썸네일 `.card-list .thumb` · 배너 `.banner` · 레이어 썸네일 `.modal .thumb` 등 — 폭·높이를 rem 으로 고정하고 `object-fit: cover`)뿐 아니라 **`<img>` 아이콘(`.icon` 에 `width` · `height`) · 로고(틀 `.logo` 가 크기, img 는 `100%`)도 마찬가지다.** 크기는 CSS 가 정한다. 속성은 원본 비율대로 늘어나는 이미지(`.figure` · 본문 이미지 · CSS 가 `width: 100%; height: auto` 만 주는 이미지 — 부모 폭에 꽉 채우는 이미지는 부품 스타일을 만들지 않고 `<img class="img-full">`)에만 — 고정 틀 안 이미지에 속성을 넣으면 개발이 원본 크기를 그대로 옮겨 적어 의미 없는 값이 남는다.
- 링크 텍스트는 목적이 드러나게(“여기 클릭” 지양).
- 링크형 카드(카드 전체가 하나의 `<a>`)의 제목은 heading 대신 `<span>`/`<p>` 로 두어 heading 목록 오염을 피한다. `<a>` 는 HTML5 transparent 라 내부에 `<div>`·`<h_>`·`<p>` 도 넣을 수 있다.

> 스팬-인-스팬 등 요소 중첩은 3번(시맨틱 HTML)의 콘텐츠 모델을 따른다 — `<span>` 안에는 phrasing content만(블록 요소 금지).
