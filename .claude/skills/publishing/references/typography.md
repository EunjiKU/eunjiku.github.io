# 타이포 토큰 — publishing 스킬 §10 의 본문

> **언제 여는가** — 글자 스타일을 선택자에 적용할 때, 텍스트 스타일을 추가할 때, MO 글자 크기를 다룰 때 연다. 폰트 파일 로드는 `fonts.md`. 실제 경로·파일명·값은 `CLAUDE.md` 「프로젝트 설정」과 `PROJECT.md` 가 우선한다.

### 타이포 토큰 — 글자는 텍스트 스타일 변수 `--font-{style}` 하나로

글자 변수는 **텍스트 스타일 한 층**뿐이다. 피그마 타이포 가이드의 텍스트 스타일(`Kor/body/b2-med` …)을 **이름 그대로** `_tokens.scss` `:root` 에 `--font-{style}` + `--font-{style}-ls` 로 전부 등록하고, 값은 「굵기 크기 / 행간 글꼴」 을 **그대로 적는다** — 변수 안에 변수를 두지 않는다. 역할별 별칭(`--font-btn` 같은 것)은 만들지 않는다 — 어느 글자가 어느 스타일인지는 선택자가 말한다.

```css
/* _tokens.scss :root — 피그마 Kor/button/btn-lg-sb */
--font-btn-lg-sb: 600 18rem / 1.2 "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", "Malgun Gothic", sans-serif;  --font-btn-lg-sb-ls: -0.015em;
```

목적은 두 가지다. **시안의 글자는 반드시 이 텍스트 스타일 중 하나**라서, `get_design_context` 가 주는 스타일 이름에서 변수로 바로 간다(환산 없음). 그리고 **스타일 값이 바뀌면 `:root` 의 그 줄 하나만 고친다.** 자간은 `font` 축약형에 들어가지 않아 `-ls` 짝이 따로 있다.

텍스트 스타일을 글자에 적용하는 방법은 두 가지다.

1. **자리가 정해진 글자는 전용 선택자에.** 버튼·타이틀·카드 제목처럼 "이 자리의 글자" 가 명확한 것은 마크업에 폰트 클래스를 붙이지 않고, 그 자리의 선택자에서 두 줄로 준다. "버튼 글자를 btn-md-sb 로" 는 그 선택자의 변수 이름만 바꾸면 끝난다.

   ```css
   .basic-btn {
     font: var(--font-btn-lg-sb);
     letter-spacing: var(--font-btn-lg-sb-ls);
   }
   ```

2. **자리가 정해지지 않은 글자는 클래스에.** 에디터 본문·안내 문단처럼 부모로 특정할 수 없는 콘텐츠 텍스트는 `common/_fonts.scss`(`common.css` 「2-1. 텍스트 스타일 클래스」)의 클래스 `.font-{style}` (`.font-b2-reg { font: var(--font-b2-reg); letter-spacing: var(--font-b2-reg-ls); }`, 색은 정하지 않음, 3단어 제한 §6 의 예외)를 붙인다. 스타일마다 한 줄씩 전부 있다.

고정 규칙.

- **선택자의 글자는 `font: var(--font-{style}); letter-spacing: var(--font-{style}-ls);` 두 줄뿐.** 컴포넌트·페이지 CSS 에 `font-size`·`font-weight`·`line-height` 를 따로 쓰면 틀린 것이다. 시안 글자가 텍스트 스타일 밖이면 CSS 에 박지 말고 "토큰 없음" 으로 보고한다 (`figma-to-html` §4-1) — 디자이너가 스타일을 추가하면 `_tokens.scss` `:root` 와 `_fonts.scss` 「2-1」에 한 줄씩 더한다.
- **굵기만 다른 변형은 `font-weight` 한 줄로 덮는다.** 같은 스타일의 강조 상태는 변형 선택자에서 `font-weight` 만 쓰고, 문장 안 일부만 굵게 할 글자는 `<b>` 로 감싼다 — 의미 없이 굵게만 할 때 클래스 · CSS 없이 `<b>` 하나로 끝난다. **리셋은 `<strong>` · `<b>` 굵기를 지우지 않는다** (브라우저 기본 `bolder` — `_reset.scss` 에 굵기 리셋을 넣지 않는다). 중요한 내용이라 읽기 보조기에도 강조로 전해야 하면 `<strong>`.
- **MO 값은 변수가 안다.** Display · Title · Heading 은 1024 이하 크기가 달라 `:root` 의 `@media (max-width: 1024px)` 에서 재선언돼 있다. 컴포넌트 CSS 의 미디어쿼리에 글자 속성을 쓰지 않는다 — MO 에서 다른 스타일로 가는 글자는 그 선택자를 미디어쿼리 안에서 다른 변수로 바꾼다 (`font` + `letter-spacing` 두 줄). MO 에서 글자를 숨기고 아이콘만 남길 때는 `font-size: 0` 대신 글자를 `<span>` 으로 감싸 `.blind` 방식으로 숨긴다. 시안의 MO 크기가 스타일의 MO 값과 다르면 코드가 아니라 보고에 적는다.
- 가이드 `html/worklist/guide/list/typography.html` 의 Style 표는 `guide.js` 가 렌더된 CSS 를 실측해 채운다. 스타일을 추가하면 표에 `<tr data-role>` 한 줄을 더한다.
