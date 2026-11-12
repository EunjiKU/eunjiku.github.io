# JavaScript 작성 규칙 — publishing 스킬 §12 의 본문

> **언제 여는가** — JS 를 한 줄이라도 쓰거나 고칠 때 연다. 실제 경로·파일명·값은 `CLAUDE.md` 「프로젝트 설정」과 `PROJECT.md` 가 우선한다.

## 12. JavaScript 작성 규칙

정적 HTML 트랙의 JS 는 **화면 모양을 바꾸는 UI 인터랙션**(토글 · 아코디언 · 드롭다운 · 레이어 · 모션)만 한다. 데이터를 다루는 동작(얼럿 · 검증 · 조회 · 저장 · 이동 · 입력값 처리)은 개발이 붙이므로, 퍼블리싱은 그 상태를 정적 마크업과 `@` 주석으로 넘긴다 (아래 「개발 영역」).

### 공통 조각 — 헤더·푸터는 파일 하나로

페이지가 많아지면 GNB 한 줄을 고칠 때 모든 HTML 을 열어야 한다. 그래서 **헤더·푸터 마크업은 `html/header.html` · `footer.html` 한 곳에만 두고**, 페이지에는 빈 태그만 둔다. `common.js` 가 그 자리에 조각을 `$.ajax` 로 불러와 바꿔 넣는다 (별도 include 파일 없음).

```html
<header data-active="menu1"></header>   <!-- header.html 로 치환. data-active = 현재 메뉴 키 -->
<main id="content">…</main>
<footer></footer>                        <!-- footer.html 로 치환 -->

<script src="../common/js/lib/jquery.min.js"></script>
<script src="../common/js/lib/gsap.min.js"></script>
<script src="../common/js/lib/ScrollTrigger.min.js"></script>
<script src="../common/js/common.js"></script>
```

- **조각을 고치면 전 페이지에 반영된다.** 페이지 안에 헤더·푸터 마크업을 다시 쓰지 않는다.
- 현재 메뉴는 `data-active`(1depth) · `data-active-sub`(2depth) 값으로 지정한다. `header.html` 의 링크 `data-menu` 와 매칭해 1depth 는 `.is-active` + `aria-current="true"`(현재 페이지가 속한 구역), 2depth 는 `aria-current="page"`(현재 페이지)를 붙인다 — `page` 는 실제 현재 페이지 링크 하나에만. 키 목록은 `header.html` 상단 주석에 적어 둔다.
- **전체 화면 레이어(MO 전체 메뉴 · 모달)가 열려 있는 동안 바깥에 `inert` 를 건다** — 스킵 링크 · 본문 · 푸터로 Tab 이 새지 않게. 닫으면 걷고 포커스를 연 버튼으로 돌린다. Esc 로 닫을 때 `blur()` 로 포커스를 버리지 않는다 — 포커스는 항상 보이는 요소에 남긴다.
- 내용이 들어 있는 `<header>`·`<footer>` 는 건드리지 않는다 (글 안의 header 등). 빈 태그만 플레이스홀더다.
- **로드 순서 `jquery → gsap · ScrollTrigger → 라이브러리 → common.js → 페이지 JS`.** `common.js` 는 조각을 넣은 뒤 GNB 등을 초기화한다.
- 조각 경로는 `common.js` 「0. 설정」의 `FRAGMENT_DIR`(기본 `../../html/`, `common.js` 위치 기준)이다 — 페이지가 `html/` 아래 몇 단계 폴더에 있어도 같은 조각을 찾고, 조각 안의 상대경로(`src` · `href`)도 조각 파일 기준으로 맞춘다 — 조각은 `html/` 에 있는 그대로의 상대경로로 쓴다. 빈 태그의 `class` 는 조각 루트에 더해지고 `data-active` 같은 속성은 그대로 옮겨진다.
- ajax 라서 **`file://` 로 열면 헤더·푸터가 비어 보인다.** 로컬 서버로 연다.
- 개발 이전 시 `common.js` 의 조각 삽입 부분은 빼고 조각은 서버 템플릿(Thymeleaf `th:replace` 등)의 fragment 로 옮긴다. 조각 파일이 이미 분리돼 있어 그대로 가져가면 된다.

### 파일 구성

- **인라인 `<script>` 를 쓰지 않는다.** 한 줄짜리 토글도 파일로 뺀다.
- **`common.js` 는 프로젝트마다 그대로 복사하는 범용 파일이다.** 프로젝트마다 다른 값(브레이크포인트 · 조각 폴더 · 모션 수치 · 공개 API 이름)은 맨 위 「0. 설정」 상수만 고친다. 모듈은 서로 독립이고 마크업이 없으면 건너뛰므로 그대로 두며, 빼려면 모듈 함수와 「공개 API」 · 「초기화」에서 그 함수를 부르는 줄을 지운다. 새 모듈은 아래 「common.js 모듈 형태」대로 더한다.
- 페이지 전용 스크립트는 `js/[page].js` — 이름은 `components/_style.scss` 의 그 페이지 구획 머리에 적은 화면 영문명과 같게. 2개 이상 페이지에서 쓰는 동작(GNB 토글·아코디언·드롭다운)은 `js/common.js` 에 모은다. 탭 선택에는 JS 가 없다 (「개발 영역」) — 탭 스와이퍼만 `common.js` 모듈이고 기본 `.tabs` 는 넘치면 다음 줄로. 폴더 구조·평면 배치 여부는 「프로젝트 설정」을 따른다.
- 로드는 `</body>` 직전, `jquery` → `gsap` · `ScrollTrigger` → 라이브러리(swiper 등) → `common.js` → 페이지 JS 순서. `defer`·`$(document).ready`·`DOMContentLoaded` 는 쓰지 않는다 — body 끝에서 실행되므로 DOM 은 이미 있다.
- **jQuery(3.x)가 기본이다.** DOM 선택 · 조작 · 이벤트는 `$` 로 쓰고, 브라우저 API(`matchMedia` · `ResizeObserver` · `requestAnimationFrame` · `scrollTo` · `getBoundingClientRect`)는 그대로 쓴다. `scroll` · `resize` 처럼 `{ passive: true }` 가 필요한 이벤트만 네이티브 `addEventListener`. 로드는 `_template.html` 의 로컬 한 줄 `common/js/lib/jquery.min.js`(3.7.1) — CDN 으로 걸지 않는다. **기존 자산에 jQuery 가 이미 있으면 그 버전을 쓰고 두 벌 로드하지 않는다** — 버전과 경로는 「프로젝트 설정」에 적는다. 1.x 라면 `.on` · `.prop` 등 3.x 와 같은 API 만 쓴다.
- **GSAP(3.x) + ScrollTrigger 가 모션 라이브러리다.** `_template.html` 이 jQuery 다음에 로컬 `common/js/lib/gsap.min.js` · `ScrollTrigger.min.js`(3.12.5)로 로드한다 (기존 자산에 GSAP 이 있으면 그 버전 하나만). 새 라이브러리(Swiper 등)도 파일을 `js/lib/` 에 두고 건다. 쓰는 곳과 규칙은 아래 「모션」. 그 밖의 라이브러리는 순수 JS · jQuery · GSAP 으로 대체할 수 없는 것만 쓴다 (Swiper · lottie). jQuery 플러그인(슬라이더 · 모달 플러그인 등)을 끌어오지 않는다 — 공통 부품은 `common.js` 가 직접 만든다.

