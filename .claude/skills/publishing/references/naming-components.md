# 클래스 네이밍 · 컴포넌트 작성 — publishing 스킬 §6 의 본문

> **언제 여는가** — 새 클래스 이름을 지을 때, 컴포넌트를 `components/` 에 올릴 때, 변형 클래스를 만들 때, 결합자(`>` `+`)를 쓰고 싶을 때 연다. 실제 경로·파일명·값은 `CLAUDE.md` 「프로젝트 설정」과 `PROJECT.md` 가 우선한다.

## 6. Class 네이밍 — 케밥 케이스

**기본은 하이픈 단일 체계다.** BEM 의 `__`(element) `--`(modifier) 를 쓰지 않는다.

```
.card-list                 /* 컴포넌트 루트 — 부품 이름 */
.card-list-fill            /* 변형 · 모양 — 루트 이름을 접두어로 */
.card-list .tit-wrap       /* 자식 — 루트 아래 역할 이름. 루트 접두어를 반복하지 않는다 */
.card-list .tit-wrap .tit
```

예 — 루트 `.gnb` · `.footer` · `.card-list` · `.tabs` · `.modal`, 변형 `.basic-btn-primary` · `.card-list-fill` · `.gnb-transparent`, 자식 `.gnb .logo` · `.gnb .depth1-link` · `.footer .copyright` · `.card-list .thumb` · `.modal .close-btn`

> **BEM 을 쓰는 프로젝트라면** 「프로젝트 설정」에 그렇게 적혀 있다. 그때는 `.block__element--modifier` 체계를 따르고, 아래 「상태 클래스」 대신 Modifier(`.tabs__btn--active`)로 상태를 표현한다. **판단 기준은 기존 자산이다** — 한 저장소에 두 네이밍이 섞이는 것이 가장 나쁘다.

### 네이밍 원칙

- **컴포넌트(루트)** — 독립적으로 재사용 가능한 단위. 예: `.gnb`, `.hero`, `.tabs`, `.timeline`, `.footer`, `.card-list`. 루트 이름만 부품을 식별한다.
- **자식** — **루트 이름을 접두어로 반복하지 않고 역할 이름만** 쓴다 (`.tit` · `.txt` · `.thumb` · `.desc` · `.date` · `.tit-wrap`). 부모 루트가 있으니 다른 부품과 겹칠 일이 없고, CSS 는 `.card-list .tit` 처럼 **루트 + 역할** 자손 선택자로 쓴다 — 아래 「자식 이름」.
- **변형 · 모양** — 루트에 붙는 것이라 루트 이름을 접두어로. 예: `.basic-btn-primary`, `.basic-btn-outlined`, `.card-list-fill`
- **값(사이즈·색·숫자)을 이름에 넣지 않는다.** 높이 64px 라고 `.h64`, 간격 20px 라고 `.mt20`, 파랑이라 `.blue` 로 짓지 않는다. 값이 바뀌면 이름이 거짓이 되고 전부 갈아야 한다. **역할·의미**로 짓는다 — `.basic-btn-large`, `.card-compact`, `.basic-btn-primary`. 디자인에서 크기 단계가 나뉘면 `small / medium / large` 처럼 **상대어**로 구분한다.

  ```css
  /* O — 역할·상대어 */
  .basic-btn-large { height: 64rem; }
  .card-compact .txt-wrap { padding: 16rem; }  /* 간격은 변수 없이 값으로 (§7) */

  /* X — 값이 이름에 박힘 */
  .h64 { height: 64rem; }
  .mt20 { margin-top: 20rem; }
  .basic-btn-blue { background: var(--color-{버튼 주색}); }
  ```
- **루트는 최대 3단어, 자식은 1~2단어.** 자식은 역할 이름이라 보통 한 단어고, 같은 루트 안에서 구분이 필요할 때만 두 단어(`.tit-wrap` · `.depth1-link` · `.depth2-link`)다. 루트 이름을 자식에 다시 붙여 길어지지 않는다. 불가피하게 넘기면 완료 보고에 사유를 적는다.

  ```css
  /* O — 루트 + 역할 */
  .news-card .tit { }
  .gnb .depth2-link { }        /* depth1 링크와 구분해야 하니 두 단어 */

  /* X — 루트 접두어를 자식마다 반복 */
  .news-card-title { }
  .gnb-depth2-list-item-link { }
  .news-card-period-text { }
  ```

### 자식 이름 — 루트 아래 역할 이름

루트 안의 요소는 **그 자리의 역할**로 짓고 루트 접두어를 붙이지 않는다. 부모 루트가 스코프를 만들어 주므로 다른 부품의 같은 이름과 섞이지 않는다.

```html
<ul class="card-list card-list-fill">
  <li class="card-item">
    <a class="link" href="…">
      <span class="thumb"><img src="…" alt=""></span>
      <span class="txt-wrap">
        <div class="tit-wrap"><strong class="tit">…</strong><span class="label">NEW</span></div>
        <p class="txt">…</p>
        <time class="date" datetime="…">…</time>
      </span>
    </a>
  </li>
</ul>
```

