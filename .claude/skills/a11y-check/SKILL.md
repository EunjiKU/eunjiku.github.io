---
name: a11y-check
description: 페이지의 웹 접근성을 브라우저에서 실측 점검하고 표준 포맷으로 보고하는 스킬. "접근성 체크해줘", "웹접근성 점검", "a11y 검사", "접근성 확인" 요청 시, 그리고 figma-to-html 로 페이지를 완성했을 때 완료 보고 전에 반드시 수행한다. 페이지명이 오면 그 페이지만, 없으면 산출물의 모든 페이지를 점검한다. 렌더된 DOM 을 스크립트로 측정한다.
---

# 접근성 점검 스킬 (a11y-check)

페이지를 KWCAG 2.2 / WCAG 2.1 AA 기준으로 점검하고 결과를 표준 포맷으로 보고한다.

> **판정 기준의 원본은 `publishing` 스킬 §8 — 본문은 `publishing/references/accessibility.md` — 이다.** 이 스킬은 그 규칙을 "어떤 순서로 실행하고 어떤 포맷으로 보고하는가"만 정의한다. 기준이 궁금하거나 충돌하면 §8 이 우선한다. 규칙 내용을 이 파일에 복사하지 않는다.
---

## 1. 대상 결정

- 사용자가 페이지명을 지정하면 → 해당 페이지만
- 지정하지 않으면 → 페이지 폴더(`CLAUDE.md` 「프로젝트 설정」, 기본 `html/`)의 `*.html` 전부 (`worklist/`·`guide/` 제외 — 내부 문서. `_` 로 시작하는 템플릿 · 공통 조각 `header.html` · `footer.html` 도 제외)
- 점검 전에 대상 목록을 사용자에게 한 줄로 알린다. (예: "2개 페이지를 점검합니다")

## 2. 실행 절차 (페이지마다)

### ① 페이지 열기

`CLAUDE.md` 「로컬 확인」 명령으로 띄운 로컬 서버로 연다 (`file://` 은 헤더·푸터가 빈다 — `publishing/references/javascript.md` 「공통 조각」). 브라우저 폭은 **1920 → 1024 → 600** 순서로 바꿔 가며 ②~④를 반복한다. 데스크톱 퍼스트 프로젝트라 1920 이 기준이고, 터치 타깃(③)은 600 에서의 값이 중요하다.

### ② 자동 점검 스니펫 실행

브라우저에서 아래를 실행한다. `의심:` 접두사가 붙은 검출은 휴리스틱이라 오탐 가능 — 확정 위반과 구분해서 보고한다.