### 파일 골격

모든 페이지 JS 는 같은 틀로 시작한다. 상단 주석은 **이 파일이 하는 UI 동작 한두 줄**만 적는다 — 화면 ID · 설계서 버전 · 설계서 동작 서술 · 수정 이력은 적지 않는다 (개발은 설계서를 직접 보고, 이력은 git). 이 페이지가 아니면 조용히 끝난다.

```js
/**
 * 본문 더보기 — 버튼이 본문을 펼치고 접는다 (.is-open + aria-expanded)
 */
(function ($) {
  "use strict";

  const $body = $(".news-detail .info");
  const $moreBtn = $(".news-detail .more-btn");

  /* 이 페이지가 아니면 아무것도 하지 않는다 */
  if (!$body.length || !$moreBtn.length) return;

  $moreBtn.on("click", function () {
    const open = !$body.hasClass("is-open");
    $body.toggleClass("is-open", open);
    $(this).attr("aria-expanded", String(open));
  });
})(jQuery);
```

- 즉시실행함수에 `jQuery` 를 `$` 로 넘기고 `"use strict"` 로 감싼다. 전역에 변수·함수를 남기지 않고 `$.fn` 플러그인도 만들지 않는다 — 유일한 예외는 `common.js` 의 공개 API `window.UI` 하나다 (아래).
- 요소 가드(`if (!$el.length) return`)는 생략하지 않는다. `common.js` 는 여러 페이지에서 돌기 때문에 특히 그렇다.
- jQuery 객체 변수는 `$` 접두어(`$gnb`), DOM 요소가 필요하면 `[0]`. `find` · `closest` 결과는 `.first()` 로 하나를 집는다 — 겹친 컴포넌트에서 자손 전부를 잡지 않게.
- 공통 부품을 코드로 열고 닫아야 하면(들어오자마자 뜨는 팝업 등) 클릭을 흉내 내지(`.trigger("click")`) 말고 공개 API 를 부른다 — `UI.modal.open("#modalNotice")`.

### common.js 모듈 형태 — 개발이 가져가 쓰기 쉽게

**작업 순서는 CSS 로 상태부터, JS 는 마지막이다.** 마크업에 상태 클래스 · ARIA 를 손으로 붙여 모든 상태(열림 · 닫힘 · 비활성 · 오류)가 CSS 만으로 그려지는지 먼저 보고, JS 는 그 클래스를 언제 붙이고 뗄지만 쓴다. 동작 옵션은 함수 인자보다 마크업 속성(`aria-controls` · `data-multiple` · `data-motion-group`)으로 받는다 — 개발은 마크업만 복사하면 동작한다.

모듈 하나는 컴포넌트 하나이고, 아래 세 부분으로 쓴다.

| 부분 | 언제 | 하는 일 |
| --- | --- | --- |
| 상태 함수 `setXxx()` · 동작 함수 (모듈 최상단) | 언제든 — 공개 가능 | 클래스 · ARIA · `hidden` 을 바꾸는 곳은 **이 함수 하나**. 클릭 · 키보드 · 공개 API 가 모두 이것을 부른다 (ARIA 가 빠지지 않게) |
| `bindXxx()` | 로드 시 **한 번** | 이벤트를 `document` 에 위임해 건다 — 나중에 그려지는 마크업에서도 동작 |
| `setupXxx($root)` | 로드 시 + **새 마크업마다** | `$root` 안의 새 마크업에 시작 상태를 맞춘다 (아코디언 `hidden` · 스와이퍼 생성 · 모션 등록). 처리한 요소는 `WeakSet` 에 적어 **두 번 불러도 다시 하지 않는다** (값을 매번 다시 읽어야 하는 모듈 — 지우기 버튼 — 은 예외로 매번 맞춘다). `$root` 자신도 포함해 찾는다(`findIn`) |

- 헤더처럼 페이지에 하나뿐인 부품은 `bindXxx()` 안에서 요소를 찾아 직접 걸어도 된다 (GNB).
- 모듈 머리 주석에 **마크업 · 상태 클래스 · CSS 와 맞출 값 · 보내는 이벤트 · 공개 함수**를 적는다 — 개발은 그 주석만 읽고 쓴다.
- 새 모듈의 `setupXxx` 는 「공개 API」의 `init()` 에, `bindXxx` 는 「초기화」에 한 줄씩 더한다. 개발이 코드로 부를 동작이 있으면 상태 함수를 `window.UI` 에 꺼낸다 — **꺼내는 것은 개발이 실제로 부를 것만** (내부 유틸은 숨긴다). 예외는 `UI.util`(`mqMobile` · `reduceMotion` · `remPx` · `setCurrent`) — 페이지 JS(`main.js` 등)는 이것을 받아 쓰고 같은 함수 · 브레이크포인트 값을 다시 만들지 않는다.
- `setupXxx` 가 같은 마크업에 다시 불려도(`UI.init`) 한 번만 처리하게 모듈마다 `WeakSet` 을 두고 `firstSeen(findIn($root, sel), xxxSeen).each(…)` 로 고른다 — `if (seen.has(this)) return; seen.add(this);` 를 모듈마다 다시 쓰지 않는다.