```scss
.card-list {
  .card-item {
    .link {
      .txt-wrap {
        .tit-wrap {
          .tit { font: var(--font-h6-sb); letter-spacing: var(--font-h6-sb-ls); }
        }
        .txt { font: var(--font-b3-reg); letter-spacing: var(--font-b3-reg-ls); }
      }
    }
  }
}
```

- **축약어** — 아래는 줄여 쓰고 풀네임(`title` · `text`)을 쓰지 않는다. 표에 없는 단어는 줄이지 않는다 (`con` · `cnt` · `ttl` 같은 임의 축약 금지).

  | 축약 | 뜻 | 축약 | 뜻 |
  | --- | --- | --- | --- |
  | `tit` | 제목 (title) | `txt` | 본문 · 설명 글 (text) — 기본 |
  | `desc` | 설명 (description) — `txt` 와 따로 구분해야 할 때만 | `thumb` | 썸네일 |
  | `btn` | 버튼 | `img` | 이미지 틀 |
  | `wrap` | 묶음 (`tit-wrap`) | `num` | 숫자 |
  | `cont` | 내용 묶음 (content — `.qa-cont`) | | |

- **역할 이름은 사이트 전체에서 같은 뜻**이다 — 제목은 어디서나 `.tit`, 썸네일은 `.thumb`. 부품마다 `.name` · `.heading` 처럼 바꾸지 않는다.
- **같은 루트 안에서 역할이 둘이면 두 단어**로 구분한다 — `.depth1-link` / `.depth2-link`, `.tit-wrap` / `.tit`. 역할이 하나뿐이면 한 단어.
- **목록은 언제나 `{내용}-list` 두 단어** — `.list` 한 단어로 쓰지 않는다 (목록이 하나뿐이어도). 페이지 · 부품마다 `.list` 가 생기면 어느 목록인지 이름으로 알 수 없고, 목록 안에 다른 목록이 들어오면 바깥 `.list` 스타일이 안쪽에도 닿는다. 무엇이 담겼는지로 — 패밀리사이트 `.family-list` · 뉴스 `.news-list` · 사업 소개 `.business-list` · 장비 이름 `.txt-list`, `.thumb-gallery` 의 큰 사진 `.img-list` · 썸네일 `.thumb-list`. 복수형(`.thumbs`)으로 짓지 않는다 — `.thumb` 과 한 글자 차이라 읽기 · 검색이 섞인다. **예외 — 탭 버튼 묶음은 `.tabs`** (`.tabs[role="tablist"] > .tab`, 탭 스와이퍼일 때만 바깥 상자 `.tab-wrap`). 목록(`<ul>`)이 아니라 버튼 묶음이고, 탭이 다른 부품 안(카드 슬라이더 툴바 등)에 들어가도 그 부품의 목록과 섞이지 않게 고유 이름을 쓴다.
- **목록 항목은 `{목록}-item` — 자식 이름의 접두어 예외.** 항목(`<li>` · 항목 묶음 `<div>`)을 `.item` 한 단어로 쓰지 않는다. 항목 안에는 다른 목록이 자주 들어와서(FAQ 답변 속 첨부 `.file-list`, 카드 속 정보 목록) `.item` 이면 바깥 목록의 `.faq-list .item { border-bottom }` 이 안쪽 목록의 항목에도 닿는다. 이름은 목록 루트에서 `-list` 를 떼고 `-item` 을 붙인다 — `.faq-list .faq-item` · `.file-list .file-item` · `.step-list .step-item` · `.thumb-list .thumb-item`. 목록이 루트 안의 `.list-body` 면 그 루트 이름으로(`.board-list .list-body .board-item`), 루트가 `-list` 로 끝나지 않으면 루트 이름 그대로(`.grid-visual .grid-visual-item`). 동작이 붙는 항목은 부품 항목 이름과 동작 이름을 같이 준다 — 아코디언 `<li class="faq-item accordion-item">`. 항목 안의 다른 자식(`.tit` · `.link`)은 지금처럼 접두어 없이. 새 목록을 만들거나 항목을 고칠 때 `class="item"` 이 남아 있으면 같이 바꾼다. **항목이 버튼 하나뿐이면** `<li>` 로 감싸지 않고 버튼이 곧 항목이다 — 이름은 `-item` 이 아니라 버튼 규칙대로 `{이름}-btn` (`.spot-list .spot-btn` — 묶음은 `<div>`, 항목별 값은 버튼의 `data-*`).
- **슬라이드 · 스와이퍼는 넘어가는 내용으로 이름 짓는다** — `.slider` · `.slide-list` · `.slide-item` 처럼 동작 이름만으로 짓지 않는다 (한 페이지에 여럿이면 어느 것인지 이름으로 알 수 없고 검색도 섞인다). Swiper 를 붙이는(또는 장을 넘기는) 상자는 `{내용}-swiper`, 목록 · 항목은 `{내용}-list` · `{내용}-item` — `.hero-swiper > .hero-list > .hero-item` · `.photo-swiper > .photo-list > .photo-item`. 이미 이름이 있는 목록에 스와이퍼만 얹으면 목록 · 항목 이름은 그대로 두고 상자만 `{내용}-swiper` 로 (`.field-swiper > .field-list.accordion`). Swiper 옵션 `wrapperClass` · `slideClass` 에 그 목록 · 항목 이름을 준다. 이전 · 다음 · 인디케이터 묶음은 `.slide-nav`.
- **`-wrap` 은 루트 안의 묶음 자식에만** 붙인다 (`.card-list .tit-wrap`). 루트는 이름 자체가 묶음이라 `-wrap` 을 붙이지 않는다 — `.sec-head` · `.sec-txt` (`.sec-txt-wrap` X).
- **태그 이름을 클래스로 쓰지 않는다** — `head` · `body` · `foot` · `main` · `header` · `footer` · `nav` · `section` · `article` 등 (`nav` 한 단어 X → 슬라이더 이전 · 다음 버튼 묶음은 `.slide-nav`). **예외 — 푸터 조각 루트 `.footer`**(헤더는 `.gnb`). `.head` 는 `<head>`, `.body` 는 `<body>`, `.main` 은 `<main>`, `.foot` 은 `<tfoot>` · `<footer>` 와 읽을 때 헷갈리고 검색에도 섞인다. **금지는 태그와 똑같은 한 단어뿐이다** — 다른 단어와 붙인 `-head` · `-body` · `-foot` 두 단어는 된다 (`.modal-foot` · `.page-foot` · 입력 표 칸 `.head-cell` · `.body-cell`). 머리 묶음은 루트 접두어 두 단어(`.post-head` · `.sec-head`), 아코디언 항목(`.accordion-item`)의 머리(여닫기 버튼 `button.toggle-btn`)는 `.accordion-head` — heading 이 필요하면 `<h3>` 로 감싸고 클래스는 버튼에, 펼치는 패널은 `.accordion-panel` — `.accordion-item` 의 짝 이름으로 쓴다. 카드 안 글 · 라벨 · 날짜를 담는 묶음은 `.txt-wrap`, 아코디언 패널 안쪽 감싸기는 `.panel-inner`. 모달은 딤 층 `.modal` 안의 창이 `.modal-box`, 그 안이 머리 `.modal-head` · 내용 `.modal-body` · 아래 `.modal-foot`(버튼 묶음 등) — 창을 `.box` 처럼 한 단어로 두면 어느 부품의 상자인지 알 수 없다. 모달 스크롤 본문은 `.scroll-box`.
- **버튼은 `{이름}-btn`** — 버튼(`<button>` · 버튼 역할 `<a>`)은 하는 일 이름 뒤에 `-btn` 을 붙인다: 닫기 `.close-btn` · 더보기 `.more-btn` · 복사 `.copy-btn` · 여닫기(아코디언 · 드롭다운) `.toggle-btn` · 전체메뉴(PC 팝업 · MO 햄버거) `.menu-btn`. 한 단어(`.close`)로 두면 버튼인지 이름만 보고 알 수 없고, 상태 · 동작 이름(`close` · `open`)과 검색이 섞인다. 버튼 부품 루트도 같은 꼴(`.basic-btn` · `.text-btn`)이고, 자식 버튼에도 루트 접두어는 반복하지 않는다 (`.modal .close-btn`).
- **단독 아이콘은 `{이름}-icon` 공통 클래스** — 글 · 표 칸에 아이콘만 놓는 표시용 아이콘(버튼 · 링크가 아닌 것)은 페이지 프리픽스(`.org-mail-icon` X)를 붙이지 않고 아이콘 이름 뒤에 `-icon` 을 붙여 `components/_icon.scss` 에 둔다 — `.mail-icon` · `.phone-icon`. 어느 페이지에서나 같은 클래스로 쓴다. 이름은 이미지 파일 `icon-{의미}-{크기}` 의 의미 부분(크기 · 색은 이름에 넣지 않는다 — 다른 크기 · 색은 변형 `.mail-icon-small`). 마크업은 `<span class="mail-icon" role="img" aria-label="뜻">` (장식이면 `aria-hidden="true"`). 버튼 · 링크 안의 아이콘은 `_icon.scss` 에 두지 않는다 — 아이콘 전용 버튼(`.search-btn`)은 그 부품이 `::before` 로 그리고, 글자 + 아이콘 버튼(`.basic-btn`)은 변형 클래스 대신 버튼 안에 `<i class="next-icon" aria-hidden="true"></i>` 를 넣은 자리(글자 앞 · 뒤)에 보이게 한다 — 스타일은 그 버튼 부품 파일의 루트 아래 자손으로. 새로 만들기 전에 `_icon.scss` 에 같은 아이콘이 있는지 본다.
- **사진 자식 — `.visual` 과 `.bg`.** 사진 · 영상만으로 이루어진 블록(KV 사진 · 조감도 · 사진 블록)은 `.visual`, **글 · 버튼 같은 내용이 위에 올라가고 그 뒤에 깔리는** 사진 · 영상은 `.bg` 로 짓는다 — 히어로 슬라이드 `<div class="bg"><video></video></div>` + `.txt-wrap`, 칸마다 바뀌는 배경 `.bg-wrap > .bg.is-active`. 배경이 여러 장이면 묶음은 `.bg-wrap`(`.bg .bg` 로 겹치지 않게). 이미지 파일 접두어 `bg-` 와 같은 뜻이다 (`assets.md`). **클래스는 감싸는 `<div>` 에 주고 `<img>` · `<video>` 는 클래스 없이 그 안에 둔다** — `<div class="bg"><img src="…" alt=""></div>` · `<div class="visual"><img …></div>` (`<img class="bg">` · `<video class="bg">` X). 사진 ↔ 영상을 바꿔도 틀 · 자르기 · 딤 스타일이 그대로고, CSS 는 `.bg img` · `.bg video` 로 채운다 (아래 「컴포넌트 작성 규칙」 2 의 대체 요소 예외).
- **다른 뜻으로 읽히는 이름을 피한다** — `copy`(복사 기능 · `.copy-btn` 과 헷갈림), 글만 오는 자리의 `content`(본문 전체로 읽히고 `#content` 와 겹침). 글 영역은 `txt` 계열로.
- **공통 속성 클래스 — `{속성}-{값}`.** 어느 부품에 붙여도 뜻이 하나인 정렬 · 자리 · 고정은 부품 변형(`{루트}-{변형어}`)으로 만들지 않고 공통 속성 클래스로 `common/_utilities.scss` 에 둔다 — 글자 정렬 `.txt-left` · `.txt-center` · `.txt-right`, 자리 `.pos-end`(부모 오른쪽 끝에 붙이기 — 폭은 블록이 갖는다: `.sec-txt.pos-end` 처럼 블록이 오른쪽 칸 폭을 준다), 고정 `.pos-sticky`(스크롤하면 헤더 아래에 붙음), 꽉 찬 이미지 `.img-full`(`<img>` 에 — 부모 폭 100% · 원본 비율), 가로 배치 `.flex-start` · `.flex-center` · `.flex-end` · `.flex-between`(감싸는 블록에 — 자식을 한 줄로 왼쪽 · 가운데 · 오른쪽 · 양끝), 세로 정렬 `.align-start` · `.align-center` · `.align-end`(flex · grid 블록에 — 자식 위 · 가운데 · 아래 끝 맞춤). 둘을 같이 붙여 쓴다 — `.flex-between.align-end`(제목 + 더보기 버튼). 접두어는 바꾸는 속성(`txt-` 글자 · `pos-` 놓는 자리 · 고정 · `img-` 이미지 크기 · `flex-` 자식 배치 · `align-` 자식 세로 정렬). 부품 하나에만 의미가 있는 크기 · 종류 · 모양 · 배치는 그대로 변형 클래스(`.basic-btn-large` · `.sec-head-side` · 제목 단계 `.sec-head-medium`(h3)). 값은 이름에 넣지 않는다(`.w-700` X). 공통 클래스는 속성 하나만 바꾸고, 블록마다 달라지는 값(폭 등)은 그 블록이 `&.pos-end` 처럼 받아서 준다. **`_utilities.scss` 의 공통 클래스는 킷 기본 세트라 프로젝트마다 그대로 가져가고, 그 프로젝트에서 안 쓰여도 지우지 않는다** (`audit.js` ① 은 「공통 유틸」로 따로 보여 준다 — 정리 대상 아님).
- **CSS 선택자는 마크업 경로 그대로다** — 루트부터 대상까지 클래스가 있는 조상을 모두 거친다 (`.card-list .card-item .link .txt-wrap .tit`). SCSS 에서 마크업 모양대로 중첩해 쓰므로 출력 선택자가 길어져도 된다 — 작성법은 `css-rules.md` 「SCSS 작성 규칙」. 상태 · 가상 요소는 그 요소 뒤에 (`.tabs .tab.is-active`).
- **안에 다른 부품이 들어오는 자리**(`.panel` · 모달 본문 `.scroll-box`)는 바깥의 `.card-list .tit` 가 안쪽 부품의 `.tit` 에도 닿을 수 있다. 안쪽 부품은 자기 `.tit` 를 자기 루트로 다시 선언하므로(같은 특이도면 뒤에 선언된 것이 이김) `components/` 에서 **담는 부품을 앞에, 담기는 부품을 뒤에** 둔다. 그래도 겹치면 안쪽 역할에 두 단어 이름을 준다.
- **같은 루트 안에 같은 역할 이름을 두 자리에 두지 않는다.** `.page-head .txt`(설명) 를 쓰는데 제목 안 글자 감싸기에도 `.txt` 를 주면 `<h1 class="tit"><span class="txt">` 에 설명의 글자 · 색이 묻는다. 스타일이 없는 감싸기(모션 `<span data-motion>` 등)는 클래스를 주지 않고, 필요하면 두 단어로 구분한다. 역할 이름을 새로 붙이거나 바꿀 때는 그 루트 안에 같은 이름이 이미 있는지 먼저 찾는다.
- JS 도 루트에서 찾는다 — `$gnb.find(".menu-btn")`, 위임은 `$list.on("click", ".toggle-btn", …)`. 역할 이름이 안쪽 부품에도 있을 수 있는 항목 · 패널은 `closest()` 로 자기 루트 것인지 확인한다 (`common.js` 「아코디언」).
- 페이지 전용 블록도 같다 — 페이지 프리픽스는 루트에만 (`.srch-hero .tit`), 자식에 프리픽스를 반복하지 않는다 (`css-architecture.md` 「페이지 프리픽스」).

