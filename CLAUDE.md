# CLAUDE.md

개인 포트폴리오 사이트(GitHub Pages)의 퍼블리싱 작업 진입점. 컨벤션 본문은 `publishing` 스킬에 있고, 마크업·스타일을 건드릴 때 호출해 읽는다.

**사용자에게 하는 말은 모두 한국어로 쓴다** — 답변 · 완료 보고 · 요약 · 질문 · 선택 버튼 문구까지. 영어 시스템 문구에 끌려 영어로 쓰지 않는다.

## ⚠️ 작업 범위

| 경로 | 수정 |
| --- | --- |
| 이 폴더 전체 | 자유 (문서·토큰·스킬·산출물) |
| **그 외 전부** | **금지** |

- 커밋 메시지는 `pub: 내용` — "무엇을 왜"가 한 줄에.
- 실행 · 빌드 · 폴더 구조 · JS 모듈 안내는 루트 `README.md` — 구조나 규약을 바꾸면 같이 고친다.

## 트랙

정적 HTML(메인 + 전체 프로젝트 + 백업) + SCSS → `common/css/common.css` 한 파일. 서버 템플릿 없음 · 개발 이관 없음 — **이 저장소가 그대로 배포된다** (GitHub Pages).

## 프로젝트 설정

> 특정 작업에서만 보는 표(텍스트 스타일 · 간격 · 결정 기록)는 **`PROJECT.md`** 에 있다.

`publishing` 스킬 기본값에서 **아래만 다르다.** 여기 없는 항목은 스킬 기본값을 쓴다.