### 공개 API — `window.UI` · 개발과 만나는 세 곳

퍼블리싱 JS 와 개발 코드는 아래 세 곳에서만 만난다. 이 밖에서 서로의 코드를 고치지 않으면 이관 뒤에도 충돌하지 않는다.

| 접점 | 방향 | 예 |
| --- | --- | --- |
| 공개 API `UI.*` | 개발이 퍼블 동작을 **부른다** | `UI.init("#list")` · `UI.destroy("#list")` · `UI.modal.open("#modalAgree")` · `UI.refresh()` |
| 커스텀 이벤트 `ui:*` | 개발이 퍼블 동작에 **반응한다** | `$(document).on("ui:modal-close", "#modalAgree", fn)` |
| `<!-- @ -->` 주석 | 퍼블이 JS 를 넣지 않은 상태를 개발이 **직접 바꾼다** | 탭 선택 · 비활성 · 오류 상태 (아래 「개발 영역」) |

- 전역은 `window.UI` **하나** — 이름은 `common.js` 「0. 설정」 `API_NAME`. 개발 저장소에 같은 이름의 전역이 있으면 그 상수만 바꾸고 「프로젝트 설정」에 적는다. 객체는 `Object.freeze` 로 잠근다.
- 목록과 인자는 `common.js` 머리 주석 「공개 API」가 원본이다. 인자는 선택자 · 요소 · jQuery 를 모두 받는다.
- **`UI.init(root)`** — 개발이 Ajax 로 영역을 다시 그린 뒤 부른다. root 안의 새 마크업만 초기화하고 모션 시작점을 다시 잰다. 높이만 바뀌었으면 `UI.refresh()`.
- **`UI.destroy(root)`** — 개발이 영역을 지우거나 바꾸기 **전에** 부른다. root 안의 스크롤 트리거(핀은 자리 지킴까지 되돌림) · 스와이퍼 · 열린 모달 · 레이어를 걷어낸다 — 안 부르면 지운 요소의 트리거가 남아 시작점 계산이 틀어진다. 걷어낸 요소는 다시 쓰지 않고, 새로 그린 마크업에 `UI.init(root)`. 새 모듈이 트리거 · 인스턴스를 만들면 `destroy` 에도 걷어내는 줄을 더한다 (`gsap.matchMedia` 는 요소별로 기억해 두고 `revert()`).
- 스크롤 트리거 모듈은 `setupScroll($root)` 한 곳에 나열한다 — `init()` 과 「초기화」가 이것을 부르므로 새 스크롤 모듈은 한 줄만 더한다.
- **HTML 에서 부르지 않는다** — `onclick="UI.modal.open(…)"` 금지. 마크업은 속성(`aria-controls` 등)만으로 동작하게 두고, 코드 호출은 페이지 JS · 개발 코드에서.
- **커스텀 이벤트**는 이름을 `ui:모듈-동작`(`ui:modal-open` · `ui:accordion-close`)으로, 그 컴포넌트 루트(또는 상태가 바뀐 항목 — 아코디언은 `.accordion-item`)에서 `el.dispatchEvent(new CustomEvent(name, { bubbles: true }))` 로 낸다 — jQuery `.on` · `addEventListener` 둘 다 받는다. 시작 상태를 맞출 때(`setupXxx`)는 보내지 않고 클릭 · API 로 상태가 바뀔 때만 보낸다.

### 문법

- `var` 를 쓰지 않는다. 재할당이 없으면 `const`, 필요하면 `let`.
- 이름 있는 함수는 `function` 선언, 콜백은 화살표 함수. 둘을 섞어 써도 되지만 한 파일 안에서 같은 역할은 같은 형태로.
- 이름 머리는 역할대로 — `setupXxx($root)` 는 「새 마크업마다 부르는 입구」에만 쓴다. 요소 하나를 맡는 내부 함수는 `initXxx(el)`, 준비 · 등록을 겸하는 확인 함수는 `ensureXxx()` (`hasXxx` 는 부작용 없는 질의에만). 객체는 축약형(`{ top }`)을 쓰지 않고 `{ top: top }` 으로, 끝 쉼표를 두지 않는다.
- 문서 단위 키 처리(Esc 등)가 바인딩 순서에 기대면 「초기화」의 `bindXxx()` 목록에 그 순서를 주석으로 적는다.
- 문자열은 **큰따옴표**, 문장 끝 세미콜론, 들여쓰기 2칸. 템플릿 리터럴은 변수가 들어갈 때만.
- 문법 수준은 **ES2015(ES6)** 까지. 옵셔널 체이닝(`?.`)·널 병합(`??`)처럼 ES2020 이후 문법은 `PROJECT.md` 「브라우저 지원 범위」에서 허용한 뒤에 쓴다 (기본 매트릭스는 `qa.md`).
- 주석은 한글. 함수 설명은 JSDoc(`/** */`), 한 줄 설명은 `/* */`, 코드 끝 짧은 메모만 `//`.

### DOM 과 상태 — 표현은 CSS 가, JS 는 값만

- **JS 는 클래스와 CSS 변수만 바꾼다.** `el.style.width = ...` 처럼 스타일 속성을 직접 쓰지 않는다. 디자인이 바뀌어도 JS 를 안 건드리게 하기 위해서다. 예외는 CSS 로 표현할 수 없는 계산값(iframe 축소 배율 등)뿐이고, 그때도 가능하면 CSS 변수로 넘긴다.

  ```js
  /* O — 진행률 0~1 만 넘기고, 그리기는 CSS 가 */
  section.style.setProperty("--p", progress.toFixed(4));
  /* X */
  bar.style.width = progress * 100 + "%";
  ```