### 상태 클래스 — 독립 클래스로 붙인다

JS 가 토글하거나 개발이 데이터에 따라 붙이는 상태는 컴포넌트명과 합치지 않고 **`is-` 로 시작하는 공용 클래스를 덧붙인다.** 접두어만 보고 루트(`.card-list`) · 모양(`.card-list-fill`) · 자식(`.tit`) · 상태(`.is-active`) · 진입 모션 대상(`[data-motion]` 속성)이 구분되고, 같은 폴더에 섞이는 기존 CSS 의 `.active` · `.on` 규칙이 묻어 들어오지 않는다. 아래 목록 밖의 이름을 새로 만들지 않는다.

| 클래스 | 용도 |
| --- | --- |
| `.is-active` | 선택됨 · 현재 (탭, 메뉴, 페이지 번호, 고정 게시물) — 가장 많이 쓰임 |
| `.is-open` | 열림 · 펼침 (GNB, 아코디언, 팝업, 토글) |
| `.is-disabled` | 누를 수 없음 · 마감 — `disabled` 속성이 없는 `<a>` 에만 쓴다. `href` 를 빼고 `role="link"` + `aria-disabled="true"` 를 함께 붙인다 (href 없는 `<a>` 는 링크로 읽히지 않고 aria-label 도 무시된다). `<button>` · 폼 요소는 클래스 대신 `disabled` 속성 + `:disabled` |
| `.is-fixed` | 고정 · 스크롤 잠금 (헤더, 탭, 패널이 열린 body) |
| `.is-scrolled` | 페이지가 맨 위가 아님 (투명 헤더 → 기본 헤더 등). 화면에 붙는 `.is-fixed` 와 구분한다 |
| `.is-hidden` | 모션으로 숨김 (스크롤 시 헤더를 위로). 그냥 감출 때는 클래스 대신 `hidden` 속성 |
| `.is-shown` | 진입 모션으로 떠올라 보임 — `data-motion` 블록에 `common.js`(ScrollTrigger) 만 붙인다. html 에 직접 쓰지 않는다 |