- 산출물 루트 — 이 폴더. **페이지는 루트에** (GitHub Pages 진입점이라 `html/` 폴더에 두지 않는다) — `index.html`(메인) · `projects.html`(전체 프로젝트 — 메인 「전체 프로젝트 보기」가 팝업 화면 iframe 으로 연다, noindex) · `index2.html`(백업 — 프로젝트를 제목 줄 + 카드 3열로 바꾼 메인, noindex). 에셋 경로는 `common/…` (상대경로, `../` 없음)
- 공통 에셋 — `common/` (언어 폴더 없음)
- 공통 조각(헤더 · 푸터) — **조각 파일 없음.** 페이지마다 안에 직접 둔다 (헤더를 고치면 세 페이지 모두). `common.js` 의 조각 삽입 · `FRAGMENT_DIR` 은 뺐다
- JS 파일 — `common.js`(공통 모듈 중 쓰는 것만 — 유틸 · 앵커 스크롤 · 진입 모션 · 모달 · 공개 API + 이 사이트 헤더) · `main.js`(메인 섹션 동작) · **예외 `theme.js`** — 팝업 안(iframe) 표시(`data-embed`)를 첫 화면 전에 거는 몇 줄, `<head>` 에서 동기 로드
- 라이브러리 — 로컬 `common/js/lib/` jQuery 3.7.1 · GSAP 3.12.5 + ScrollTrigger · Lenis 1.3.27(부드러운 스크롤 — `common.js` 「부드러운 스크롤」, 라이선스 `LICENSE-lenis.txt`). Swiper 없음. **예외 — EmailJS SDK 는 CDN**(`@emailjs/browser@4`, `defer`) — 연락 폼 전송용. 첫 화면을 막지 않게 보낼 때 준비 여부를 본다
- **퍼블 JS 범위 예외** — 배포되는 사이트라 개발 몫(조회 · 저장 · 제출)도 직접 한다: 프로젝트 탭 전환 · 분류 필터(전체 프로젝트) · 모달 내용 채우기 · 연락 폼 EmailJS 전송(`<form>` + `type="submit"`)
- 사이트명 — `구은지 웹 퍼블리셔 포트폴리오`. `<title>` 은 `웹 퍼블리셔 포트폴리오: 구은지` (검색어 「퍼블리셔 포트폴리오」 우선). 도메인 `https://eunjiku.github.io/` — canonical · OG · sitemap · JSON-LD 가 이 주소를 쓴다
- **인라인 스크립트 예외 — JSON-LD** (`<script type="application/ld+json">`, schema.org WebSite · Person). 실행 코드가 아니라 검색엔진용 데이터라 `<head>` 에 둔다
- 터치 타깃 — 44×44px (작아 보이는 버튼은 `touch-area` · `touch-area-before` 믹스인으로 누르는 영역만 넓힌다)
- **영어 문구는 쓰지 않는다** (사용자 지시) — 예외: 히어로 큰 글자 「WEB PUBLISHER」 · 「Scroll」 · 연락 띠 「CONTACT」(사용자 요청) — 메뉴 · 제목 · 라벨 · 버튼 · 푸터 모두 한글. 고유명사 · 기술명(삼성화재 · KIOTI · HTML5 · GitHub 등)만 그대로. 부득이 영문 구절을 넣으면 `lang="en"`
- 컬러 대비 — **점검한다 (WCAG AA 4.5:1)** — 접근성을 내세우는 포트폴리오라 본문 · 라벨 색은 대비를 맞춘다 (`PROJECT.md` 「대비 미달 색상」). 장식(코드 창 주석 색 · aria-hidden)은 제외
- 루트 글자 크기 — **(B) 100%** (1rem = 16px, 시안 px ÷ 16). 화면 폭에 비례해 커지지 않는다 — 글자 · 간격은 고정, 콘텐츠는 최대 1440px 가운데 정렬(`--content-width`), 좌우 여백 40 / 24(1024↓) / 20(600↓). vw 로 크기를 잡지 않는다 (사용자 지시) — 예외: 히어로 큰 영문 · 가운데 상자는 화면 양끝까지 채우려 무대 폭 비례(container 단위 cqw)
- 브레이크포인트 — 1024 / 600 · 네이밍 — 케밥 · 페이지 프리픽스 — 메인 섹션 `main-`
- GNB 현재 메뉴 표시 — 있음. 스크롤 위치의 섹션 링크에 `.is-active` + `aria-current="true"` (`common.js` 「현재 섹션 메뉴」)
- 다크 모드 — **없음** (사용자 지시 — 검정 구획과 겹쳐 애매). 검정 구획은 섹션에 `data-tone="dark"`
- 진입 모션 — 있음. 공통 진입 모션(`data-motion` · `data-motion-group="each | row"`) + 첫 진입 헤더 내려오기(PC 만 — 1024↓ 은 처음부터 제자리). 새 블록을 더하면 같은 속성을 붙인다 (`PROJECT.md` 「결정 기록」)
- 디자인 원본 — 피그마 없음. 콘텐츠는 라이브 사이트(v1) 범위, **디자인은 참고 사이트(아이파트너즈 https://www.ipartners.co.kr/) 느낌** — 무채색(#efefef · 검정 · 흰색, 포인트 색 없음) · 검정 구획(`data-tone="dark"`) · 섹션 머리 흐르는 띠 · 굵은 고딕 · **둥근 모서리 없음**(예외: 화면 위에 붙은 헤더 판 12px — 사용자 요청) — **콘텐츠를 임의로 늘리지 않는다** (사용자 지시). 토큰 결정은 `PROJECT.md` 「결정 기록」

### 로컬 확인

이 폴더를 VS Code 로 열고 **Live Sass Compiler 「Watch Sass」**(SCSS → css + map, 출력 설정은 `.vscode/settings.json`)와 **Live Server**(루트 `index.html` 에서 Open with Live Server → `http://127.0.0.1:5193/`)를 켠다. 확장이 없을 때만 `npm install` 한 번 뒤 `npm run scss:watch` · `npm run serve`(`http://localhost:8080/`). Claude 가 SCSS 를 고쳤는데 Watch Sass 가 꺼져 있으면 `npm run scss` 로 `css/` 를 갱신한다.

### 보유 폰트

Pretendard v1.3.9 공식 KS X 1001 서브셋 · `common/fonts/Pretendard-Regular.subset.woff2`(400) · `Medium`(500) · `SemiBold`(600) · `Bold`(700) — 서브셋(한글 2,780자 · 영문 · 기본 기호) 밖 글자는 시스템 폰트로 보인다. 400 · 700 은 `<head>` 에서 preload — 로컬 `@font-face`(`scss/common/_fonts.scss`), CDN 연결 없음. 라이선스 `LICENSE-Pretendard.txt` 같은 폴더


### 워크리스트

없음 — 페이지가 적은 사이트. 할 일 · 결정 대기는 `TODO.md`.

## 코드를 쓰기 전에

**HTML·CSS·JS 를 한 줄이라도 만들거나 고치기 전에 `publishing` 스킬을 호출한다.** 스킬 값과 위 「프로젝트 설정」이 다르면 **이 문서가 우선한다.**

작업을 마치면 `publishing/references/checklist.md` · `a11y-check` 로 검증한 뒤 보고한다. 완료 보고의 첫 블록은 가정·임의 결정이다. 전체 점검 · 검수 · 반응형 · SEO 확인 요청은 `site-check` 스킬 — 고치라는 말이 없으면 보고서부터.

**디자인 토큰** — `common/scss/common/_tokens.scss` 의 `:root` 가 원본 (`publishing` §0 · §7 · §10).

산출물 점검 — 저장소 루트에서 `node .claude/skills/publishing/scripts/audit.js` (`html/` 폴더가 없으면 루트 `*.html` 을, 이미지는 `site.webmanifest` 까지 읽는다). 「안 쓰는 클래스」의 `lenis-smooth` · `lenis-stopped` 는 Lenis 가 실행 중에 붙이는 것이라 정상.

환경 — Windows 11 · Node 18.20.5 · Python 없음. 스크립트는 Node 로 쓴다.