- 상태 전환은 상태 클래스(목록은 `naming-components.md` 「상태 클래스」, 진입 모션은 아래 「모션」)를 `.toggleClass(name, bool)` 로 바꾼다. 새 상태 이름을 만들지 않는다. CSS 변수는 `el.style.setProperty("--p", v)` 로 — jQuery `.css()` 에 커스텀 속성을 넘기지 않는다.
- **상태 클래스를 바꿀 때 ARIA 도 같이 바꾼다.** 열림·닫힘은 `aria-expanded`(`.attr`), 탭은 `aria-selected`, 숨김 패널은 `hidden` 속성(`.prop("hidden", bool)` — `.attr` 로 `"false"` 문자열을 넣으면 숨겨진다). 클래스만 바꾸면 스크린리더에는 아무 일도 안 일어난다. `.show()` · `.hide()` · `.fadeIn()` 처럼 인라인 `style` 을 쓰는 메서드는 쓰지 않는다 — 표현은 CSS 가 한다.
- JS 가 찾는 요소는 **컴포넌트 클래스 그대로** 쓴다 — 루트에서 역할 이름으로 (`$(".input").find(".submit-btn")`). `js-` 접두사나 `id` 를 따로 붙이지 않는다. 역할 이름이 안쪽 부품에도 있을 수 있는 항목 · 패널은 `closest()` 로 자기 루트 것인지 확인한다. 단 폼 컨트롤은 `label` 연결 때문에 `id` 가 이미 있으므로 그것을 쓴다.
- 목록처럼 반복되는 요소의 이벤트는 **부모에 위임**한다 (`$list.on("click", ".card", fn)` — 핸들러 안의 `this` 가 그 항목). 항목이 나중에 데이터로 바뀌어도 동작한다. 개발이 네이티브 리스너로도 받아야 하는 이벤트(지우기 버튼의 `input` 등)는 `.trigger()` 가 아니라 `el.dispatchEvent(new Event(…, { bubbles: true }))` 로 낸다 — `.trigger()` 는 jQuery 핸들러에만 간다.

### 성능 — 스크롤·리사이즈

- `scroll`·`resize` 핸들러는 `requestAnimationFrame` 으로 묶고 `{ passive: true }` 를 붙인다. 매 이벤트마다 레이아웃을 읽지 않는다. jQuery `.on()` 은 `passive` 옵션이 없으므로 **이 두 이벤트만 네이티브 `addEventListener`** 로 건다.

  ```js
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      update();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  ```

- PC/모바일 분기는 `window.innerWidth` 비교가 아니라 `matchMedia("(max-width: 1024px)")` 로 한다. CSS 브레이크포인트와 같은 값을 쓴다 (§5).
- 요소 크기를 재야 하면 한 번 읽어 변수에 두고 쓴다. 읽기와 쓰기를 번갈아 하지 않는다.

### 모션

- **첫 화면 상태는 CSS 가 갖는다 — JS 가 실행되면서 처음 값을 바꾸지 않는다.** 스크립트는 body 끝이라 받는 동안(첫 진입 · 느린 망 · 렉) 브라우저가 CSS 만으로 화면을 먼저 그린다. JS 가 그때 시작 상태를 걸면 「보임 → 숨김 → 등장」 · 「원래 크기 → 확대 → 원래 크기」처럼 값이 튀어 오류로 보인다(새로고침은 캐시라 재현이 안 된다). 그래서
  - 들어올 때 움직이는 모든 것(진입 모션 · KV 확대 · 히어로 카피 · GNB 등)의 **시작 상태는 CSS 에** — `@include motion`(`_tools.scss` — `@media (prefers-reduced-motion: no-preference)`) 안, 필요하면 `:not(.is-shown)` 으로. JS 는 `.is-shown` 을 붙이거나 `gsap.to` · 시작값을 같은 순간 거는 `fromTo` 로 **끝 상태로 가는 것만**. 첫 화면에 보이는 요소에 `gsap.from` · 시작값용 `gsap.set` 을 쓰지 않는다
  - 모션 줄이기의 최종 상태도 CSS(`@include reduced-motion`)가 — JS 가 `gsap.set` 으로 맞추면 그 전까지 다른 모습이 보인다
  - JS 가 숨김을 풀지 못하는 경로(gsap 없음 · 항목 하나 · 모션 줄이기)마다 `.is-shown` 을 바로 붙인다 — 안 그러면 CSS 숨김이 그대로 남는다
  - 헤더 조각처럼 JS 가 DOM 에 넣는 요소도 시작값은 CSS 에 — 이관하면 서버가 HTML 에 넣어 스크립트보다 먼저 그려진다. 화면 밖에서 스크롤로 시작하는 모션(`scrollTrigger`)도 시작값이 화면에 보이기 전에 걸리므로 해당 없다
  - 확인 — 개발자 도구 Network 「Slow 3G」 또는 캐시 비우기 새로고침(Ctrl+Shift+R)으로 첫 진입을 보고, 값이 한 방향으로만 바뀌는지