- **진입 모션 대상은 클래스가 아니라 data 속성으로 표시한다** — 떠오를 블록 `data-motion`, 자식을 차례로 띄우는 목록은 부모 `data-motion-group="row"`(제목 묶음은 `each` — 자식 표기 없음). 상태만 `.is-shown`. 규칙은 `javascript.md` 「모션」.
- 변형 클래스와 섞지 않는다 — `.label-chip-disabled` 는 라벨의 **색 변형**(늘 그 모양), `.is-disabled` 는 **상태**(데이터에 따라 붙었다 떨어짐)다.

```css
.tabs .tab.is-active { }
.gnb.is-scrolled { }
.accordion .accordion-item.is-open { }
```

```js
/* 아코디언 — 상태 클래스와 ARIA 를 같이 바꾼다 (§12) */
item.classList.toggle("is-open", open);
btn.setAttribute("aria-expanded", String(open));
```

### 공통화 규칙

1. 레이아웃 유틸리티는 별도로 두지 않는다 — 컴포넌트 기반 클래스를 사용한다.
2. 같은 컴포넌트가 여러 페이지에 등장하면 동일한 이름을 유지한다.
3. 페이지 고유 섹션은 기능 기반으로 이름 짓는다. 예: `.history-intro`(O) vs `.page-cor-03-intro`(X)
4. **기존 클래스명과 겹치지 않는지 먼저 확인한다.** 신규 컴포넌트를 만들기 전에 기존 스타일 폴더를 검색해 같은 이름이 있는지 본다.
   ```bash
   grep -rn "\.gnb\b" <기존 CSS/SCSS 폴더>
   ```