```js
/* 접근성 자동 점검 — 검출 0건이 목표 */
const issues = [];
/* 문서 기본 */
if (!document.documentElement.lang) issues.push("html lang 누락");
if (!document.title) issues.push("title 누락");
if (!document.querySelector(".skip")) issues.push("스킵 링크 누락");
if (document.querySelectorAll("h1").length > 1) issues.push("h1 2개 이상");  /* 0개는 메인처럼 대표 타이틀이 안 보이는 페이지만 정상 — 서브페이지면 이슈 */
document.querySelectorAll("h1.blind,h2.blind,h3.blind,h4.blind,h5.blind,h6.blind").forEach((h) => issues.push("숨김 제목: " + h.textContent.trim().slice(0, 15)));
if (document.querySelectorAll("main").length !== 1) issues.push("main 개수 ≠ 1");
/* 제목 위계 건너뜀 (h2→h4 등) */
const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
hs.forEach((l, i) => { if (i && l > hs[i - 1] + 1) issues.push("제목 위계 건너뜀: h" + hs[i - 1] + "→h" + l); });
/* 대체 텍스트 · 레이블 */
document.querySelectorAll("img:not([alt])").forEach((el) => issues.push("alt 누락: " + el.src.split("/").pop()));
document.querySelectorAll("img:not([width]), img:not([height])").forEach((el) => { if (getComputedStyle(el).objectFit !== "cover") issues.push("의심: img width/height 누락(CLS): " + el.src.split("/").pop()); }); // 고정 틀(object-fit: cover) 이미지는 속성을 넣지 않는 게 규칙이라 제외
document.querySelectorAll("button:not([aria-label]), a:not([aria-label])").forEach((el) => {
  if (!el.textContent.trim() && !el.querySelector("img[alt]:not([alt=\"\"])")) issues.push("빈 버튼/링크 aria-label 누락: " + (el.className || el.tagName));  /* 안의 img alt 가 이름이 되는 로고 링크는 제외 */
});
document.querySelectorAll("input:not([type=hidden]), select, textarea").forEach((el) => {
  if (!el.labels?.length && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby")) issues.push("label 미연결: " + (el.id || el.name || el.type || el.tagName));
});
/* 표의 구성 */
document.querySelectorAll("table").forEach((t) => { if (!t.querySelector("caption")) issues.push("table caption 누락"); });
document.querySelectorAll("th:not([scope])").forEach((th) => issues.push("th scope 누락: " + th.textContent.trim().slice(0, 10)));
/* 새 창 사전 알림 · onchange 자동 실행 */
document.querySelectorAll("a[target=_blank]").forEach((a) => {
  if (!/새\s?창/.test((a.title || "") + (a.getAttribute("aria-label") || "") + a.textContent)) issues.push("새 창 사전 알림 누락: " + a.textContent.trim().slice(0, 15));
});
document.querySelectorAll("select[onchange]").forEach((s) => issues.push("select onchange 자동 실행: " + (s.id || s.name || "select")));
/* aria-hidden 오용 (포커스 가능 요소 포함) */
document.querySelectorAll("[aria-hidden=true]").forEach((el) => {
  if (el.matches("a,button,input,select,textarea") || el.querySelector("a,button,input,select,textarea"))
    issues.push("aria-hidden 내 포커스 가능 요소: " + (el.className || el.tagName));
});
/* 깜빡임 · 응답시간 · 문자 단축키 · 확대 차단 */
if (document.querySelector("marquee,blink")) issues.push("깜빡임 요소(marquee/blink) 사용");
if (document.querySelector("meta[http-equiv='refresh' i]")) issues.push("meta refresh 사용 — 응답시간 조절 불가");
const vp = document.querySelector("meta[name=viewport]")?.content || "";
if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\D|$)/.test(vp)) issues.push("뷰포트 확대 차단");
document.querySelectorAll("[accesskey]").forEach((el) => issues.push("의심: accesskey 문자 단축키: " + el.getAttribute("accesskey")));
/* 레이블과 네임 일치 (휴리스틱) */
document.querySelectorAll("a[aria-label], button[aria-label], input[aria-label]").forEach((el) => {
  const t = el.textContent.replace(/\s+/g, " ").trim(), al = el.getAttribute("aria-label");
  if (t && al && !al.replace(/\s+/g, " ").includes(t.slice(0, 8))) issues.push("의심: 레이블-네임 불일치: '" + t.slice(0, 10) + "' / '" + al.slice(0, 15) + "'");
});
/* 중복 id */
const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => issues.push("중복 id: " + id));
/* 가로 오버플로 */
if (document.documentElement.scrollWidth > document.documentElement.clientWidth) issues.push("가로 오버플로 " + document.documentElement.scrollWidth + " > " + document.documentElement.clientWidth);
JSON.stringify(issues.length ? issues : "자동 점검 통과");
```

### ③ 터치 타깃 실측 — 44×44px 미만 컨트롤 수집 (600 폭에서 필수)

```js
JSON.stringify([...document.querySelectorAll("button, a, input:not([type=hidden]), select, [role=button]")]
  .filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && (r.width < 44 || r.height < 44);
  })
  .map((el) => (el.className || el.tagName) + "(" + Math.round(el.getBoundingClientRect().width) + "x" + Math.round(el.getBoundingClientRect().height) + ")"));
```

- 인라인 텍스트 링크(본문 안 문장 링크)는 예외로 보되, 보고에 "예외 처리"로 남긴다.
- 시각 크기를 바꿀 수 없으면 투명 패딩이나 `::after` 로 히트 영역만 넓힌다.

### ④ 캐러셀·키보드 대안 확인

Swiper 캐러셀이 있는 페이지는 keyboard 옵션과 대체 컨트롤 존재를 확인한다. 탭 스와이퍼(`.tabs-swiper`)는 캐러셀이 아니라 제외한다 (`publishing/references/javascript.md` 「모션」).

```js
JSON.stringify([...document.querySelectorAll(".swiper-initialized:not(.tabs-swiper)")].map((s) => ({
  el: s.className,
  keyboard: !!s.swiper?.params.keyboard?.enabled,
  autoplay: !!s.swiper?.params.autoplay?.enabled,
  controls: !!(s.closest("section") || s.parentElement).querySelector(".swiper-pagination, .swiper-button-next, [class*=prev], [class*=next]"),
})));
```

- `autoplay: true` 인데 정지 버튼이 없으면 위반으로 보고한다.

### ⑤ 색상 대비 — 페이지에 쓰인 색 조합 계산

> **`CLAUDE.md` 「프로젝트 설정」의 「컬러 대비」가 「신경 쓰지 않음」이면 이 단계를 건너뛰고 보고 표에서 「색상 대비」 행을 뺀다.** 시안 색을 그대로 쓰고 대비를 이유로 색을 바꾸거나 이슈로 올리지 않는다. 아래는 점검하는 프로젝트(접근성 인증 대상)의 절차다.