- **진입 모션은 공통 한 벌로 쓴다.** 페이지에 들어올 때 블록이 떠오르는 모션(디자이너 요청이 있을 때)은 페이지마다 만들지 않고 `common/_utilities.scss` 의 `[data-motion]` + `common.js` 의 진입 모션 한 벌을 쓴다. 마크업만 바꾼다 — 떠오를 블록(페이지 타이틀 · 툴바 · 목록 · 섹션)에 `data-motion` 속성 (페이지네이션 `.pagination` 에는 붙이지 않는다), 카드처럼 자식을 차례로 띄울 목록은 부모에 `data-motion-group="row"`(위에서 아래로 읽히는 묶음은 `each`) 하나만. 자식에는 아무것도 붙이지 않고(`[data-motion-group] > *` 가 대상), 변형이 필요한 자식만 `data-motion="rise"` 처럼 값을 준다. 클래스는 쓰지 않아 컴포넌트 클래스 목록이 모션 표기로 길어지지 않는다. JS 는 화면에 들어온 블록에 상태 클래스 `.is-shown` 만 붙이고 한 번만 재생한다 — JS 가 넣는 인라인은 묶음 자식의 순번 변수 `--motion-order` 하나뿐이다. 수치(시간 · easing · 거리 · 차례 간격 · zoom 배율)는 `_utilities.scss` 「진입 모션」 맨 위 `:where([data-motion], [data-motion-group])` 의 `--motion-*` 변수 한 곳에만 둔다 — 프로젝트마다 이 몇 줄만 바꾸고, 블록 하나만 다르게 하려면 그 선택자에 같은 변수를 준다(`:where()` 라 특이도 0 — 부품 CSS 가 순서와 상관없이 이긴다).
  - 감지는 GSAP ScrollTrigger — 블록 윗변이 화면의 `top 90%`(기본값 — 프로젝트마다 상수로 바꾼다) 선을 지나면 `onEnter` 로 `.is-shown`, `once: true`. 시작선은 `common.js` 상수 `MOTION_START` 한 곳. 시작 · 끝 오프셋에 `rem` 을 쓰지 않는다 — ScrollTrigger 는 숫자만 읽어 px 로 취급하므로 `%` 선만 쓴다
  - 진입 모션 트리거는 `common.js` 가 **한 프레임(rAF) 뒤**에 만든다 — 같은 턴에 페이지 JS · 공통 모듈이 만드는 핀의 여백을 반영한 레이아웃으로 시작점을 재야, 새로고침(스크롤 복원) 때 핀 아래 블록이 "이미 지난 블록"으로 잘못 켜지지 않는다. 공통 모듈이 만드는 핀(KV 창 확대)은 `setupMotion` 보다 먼저 부른다; 페이지 JS 의 핀은 body 끝에서 동기로 실행되므로 그대로 반영된다
  - **`row` 순번은 같은 프레임 무리(`ScrollTrigger.batch`)만으로 0 부터 다시 매기지 않는다** — 새로고침 때 브라우저는 스크롤을 몇 번에 나눠 복원해(문서 높이가 늘어나는 대로) 한 줄이 여러 무리로 쪼개져 들어온다. 무리마다 0 부터 매기면 늦게 온 아래 자식이 지연 0 으로 위 자식보다 먼저 뜬다. 그래서 묶음마다 「다음 자식이 뜰 수 있는 시각」을 기억해, 앞 무리 차례가 다 시작되기 전에 들어온 무리는 그 뒤로 이어 매긴다(순번은 소수 가능 — 간격은 CSS `--motion-step` 을 읽는다). 등록 때 이미 시작선을 지난 자식도 같은 함수로 순번을 매기고, `.is-shown` 이 붙은 자식은 다시 매기지 않는다(재생 중 지연이 바뀌면 다시 숨었다 뜬다). 확인은 목록 중간에서 새로고침
  - 숨김(`opacity: 0` + `translateY`)은 CSS 가 `[data-motion]` 에 **처음부터** 건다 — JS 가 붙이는 숨김 클래스로 하지 않는다. body 끝 스크립트를 받는 동안 브라우저가 첫 화면을 먼저 그리므로, JS 가 숨기면 첫 진입(캐시 없음) 때 글자가 보였다 사라진 뒤 떠오른다. 대신 JS 가 실패하면 블록이 보이지 않는다 — 헤더 · 푸터 조각도 JS 라 그 경우 페이지 전체가 깨져 바로 드러난다. gsap · ScrollTrigger 를 로드하지 않은 페이지와 `prefers-reduced-motion: reduce` 에서는 `common.js` 가 바로 `.is-shown` 을 붙인다 (html 에 `.is-shown` 을 직접 쓰지 않는다)
  - **변형 · 묶음의 동작과 쓰는 법은 UI 가이드 Motion(`html/worklist/guide/list/motion.html`)이 원본이다** — 기본 · `rise` · `fade` · `zoom` · `custom` · `each` · `row`. 설명을 고칠 때는 가이드만 고치고, 여기에는 고를 때의 규칙만 둔다
    - 여러 개 놓이는 목록(카드 · 단계 · 번호 목록, 세로 1열 포함)은 `row`, 위에서 아래로 읽히는 묶음(페이지 타이틀 · 섹션 제목 · 게시글 머리와 본문)은 `each`. 항목마다 `data-motion` 을 따로 주지 않고, 줄 기준을 잡으려고 목록을 나누지 않는다. 열 수를 값으로 받는 묶음은 두지 않는다 — 부모 하나가 시작점이면 화면 밖 아래 줄까지 한꺼번에 뜬다
    - 차례는 JS 가 자식에 적는 순번 `--motion-order` × `--motion-step` — 지연을 바꾸려면 자식에 `--motion-delay` 를 직접 준다. `each` 는 숨긴 자식(`display: none`)을 순번에서 뺀다
    - 공통 변형으로 안 되는 그 부품만의 모션은 `custom` — 부품 CSS 가 시작 상태(`@include motion` 안)와 `.is-shown`(최종 모습 — 모션 줄이기 · GSAP 없음에서도 바로 붙는다) 둘 다 정의한다. 공통 모션을 부품 CSS 에서 되돌려 덮어쓰지 않는다(`transform: none` · `animation: none` X). 같은 커스텀이 두 번째 부품에 나오면 공통 변형으로 올린다
    - 속성 값은 하나뿐 — `zoom` 블록이 블록째 나타나야 하면 감싸는 요소에 기본 · `fade` 를 따로 준다. `zoom` 과 `data-motion-group` 은 한 요소에 같이 둘 수 있다
    - 핀(`.pin-spacer`)을 품은 블록은 값 없는 `data-motion`(또는 값 없는 묶음 자식)이면 블록 페이드 + `.stage` 안 내용만 떠오르고, `fade` 면 블록째 페이드만
  - 패럴랙스 · 핀처럼 GSAP 이 `transform` 을 직접 움직이는 요소에는 `data-motion` 을 두지 않는다 (transform 충돌) — 그 안쪽 자식이나 감싼 요소에 둔다
  - 에디터 관리 영역(상세 본문)은 `data-motion` 을 **`.post-body` 하나에만** 둔다 — 안에 무엇이 올지 모르므로 제목 · `.editor` 등 안쪽 요소에 나눠 걸지 않는다
  - 진입 모션은 끝난 뒤 `transform` 을 남기지 않는다 — `animation-fill-mode: forwards` 대신 `.is-shown` 에 끝 상태(`opacity: 1` · `transform: none`)를 두고 지연 동안만 `backwards`. 남은 `transform` 은 안의 `position: fixed`(핀 · 고정 KV)의 기준을 그 블록으로 바꿔 핀이 어긋난다. 그래서 `[data-motion]` 블록 안에 핀(`.pin-spacer > .stage`)을 둘 수 있다. 새 변형도 같은 방식으로 쓴다
  - 블록을 새로 그린 뒤 `UI.init(root)` 를 부르면 새 블록만 등록된다. **이미 있는 묶음에 자식을 덧붙인 뒤(더보기 · 무한 스크롤)도 `UI.init(새 자식 또는 묶음)`** — 새 자식만 이어서 등록한다(`each` 는 묶음이 이미 떴으면 새 자식끼리 차례로 바로, `row` 는 새 자식이 줄마다 들어올 때). 부르지 않으면 새 자식은 CSS 숨김 그대로 보이지 않는다. 높이가 바뀌는 동작(탭 · 아코디언 · 늦게 오는 이미지) 뒤에는 `UI.refresh()`
  - 여러 부품에 쓸 새 모션(가로 슬라이드 등)이 필요하면 `data-motion="slide"` 처럼 속성 값으로 변형을 두고 같은 자리에 추가해 가이드 승격 후보로 보고한다. 페이지 CSS 에 `@keyframes` 를 두지 않는다
