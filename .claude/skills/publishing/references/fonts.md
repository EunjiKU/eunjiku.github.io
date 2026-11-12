# 폰트 — publishing 스킬 §10 의 본문 (고정 구조 · 결정 절차 · 로드 방식)

> 이 파일은 `publishing` 스킬 §10 「폰트」의 전체 내용이다. SKILL.md 의 §10 은 요약과 이 파일로의 링크만 담는다.
> **프로젝트 시작 시 폰트를 정할 때, 폰트를 바꾸거나 weight 를 추가할 때, `@font-face` 를 쓸 때** 연다. 프로젝트의 보유 폰트와 로드 방식이 정해지면 `CLAUDE.md` 「프로젝트 설정」(보유 폰트)에 적고, 그 값이 이 문서보다 우선한다.

**폰트는 프로젝트마다 달라진다. 고정된 것은 "구조"이고, "어떤 폰트냐"는 시안이 정한다.**

### 고정 구조 — 국문 토큰 1개

```css
/* common/_tokens.scss — 1. 디자인 토큰 */
:root {
  --font-family-kor: "{국문폰트}", -apple-system, BlinkMacSystemFont, "Segoe UI", "Malgun Gothic", sans-serif;
}
```

- 폰트 이름의 SoT 는 `--font-family-kor` 다. 텍스트 스타일 `--font-{style}` 의 글꼴 자리에 같은 스택을 그대로 적고(`typography.md`), 폰트를 바꾸면 토큰·텍스트 스타일·`@font-face` 를 같이 바꾼다.
- 폴백 스택 마지막에는 항상 시스템 폰트를 남긴다. 웹폰트 로드 실패 시 레이아웃이 유지돼야 한다.
- **영문 전용 토큰·클래스는 미리 만들지 않는다.** 시안에 영문 전용 폰트가 따로 지정된 프로젝트에서만 아래를 추가한다.

```css
:root { --font-family-eng: "{영문폰트}", var(--font-family-kor); }
/* 영문·숫자 전용 요소 (연도, 카운터, 영문 타이틀 등) — font 축약형을 쓰는 요소가 아니라 그 안의 <span> 에 붙인다 */
.eng { font-family: var(--font-family-eng); }
```

### 프로젝트 시작 시 결정 절차

1. **저장소에 이미 있는 폰트를 먼저 확인한다.** 기존 자산이 있는 프로젝트라면 폰트도 이미 배치돼 있을 수 있다 — 있으면 경로만 참조하고 새로 받지 않는다. (「프로젝트 설정」에 보유 폰트 목록이 있으면 그것을 본다.)
2. **시안에서 폰트 확인** — Figma 텍스트 레이어의 실제 font family. 국문/영문이 다른 폰트인지 본다.
3. **로드 방식 결정** — 아래 표 참고. **「프로젝트 설정」이 방식을 지정했으면 그것을 따른다.**
4. **`common/_tokens.scss` 의 토큰과 `common/_fonts.scss` 의 `@font-face` 에 반영.**
5. 시안 폰트가 유료·라이선스 확인이 필요한 폰트면 **작업 전에 사용자에게 확인**한다. 임의로 비슷한 무료 폰트로 대체하지 않는다.

### 로드 방식

| 방식 | 언제 | 작성 위치 |
| --- | --- | --- |
| **(A) 로컬 `@font-face`** (기본) | 모든 프로젝트 — 킷에 Pretendard 400 · 700 woff2 가 `common/fonts/` 에 들어 있다. 사내망·폐쇄망 · CDN 차단 환경에서도 그대로 동작하고, 개발 이관 때 외부 의존이 없다 | `common/fonts/` 에 woff2 + `common/_fonts.scss` 「2. 웹폰트」 `@font-face` |
| **(B) CDN** | 「프로젝트 설정」이 CDN 을 지정했을 때만 (기존 자산이 CDN 폰트를 쓰는 등). jsDelivr / Fontshare / Google Fonts 등 | HTML `<head>` 에 `preconnect` + `<link>` — `_template.html` · 가이드 · 워크리스트 모두 |

**(A) 로컬 `@font-face` 예시** — 킷 기본 (`common/_fonts.scss`)

```css
/* common/_fonts.scss — 2. 웹폰트. 경로는 출력 css/common.css 기준 */
@font-face {
  font-family: "Pretendard";
  src: url("../fonts/Pretendard-Regular.woff2") format("woff2");
  font-weight: 400;          /* weight 별로 각각 선언 */
  font-style: normal;
  font-display: swap;        /* FOIT 방지 — 필수 */
}
@font-face {
  font-family: "Pretendard";
  src: url("../fonts/Pretendard-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

`html/worklist/worklist.css` 는 `common.css` 를 로드하지 않는 독립 문서라 같은 `@font-face` 를 자기 파일 상단에 한 번 더 둔다 (경로 `../../common/fonts/`).

**(B) CDN 예시** — 국문 Pretendard 인 경우

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" />
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet" />
```

- **woff2 만 둔다** — 지원 범위의 브라우저가 전부 읽는다. 지원 범위에 woff2 를 못 읽는 브라우저가 있을 때만 woff 를 폴백으로 하나 더한다. ttf·otf·eot 는 신규 선언에 넣지 않는다.
- 새 굵기가 필요하면 같은 폴더에 woff2 를 추가하고 `@font-face` 를 하나 더 선언한다.
- 실제로 쓰는 weight만 넣는다. weight 를 전부 받아두면 초기 로딩만 무거워진다.
- `font-display: swap`을 빠뜨리지 않는다.
- 기존 자산에 `@font-face` 선언이 있으면 그대로 두고 신규 파일에만 작성한다. **같은 `font-family` 이름을 중복 선언하지 않도록 주의한다.**

> **기본값** — 시안에 별도 지정이 없으면 국문은 **Pretendard** 를 기본으로 쓴다. 영문 전용 폰트는 **기본값을 두지 않는다** — 시안에 영문 폰트가 따로 지정돼 있을 때만 위 「고정 구조」의 `--font-family-eng` · `.eng` 를 추가한다.