### 컴포넌트 작성 규칙 — 어느 페이지에 넣어도 동작해야 한다

`components/` 에 올라가는 것은 **독립 부품**이다. 아래를 지키지 않으면 다른 페이지에서 재사용할 때 깨진다.

1. **같은 디자인은 같은 마크업·같은 클래스.** 페이지마다 `<div>`/`<section>`/`<ul>` 을 바꿔 쓰거나 클래스를 새로 짓지 않는다. 가이드(`html/worklist/guide/list/`)의 `.sample` 마크업이나 먼저 만든 페이지의 마크업을 **그대로 복사**한다. 태그가 달라지면 CSS 가 두 벌이 되고 개발팀의 공통 템플릿이 불가능해진다.
2. **루트 클래스 하나로 시작한다.** 컴포넌트는 `.card-list` 처럼 루트 클래스에서 시작하고, 안쪽 요소는 역할 이름(`.tit` · `.txt` · `.thumb`)으로 짓고 CSS 는 루트 아래 자손 선택자로 쓴다 (위 「자식 이름」). 루트만 옮기면 통째로 옮겨진다.
   **자식은 태그가 아니라 클래스로 잡는다.** `.info-list dt` · `.card p` 처럼 태그 이름으로 스타일하지 않는다 — 개발이 `<dt>` 를 `<p>` 로, `<p>` 를 `<span>` 으로 바꾸거나 같은 태그가 하나 더 들어오면 스타일이 빠지거나 엉뚱한 데 묻는다. 스타일이 걸리는 요소에는 역할 클래스를 준다 — `<dt class="tit">` · `<dd class="txt">`, CSS 는 `.info-list .tit` · `.info-list .txt`. 예외는 클래스를 붙일 수 없는 관리자 에디터 본문(`.editor p`), 태그가 바뀔 일이 없는 대체 요소(`.thumb img` · `.bg img` · `.bg video` · `.visual img`), **표의 칸(`.data-table th` · `.data-table td`)**뿐이다 — 표 칸은 `th` · `td` 말고 다른 태그가 올 수 없고, 개발이 행마다 출력하는 칸에 클래스를 붙이지 않아도 되게 칸 태그로 잡는다 — 칸마다 다른 정렬은 공통 정렬 클래스(`.txt-left` · `.txt-center` · `.txt-right`, `common/_utilities`)를 그 칸에 더한다.