- **스크롤에 연동되는 모션은 GSAP ScrollTrigger 로 쓴다** — 스크롤 진행에 따라 변하는 값(`scrub`), 핀, 여러 요소를 순서대로 묶는 타임라인. 한 번 떠오르는 진입 모션도 감지만 ScrollTrigger 가 하고 움직임은 위 CSS 가 그린다. jQuery `.animate()` · `setInterval` 모션은 쓰지 않는다. 새 스크롤 모션은 `common.js` 에 모듈 하나(`setupXxx($root)`)로 더하고 — 공통 부품(KV 창 확대 등)은 「콘텐츠」 진입 모션 다음에, 한 화면에만 있는 것(사진 전환 · 패럴랙스 등)은 「서브페이지」에 — 「공개 API」 `init()` 에서 부른다.
  - `gsap.registerPlugin(ScrollTrigger)` 는 `common.js` 에서 한 번. `window.gsap` 이 없으면 조용히 건너뛴다 (로드하지 않은 페이지에서 에러가 나지 않게)
  - 브레이크포인트 · reduceMotion 분기는 `gsap.matchMedia()` 로 — `(max-width: 1024px)` 는 CSS 와 같은 값, `(prefers-reduced-motion: reduce)` 에서는 트윈을 만들지 않고 최종 상태만 둔다
  - 헤더의 진입 모션(GNB 내려오기)은 CSS 가 `.gnb:not(.is-shown)` 을 위로 올려 두고(`@include motion` 안), `introGnb` 가 `.is-shown` 을 붙이며 `fromTo` 로 내린다 — 조각을 넣는 그 턴(`include("header", …)`)과, 서버가 넣은 헤더면 `headerReady.always` 에서. 푸터까지 기다리지 않는다(그동안 헤더가 빈 채 남는다). 헤더 · 푸터 조각이 들어온 뒤 `ScrollTrigger.refresh()` 한 번, 이미지가 늦게 들어오면 `window` `load` 에서 한 번 더 (둘 다 `common.js` 초기화에 있다) — 높이가 바뀌면 시작점이 틀어진다. MO 주소창 높이 변화는 `ScrollTrigger.config({ ignoreMobileResize: true })` 로 무시한다. 블록을 다시 그리면 `UI.destroy(root)` 로 그 트리거를 걷어내고 새 마크업에 `UI.init(root)` (진입 모션은 한 번만 켜지는 트리거라 덧붙인 묶음 자식은 `UI.init` 만으로 된다). **페이지 JS 가 핀을 만든 뒤에는 `ScrollTrigger.refresh()` 가 아니라 `UI.refresh()`** — 트리거는 만든 순서로 재서, 나중에 만든 핀이 끼운 여백을 먼저 만든 진입 모션(핀 아래 블록)이 모른다. `UI.refresh()` 는 문서 순서로 정렬한 뒤 잰다
  - GSAP 이 쓰는 인라인 `transform` · `opacity` 는 「JS 는 클래스 · CSS 변수만」의 허용 예외다. 단 수치(거리 · 시간 · easing)는 모듈 상단 상수 한 곳에, 모양(색 · 크기)은 여전히 CSS
  - 트리거 요소는 컴포넌트 클래스로 찾고, 요소마다 다른 옵션 값(거리 · 속도)만 data 속성으로 받는다
  - **핀(`pin: true`)은 대상을 HTML 에서 `<div class="pin-spacer">` 로 직접 감싸고(바로 위 부모) 핀 옵션에 `pinSpacer: UI.pinSpacer(대상)` 을 넘긴다.** 핀 대상은 섹션 자체가 아니라 안의 무대(`.stage`)이고, **래퍼는 항상 이름 있는 블록 안에** 둔다 — `.visual > .pin-spacer > .stage` 처럼 바깥 블록(`.visual` · `.stage-wrap` 등 그 부품의 클래스)이 자리 · 간격을 갖고, `.stage` 가 틀 모양(크기 · 라운드 · overflow)과 핀을 갖는다. 고유 클래스가 있는 섹션(`.{페이지}-{섹션}`)이면 섹션이 그 블록이라 `<section class="{페이지}-{섹션}"> > .pin-spacer > .stage` 도 된다 — 클래스 없는 요소 바로 아래에 래퍼가 맨몸으로 오지 않게 한다. ScrollTrigger 가 스페이서 `<div>` 를 만들어 대상을 옮겨 담게 두면 초기화 때와 `refresh()` 마다 대상이 DOM 에서 빠졌다 들어가, 안의 `data-motion` CSS 애니메이션은 처음부터 다시 재생되고(깜빡임) video · iframe 은 다시 로드된다. 래퍼에 CSS 를 두지 않는다 — 자리 지킴용 패딩 · 크기는 ScrollTrigger 가 인라인으로 넣는다. 핀을 품은 블록에 `data-motion` 을 주면 공통 CSS 가 블록은 페이드, `.stage` 안의 내용만 떠오르게 한다 — 블록 · 틀의 transform 이 핀 기준을 가로채므로 자손만 움직인다 (재계산 불필요). 안의 내용도 움직이지 않고 블록째 나타나게만 하려면 `data-motion="fade"` — 이 보정은 값 없는 `data-motion` 과 값 없는 묶음 자식에만 걸린다. 섹션 주석에 "핀 자리 지킴 래퍼 — 지우지 않는다" 한 줄
  - **다음 블록이 핀 블록을 덮으며 올라오게** 하려면 핀을 화면 높이만큼 더 이어 두고(`end: () => "+=" + (길이 + window.innerHeight)`, 또는 화면 높이만 멈출 블록은 `pinSpacing: false` 로 `end: "+=innerHeight"`), 덮는 블록에 `position: relative` + `z-index: var(--z-base)` 를 준다 (핀된 요소는 `fixed` 라 그 뒤에 그려진다). 여백을 끼우는 핀이면 덮는 블록을 `margin-top: -100vh` 로 끌어올린다 — `prefers-reduced-motion: no-preference` 안에서만 (핀이 없으면 끌어올리지 않는다). **덮는 블록은 불투명 바탕**이어야 한다 — 투명이면 뒤의 핀 블록이 비친다. 덮이는 무대는 서서히 어두워진다 — 핀 트리거의 `onUpdate` 에서 덮이는 구간의 진행도(0 → 1)를 무대의 CSS 변수 `--cover-dim` 으로 넣고, 모양은 `tools` 의 `cover-dim` 믹스인(`::after` 딤, 색은 인자)이 그린다. 공통 KV 확대 창(`.page-kv-expand`)과 메인 히어로 → About 이 이 패턴