1. 해당 페이지의 스타일(`scss/common/` · `scss/components/` · `scss/components/_style.scss`)에서 `color:` 선언과 그 배경을 파악한다. 토큰값은 `scss/common/_tokens.scss` 의 `:root` 에서 읽는다.
2. 텍스트/배경 조합마다 아래 스크립트로 실측한다. Python 없이 돌도록 **Node** 로 쓴다 (마지막 배열의 쌍을 교체해서 실행).

   ```bash
   node -e "
   const lum=h=>{h=h.replace('#','');const [r,g,b]=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);return 0.2126*r+0.7152*g+0.0722*b};
   const c=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return ((x+0.05)/(y+0.05)).toFixed(2)};
   [['#767676','#ffffff','gray / white'],['#999999','#f5f5f5','light gray / tint bg']].forEach(([a,b,n])=>console.log(c(a,b).padStart(5),' ',n));
   "
   ```

   예시 쌍은 중립값이다. 프로젝트에서 점검할 조합과 기존 실측값은 `PROJECT.md` 「대비 미달 색상」에 있다.

3. 4.5 미만(18pt≈24px 이상 또는 14pt≈18.66px 볼드 대형 텍스트는 3.0 미만)을 위반으로 기록한다.
4. **`PROJECT.md` 「대비 미달 색상」 표에 이미 등재된 조합은 재계산하지 않고 "기등재 — 디자이너 협의 대기"로만 표기한다.** 새로 발견한 미달 조합은 그 표에 추가한다.
5. 브라우저가 열려 있으면 `getComputedStyle` 로 실제 렌더 색을 읽어도 된다 — 투명도·중첩 배경이 있는 경우 이쪽이 정확하다.

### ⑥ 수동 점검 (전체 점검 시 1회)

- Tab 키만으로 주요 인터랙션(버튼·링크·셀렉트·카드) 도달 및 `:focus-visible` 표시 확인
- `prefers-reduced-motion: reduce` 에서 전환·애니메이션이 꺼지는지 (JS 모션이 있을 때)
- 상태(마감·선택·오류)가 색 외의 단서(텍스트·아이콘)로도 구분되는지

## 3. 보고 포맷

결과는 아래 포맷으로 보고한다. **검출 0건인 페이지도 "통과"로 명시**하여 점검했음을 남긴다.

```
### FO-XXX-XX-XX-XXX 화면명
| 항목 | 검출 내용 | 조치 |
| --- | --- | --- |
| 자동 점검 (1920/1024/600) | 스킵 링크 누락 | 코드 수정 |
| 터치 타깃 (600) | pagination-item(32x32) 외 5건 | 코드 수정 |
| 캐러셀 | 해당 없음 | — |
| 색상 대비 | #999 / #fff 2.85 (기등재) | 디자이너 협의 |
| 수동 | Tab 순서 정상, focus-visible 표시 | 통과 |
```

- 조치 구분은 **코드 수정 / 디자이너 협의 / 기준 확인** 3종만 사용한다.
- 마지막에 전체 요약(페이지 수, 총 검출 수, 즉시 수정 가능 건수)을 붙인다.
- **점검 후 수정까지 요청받은 경우에만 코드를 고친다.** 점검 요청만 받았으면 보고까지만 하고 멈춘다.

## 4. 커버리지와 한계 고지 (보고에 반드시 포함)

이 스킬은 KWCAG 2.2 검사항목 중 **기계적으로 점검 가능한 범위**를 다룬다.

- **자동/반자동 점검**: 스킵 링크, 기본 언어, title·제목 위계, 대체 텍스트(존재), 레이블 연결, 표 caption/scope, 새 창 알림, onchange 자동 실행, aria-hidden 오용, 깜빡임 요소, meta refresh, 확대 차단, 문자 단축키, 레이블-네임(휴리스틱), 중복 id, 가로 오버플로, 터치 타깃, 캐러셀 정지·키보드, 명도 대비
- **기계 점검 불가 — 보고 끝에 한 줄로 고지**: 색에 무관한 인식, 지시사항의 명확성, 콘텐츠 선형 구조, 대체 텍스트의 적절성, 자막 품질, 스크린리더 낭독 순서, 실제 키보드 전 기능 조작은 수동 점검이 필요하며, 인증 심사에는 사용자(스크린리더) 심사가 포함된다.
- **콘텐츠 의존 항목**(오류 정정, 캡차 대안, 반복 입력): 해당 UI(폼·인증)가 페이지에 존재할 때만 수동으로 확인한다.