3. **바깥 여백을 갖지 않는다.** 컴포넌트 루트에 `margin` 을 주지 않는다. 컴포넌트 사이 간격은 감싸는 컨테이너의 `gap`/`padding` 이 담당한다 (css-rules.md 「여백 책임」). 그래야 목록·상세·메인 어디에 넣어도 간격이 맞다.
4. **폭은 부모 기준이다.** 루트에 고정 `width` 를 두지 않고 `width: 100%` 또는 콘텐츠 폭(hug)으로 둔다. 고정폭이 필요하면 변형 클래스(`.basic-btn-fixed`)로 분리한다.
5. **부모 선택자에 의존하지 않는다.** `.news-list .basic-btn { }` 처럼 페이지 스코프 안에서 공통 컴포넌트를 덮어쓰지 않는다. 다른 모양이 필요하면 변형 클래스를 만든다 (아래).
6. **자식 결합자(`>`)를 쓰지 않는다.** 개발팀이 서버 템플릿 연동 중 반복·조건용으로 태그를 한 번 더 감싸면 (Thymeleaf `th:each` · `th:if` 등) `.input-group > *` · `.board > .pagination` 은 바로 깨진다. 대상에 **클래스를 지정해 자손 선택자**로 쓴다 — `.input-group .select`, `.board .pagination`. `*` 로 자식 전체를 잡지 않고 받을 컴포넌트를 클래스로 나열한다. 같은 컴포넌트가 중첩될 수 있어 자손 선택자로 안쪽까지 잡히는 경우는 하위 요소에 클래스를 하나 더 주어 해결하고, 그래도 `>` 가 필요하면 주석으로 사유를 적는다. (가이드 문서 `guide.css` 는 개발팀에 넘기지 않으므로 예외)
   **형제 결합자(`+` · `~`)와 순서 가상 클래스(`:first-child` · `:last-child` · `:nth-child` · `:nth-of-type` · `:only-child`)도 같은 이유로 다른 방법이 먼저다** — 개발이 임의로 태그를 감싸거나 마크업 위치를 바꾸면 깨질 수 있다. 필요하면 쓰되 **형제 결합자는 `+` 대신 `~`** 를 쓴다 — 사이에 태그가 하나 끼어도 걸린다. 첫 · 마지막 항목만 다른 여백은 컨테이너 `padding` + `gap` 으로 설계해 예외 항목이 없게 하고, 첫 · 마지막 항목만 다른 모양은 그 항목에 변형 클래스를 주고 개발이 반복문의 첫 · 끝 조건으로 붙이게 `@` 주석으로 넘긴다. 아래 표의 「유지」 · 진입 모션 순차 지연처럼 필요한 곳에는 쓴다. 목적별 기준:

   | 목적 | 쓰는 방법 | 예 |
   | --- | --- | --- |
   | 블록 사이 간격 | 간격이 하나면 부모 `gap`, 다르면 **앞 요소 자신의 `margin-bottom`** (그 요소가 빠지면 간격도 빠진다). 컴포넌트 루트라 바깥 여백을 못 가지면 아래 `:has()` | `.board-info { margin-bottom: 40rem }` |
   | 다른 컴포넌트가 있을 때만 생기는 여백 | `:has()` 로 조건을 건다 — 템플릿에 항상 있는 `body` · `main` 기준 | `main:has(.toolbar) .board { margin-top: 80rem }`, `body:has(.gnb) main { padding-top }` |
   | 같은 클래스 반복 항목 사이 구분선 | `~` 유지 — 반복은 개발팀이 서버 템플릿 반복을 항목 자체에 걸고, 감쌀 태그가 필요하면 출력되지 않는 태그(`th:block` 등)를 쓴다. `:not(:first-child)` 도 형제 관계라 대안이 아니다 | `.info-list .info-item ~ .info-item::before` |
   | 관리자 에디터 본문 | 간격을 CSS 로 주지 않는다 — 관리자가 넣은 빈 줄(`<br>`)이 간격. 개발팀이 손대지 않는 HTML 이라 서식 복원만 태그 선택자로 | `.editor p` (간격 없음) |

   `.board-info + *` 처럼 **`+ *` 로 다음 아무 요소나 잡지 않는다.**