- 애니메이션·부드러운 스크롤을 쓰는 스크립트는 `prefers-reduced-motion: reduce` 를 분기한다. 모션을 끈 사용자에게는 계산을 돌리지 않고 최종 상태를 바로 적용한다. CSS 도 같은 미디어쿼리에서 애니메이션을 끈다.

  ```js
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
  ```

- **캐러셀(슬라이더)** 을 Swiper 로 만들면 `keyboard: { enabled: true }` · `a11y` 를 켜고 이전/다음 버튼 또는 페이지네이션을 둔다. `autoplay` 면 정지 버튼을 함께 만든다 (§8 · `accessibility.md`). 이 옵션들은 Swiper 모듈이라 core(`swiper.min.js`)에는 없다 — 캐러셀이 있는 프로젝트는 모듈이 든 `swiper-bundle.min.js` 를 `js/lib/` 에 둔다.
- Swiper `spaceBetween` 은 px 숫자만 받는다 — 간격을 rem 상수로 두고 `parseFloat(getComputedStyle(document.documentElement).fontSize) * 값` 으로 바꿔 넣고, rem 이 vw 기반이면 `beforeResize` 에서 `swiper.params.spaceBetween` 을 다시 계산한다 (창 폭이 바뀌면 rem 도 바뀐다). 간격을 CSS `margin` 으로 주면 Swiper 의 위치 계산과 어긋난다. **CSS `gap` 도 같다** — Swiper 는 wrapper 의 `gap` 을 계산에 넣지 않아 끝까지 밀리지 않는다. 간격 값은 CSS 변수(탭은 `--tabs-gap`) 한 곳에 두고 JS 가 읽어 `spaceBetween` 으로 넣고, 스와이퍼가 붙은 wrapper 의 `gap` 은 0 으로 둔다 (기본 `.tabs` 는 `gap` 그대로)
- **탭 스와이퍼(`.tabs-swiper`)는 캐러셀이 아니라 예외다** — core 로 충분하고 `a11y` 를 쓰지 않는다(켜면 슬라이드에 `role="group"` 을 덮어써 `role="tab"` 이 사라진다). 탭은 `<button>` 이라 Tab 으로 닿고, 화면 밖 탭은 브라우저가 상자를 스크롤해 보여 준다. **옵션은 필요한 것만** — 기본값과 같은 값(`speed: 300` 등)이나 core 에 없는 모듈 옵션(`a11y` · `keyboard`)을 적지 않는다.
- **슬라이드가 `<button>` 이면 `focusableElements` 에서 `button` 을 뺀다** — 기본값(`input, select, option, textarea, button, video, label`)에 든 요소는 터치로 잡으면 포커스가 가고, 포커스된 요소 위에서 시작한 끌기를 Swiper 가 무시한다. 탭 스와이퍼처럼 슬라이드 전체가 버튼이면 폰에서 아예 안 밀린다. PC 마우스 · 에뮬레이션으로는 재현되지 않는다 — `focusableElements: "input, select, option, textarea, video, label"`
- **swiper.css 를 쓰지 않는 Swiper 는 상자에 `touch-action: pan-y` 를 직접 준다** — swiper.css 가 하던 일이다. 없으면 리셋이 `button` · `a` 에 준 `manipulation` 이 가로 제스처까지 브라우저에 넘겨, 폰에서 끌기가 중간에 끊긴다(`pointercancel`). 탭 스와이퍼 `.tabs-swiper` · 카드 스와이퍼 `.slider` · 사진 슬라이드가 그렇게 한다. PC 마우스 끌기로는 재현되지 않는다.
- **슬라이드 위치로 다른 UI 를 동기화**(앵커 탭 — 누르면 그 묶음의 첫 슬라이드로, 넘기면 맨 왼쪽 슬라이드의 탭이 켜짐)할 때 `slideChange` 만 듣지 않는다 — 이동이 끊기면(연타) Swiper 가 거쳐 가는 인덱스로도 `slideChange` 를 내서 중간 탭이 잠깐 켜진다. 누른 탭은 바로 켜고 이동 중(`moving`)에는 동기화를 멈췄다가 `transitionEnd` 에서 다시 맞춘다 (끝에 걸려 맨 왼쪽에 못 온 묶음도 여기서 바로잡힌다). 손으로 밀기 시작(`touchStart`) · 이전/다음 버튼은 바로 평소 동기화로 돌아간다. 묶음의 슬라이드가 한 화면 수보다 적으면 그 탭은 맨 왼쪽 기준으로 켜질 수 없다 — 완료 보고에 적는다