7. **내용이 바뀌어도 버틴다.** 텍스트가 2배, 항목이 1개 또는 10개, 이미지 없음, 뱃지 없음 — 전부 깨지지 않아야 한다 (「설계 원칙 — 공통 템플릿 우선」).
8. **UI 부품은 첫 등장부터 `components/` + 가이드.** 버튼 · 폼 · 라벨 · 카드 · 탭 · 목록처럼 이후 화면에도 나올 부품은 두 번째 등장을 기다리지 않고 처음부터 `components/_부품.scss` 에 쓰고 가이드(`guide/list/`)에 올린다 — 이후에 나올 페이지를 대비해 공통화 · 컴포넌트화 · 가이드화 · 모듈화를 먼저 한다. `components/_style.scss` 의 페이지 구획에는 그 화면에만 있는 **디자인**만 남긴다. 거기 두었던 것이 두 번째 페이지에서 쓰이면 그 순간 `components/_부품.scss` 로 옮기고 가이드 승격 후보로 보고한다.

### 변형 클래스 — 같은 디자인, 다른 색·크기·폭

같은 구조에서 **색·크기·폭·강조만 다르면 새 컴포넌트가 아니라 변형 클래스**다. 베이스가 구조를, 변형이 토큰값만 바꾼다.

```html
<!-- 베이스 + 변형 -->
<a class="basic-btn basic-btn-primary">신청하기</a>
<a class="basic-btn basic-btn-outlined">목록</a>
<a class="basic-btn basic-btn-primary basic-btn-fixed">신청하기</a>
<span class="label-chip label-chip-bg1">NEW</span>
<span class="label-chip label-chip-bg2">마감</span>   <!-- 색만 다르면 변형 클래스 — 상태 이름(.point 등)을 새로 만들지 않는다 -->
```

```css
/* 베이스 — 구조 */
.basic-btn { display: inline-flex; height: 56rem; padding: 0 24rem; border-radius: 8rem; }
/* 변형 — 토큰값만 */
.basic-btn-primary  { color: var(--color-{버튼 주색 글자}); background: var(--color-{버튼 주색}); }
.basic-btn-outlined { color: var(--color-{버튼 외곽선 글자}); background: var(--color-{버튼 외곽선 면}); border: 1px solid var(--color-{버튼 외곽선 테두리}); }
.basic-btn-fixed    { width: 320rem; }
```

- 변형 클래스는 **베이스 이름을 접두어로** 짓는다 (`.basic-btn-*`, `.label-chip-*`, `.card-list-*`). 색 이름(`.basic-btn-blue` · `.label-chip-gold`)이 아니라 역할 이름(`.basic-btn-primary`)으로 짓는다 — 색이 바뀌어도 마크업을 안 건드린다. **역할로 부를 수 없는 색 목록**(라벨 색 · 상자 면색처럼 고르기만 하는 것)은 **`-bg{번호}`** 로 짓는다 — `.label-chip-bg1` · `.info-box-bg1`. 번호 ↔ 토큰 색은 SCSS 한 곳(map · 주석)과 가이드에만 적는다.
- 변형 안에서는 **구조 속성(display·padding·height)을 다시 쓰지 않는다.** 구조가 달라지면 그건 변형이 아니라 다른 컴포넌트다 — 단 **마크업이 같고 배치만 다르면** 아래 「모양 클래스」다.
- 변형끼리 조합이 가능해야 한다 (`.basic-btn-primary.basic-btn-fixed`). 조합이 안 되는 변형이 생기면 설계를 다시 본다.
- 시안에 새 색 조합이 나오면 CSS 를 복사하지 말고 **변형 클래스 하나를 추가**하고 가이드 페이지에 올린다.

### 모양 클래스 — 같은 마크업, 부모 클래스 하나로 디자인 교체

카드 목록처럼 **담는 데이터(썸네일 · 제목 · 요약 · 날짜 · 태그)는 같은데 화면마다 모양이 다른** 반복 목록은 컴포넌트를 화면 수만큼 만들지 않는다. **마크업 한 벌 + 맨 위 부모의 모양 클래스**로 나눈다. 시안이 바뀌어 A 화면을 B 모양으로 바꿔야 할 때 클래스 하나만 고치면 되고, 개발 템플릿도 하나로 끝난다.

```html
<ul class="card-list card-list-fill">   <!-- 모양 -fill / -line / -plain / -row 중 하나 + 더하기(-tall 등) -->
  <li class="card-item">
    <a class="link" href="…">
      <span class="thumb"><img src="…" alt=""></span>
      <span class="txt-wrap">
        <strong class="tit">…</strong>
        <span class="txt">…</span>
        <time class="date" datetime="…">…</time>
      </span>
    </a>
    <ul class="tag-list">…</ul>   <!-- 다른 부품(루트) — 자기 이름 -->
  </li>
</ul>
```

```scss
/* 베이스 — 자식의 공통 글자 · 썸네일 비율. 모양 없음 */
.card-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 80rem 16rem;

  .card-item {
    .link {
      .txt-wrap {
        .tit { font: var(--font-h6-sb); letter-spacing: var(--font-h6-sb-ls); }
      }
    }
  }
}
/* 모양 — 부모 클래스 아래에서 자식의 박스 · 간격 · 열 수를 정한다. 경로는 베이스와 같은 깊이로 */
.card-list-fill {
  grid-template-columns: repeat(4, 1fr);
  gap: 16rem;

  .card-item {
    .link {
      background: var(--color-{카드 면});
      border-radius: 12rem;

      .txt-wrap { padding: 32rem; }
    }
  }
}
.card-list-plain {
  .card-item {
    .link {
      .thumb {
        margin-bottom: 24rem;
        border-radius: 16rem;
      }
    }
  }
}
```

- **모양 이름은 용도가 아니라 형태로 짓는다** — `-fill`(채움 박스) · `-line`(테두리 박스) · `-plain`(박스 없음) · `-row`(가로 한 줄, 썸네일 옆). `-recruit` · `-media` 처럼 화면 이름으로 지으면 다른 화면으로 옮기는 순간 이름이 거짓이 된다.
- **모양은 하나, 더하기 클래스는 여럿.** 모양 클래스는 부모에 하나만 붙인다. 모양과 상관없이 한 가지만 바꾸는 것(썸네일 비율 등)은 **더하기 클래스**로 따로 두고 어느 모양에나 붙인다 — `card-list card-list-plain card-list-tall`(썸네일을 높게). 더하기 클래스는 CSS 에서 모양 클래스 뒤에 둔다.
- 두 화면의 차이가 **자식이 있고 없고**(분류 · 이름 · 태그)와 더하기 한 가지뿐이면 새 모양을 만들지 않는다. 뉴스 목록(제목 · 날짜 · 태그)과 인물 소개 목록(분류 · 제목 · 이름 + 높은 썸네일)은 같은 `-plain` 이다.
- 자식 클래스는 **모든 모양에서 같은 이름**을 쓴다. 모양마다 `.tit` · `.name` 처럼 이름을 바꾸지 않는다. 기간 · 날짜처럼 뜻이 다르면 클래스는 나누되 베이스 글자를 같게 둔다.
- **자식은 있는 것만 넣는다.** 썸네일 · 라벨 · 요약이 없어도 깨지지 않게 간격을 자식의 margin/gap 으로 준다 (빈 요소를 남기지 않는다). 썸네일 자리를 미리 비워 두는 모양(`-row` 의 오른쪽 칸)은 `:not(:has(.thumb))` 로 그 자리를 거둔다.
- 자식 순서는 모든 모양에서 같다 — 썸네일 → 본문(라벨 · 분류 · 제목 · 요약 · 날짜/기간 · 부가 정보) → 링크 밖 태그. 썸네일을 옆에 놓는 모양도 마크업 순서는 바꾸지 않고 CSS 로 자리를 옮긴다.
- 박스의 안쪽 여백은 `.txt-wrap` 이 갖는다 — 썸네일은 박스 끝까지 꽉 차고, 썸네일이 없는 모양으로 바꿔도 여백이 그대로다.
- 모양 클래스는 **구조(박스 · 패딩 · 열 수)를 바꿔도 된다** — 변형 클래스와 다른 점이다. 대신 마크업을 모양마다 다르게 요구하면 모양 클래스가 아니라 다른 컴포넌트다.
- `.card-list-fill .card-item .link` 는 같은 컴포넌트 안의 자손 선택자라 「부모 선택자에 의존하지 않는다」(페이지 스코프 덮어쓰기)에 걸리지 않는다.
- 상태(`.is-active` · `.is-disabled`)와 hover 는 그 모양에 시안이 있을 때만 모양 아래에 둔다 (`.card-list-fill .card-item .link.is-disabled`).
- 반응형 열 수는 미디어쿼리에서 베이스(`.card-list`)로 한 번에 줄이고, 모양마다 다른 값만 그 뒤에 덮는다.