### 개발 영역 — 퍼블리싱 JS 로 만들지 않는다

- **얼럿 · 컨펌(`AL_001` 등), 입력값 검증, 조회 · 저장 · 이동 요청은 개발 담당이다.** 화면설계서에 정의돼 있어도 `alert()` · 검증 함수 · `request()` 스텁을 만들지 않는다. 퍼블리싱 JS 는 화면 모양을 바꾸는 UI 인터랙션(토글 · 아코디언 · 드롭다운 · 레이어 열고 닫기 · 모션)만 한다. **탭은 선택이 곧 조회라 클릭 이벤트를 넣지 않는다** — 정적 `.is-active` · `aria-selected` 상태만 마크업한다. **입력값을 읽어 화면에 반영하는 것도 개발 몫이다** — 텍스트에어리어 글자 수(`.form-item .info .count`)는 세지 않고 정적 숫자만 둔다. 예외는 값이 있고 없음만 보는 UI 토글(인풋 지우기 버튼 노출)로, 공통 부품이라 `common.js` 가 한다. 같은 이유로 「선택 = 데이터 요청」인 부품(정렬 · 필터 셀렉트 등)에 이벤트를 걸지 않는다.
- 설계서의 동작을 HTML 주석으로 옮겨 적지 않는다 — 개발은 설계서를 직접 본다. 페이지 상단에 화면 ID · 동작 · 공통 부품 설명 주석을 두지 않는다.
- **개발이 바꿀 상태 · ARIA 는 해당 마크업 바로 위 `<!-- @ … -->` 주석으로 적는다** — 탭 선택, 페이지 번호, 비활성, 오류 상태, 지우기 버튼 노출처럼 JS 를 넣지 않은 상태 전환. 「누른 요소 / 나머지 요소」에 무엇을(클래스 · `aria-*` · `hidden`) 바꾸는지 쓴다. 주석에 적은 속성은 마크업에도 실제로 있어야 한다. 가이드는 이 주석을 `.sample` 안 첫 줄에 둬서 복사 스니펫에 딸려 가게 하고, **페이지는 가이드에서 복사할 때 이 주석까지 함께 가져온다.**
- 데이터 값에 따라 바뀌는 것(상태 클래스 · `aria-*` · `selected` · `checked` · `hidden` · 블록 출력 여부)은 빠짐없이 `@` 로 적는다. `@` 에는 「어떤 값일 때 무엇을 붙이는지」만 쓰고 이유는 쓰지 않는다. 그 밖에 달아도 되는 HTML 주석의 범위는 `SKILL.md` §2.
- **개발이 채울 값은 마크업에 넣지 않는다** — 탭 `<button value="…">` · `<option value="…">` 의 구분 코드처럼 DB 에서 오는 값은 비워 둔다. 임의 · 임시값도 틀린 정보가 되고 가이드 마크업과도 달라진다. 「전체 · 선택 안 함」을 뜻하는 `value=""` 는 UI 의미라 유지하고, 실제 콘텐츠인 값(패밀리사이트 URL · 예시 입력 글자)은 해당 없다.

  ```html
  <!-- @ 탭 클릭 시 (개발)
       누른 탭: .is-active + aria-selected="true" / 나머지: .is-active 제거 + aria-selected="false" -->
  <div class="tabs" role="tablist" aria-label="…">…</div>
  ```
- 개발이 붙을 자리가 필요하면 공통 부품이 **커스텀 이벤트(`ui:*`)만 보내고, 코드로 부를 동작은 공개 API 로 꺼낸다** (위 「공개 API」. 탭처럼 선택이 곧 조회인 부품은 이벤트도 없다 — 「개발 영역」). 받아서 조회하는 코드는 쓰지 않는다.
- 데모용 링크는 `href="javascript:"` 를 두고 JS 로 `location` 을 바꾸지 않는다. 이동은 개발 연동 시 `href` 로 들어간다.
- **제출(검색 실행 · 등록)도 개발 담당이다** — `<form>` 을 쓰지 않고 일반 태그로 감싸며(검색 묶음은 입력 묶음 `<div class="input-group" role="search">`), 버튼은 전부 `type="button"`. `type="submit"` · `action` · `novalidate` 는 개발이 연동하며 붙인다.

### 금지

- 인라인 핸들러 (`onclick=""` — 공개 API 호출 포함), `document.write`, `eval`
- `<div onClick>` — 동작은 `<button>`, 이동은 `<a>` (§8)
- 전역 변수·함수 (`window.foo = `) — `common.js` 의 `window.UI` 하나만 예외. 페이지 JS 는 전역을 만들지 않고 필요한 동작을 `common.js` 모듈로 올린다
- `setTimeout` 으로 레이아웃 타이밍을 맞추는 것 — 원인을 찾아 CSS 나 이벤트로 해결한다. 서드파티 초기화 대기 같은 불가피한 경우만 주석과 함께 허용한다.
- `console.log` 를 남기지 않는다 — 연동 코드는 개발 담당이라 퍼블리싱 JS 에는 출력할 조건이 없다. 디버그 로그는 완료 전에 지운다.

### 완료 전

- `node --check js/[page].js` 로 문법을 확인한다.
- 브라우저 콘솔에 오류 0건. 다른 페이지에서 로드돼도 오류가 없어야 한다 (요소 가드).
- `common.js` 모듈을 고쳤으면 콘솔에서 `UI.init()` 을 한 번 더 불러 이벤트 · 스와이퍼가 두 번 붙지 않는지 본다.
- Tab 키만으로 모든 동작에 도달하고, 상태 전환 시 ARIA 가 따라 바뀐다.

> **예외** — `html/worklist/worklist.js` · `guide/guide.js` 는 프로젝트마다 그대로 복사해 쓰는 내부 문서용 범용 파일이라 이 절을 소급 적용하지 않는다 (순수 JS 등). jQuery 없이 단독으로 동작한다. 고칠 일이 생기면 그때 맞춘다.
