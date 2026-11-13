# 구은지 웹 퍼블리셔 포트폴리오

https://eunjiku.github.io/ — 정적 HTML 한 페이지 + SCSS, GitHub Pages 로 배포한다. 섹션: 히어로 · 프로젝트 · 소개 · 경력 및 자격 · 연락

## 실행

- **VS Code** — Live Sass Compiler 「Watch Sass」(SCSS → `common/css/common.css` + map) · Live Server 로 `index.html` 열기 (`http://127.0.0.1:5193/`)
- **확장 없이** — `npm install` 한 번 뒤

```bash
npm run scss:watch
```

```bash
npm run serve
```

배포 전에는 `npm run scss` 로 `common/css/` 를 갱신해 함께 커밋한다 (Pages 는 sass 를 돌리지 않는다).

## 폴더

```
index.html                 ← 메인 페이지 (GitHub Pages 진입점)
projects.html              ← 전체 프로젝트 — 제목 줄(제목 · 실무/개인 탭 · 분류 필터) + 카드 3열. 메인 「전체 프로젝트 보기」가 팝업 화면(iframe)으로 연다. 검색 제외(noindex) · sitemap 에 없음
index2.html                ← 백업 — 메인 프로젝트를 제목 줄 + 카드 3열로 바꾼 버전. 검색 제외(noindex) · sitemap 에 없음
robots.txt · sitemap.xml   ← 검색엔진 크롤링 (페이지가 바뀌면 sitemap 의 lastmod 갱신)
common/
├── scss/                  ← 스타일 소스 — 여기만 고친다
│   ├── common.scss        ← 엔트리 (@use 순서 = 출력 순서 · 목차)
│   ├── _tools.scss        ← 믹스인 (출력 없음)
│   ├── common/            ← 리셋 · 토큰 · 폰트 · 문서 기준 · 유틸 · 헤더 · 푸터 · 섹션 골격
│   └── components/        ← 폼 · 버튼 · 라벨 · 리스트 · 아이콘 · 모달 · 메인 섹션(_main)
├── css/                   ← 컴파일 산출물 (직접 고치지 않는다)
├── js/
│   ├── theme.js           ← <head> — 팝업 안(iframe)이면 data-embed (헤더 · 푸터 감춤)
│   ├── common.js          ← 공통 UI — 헤더(테마 · 메뉴 · 첫 진입 · 진행 막대 · 현재 섹션) · 부드러운 스크롤 · 앵커 스크롤 · 진입 모션 · 모달 · 공개 API window.UI
│   ├── main.js            ← 메인 섹션 — 히어로 덮기 · 히어로 단어 · 숫자 세기 · 경력 타임라인 · 프로젝트 탭 · 필터(전체 프로젝트) · 지금 보는 카드 · 쌓이는 카드 · 설명 모달 · 연락 폼(EmailJS) · 맨 위로 버튼 · 마우스 커서
│   └── lib/               ← jQuery 3.7.1 · GSAP 3.12.5 + ScrollTrigger · Lenis 1.3.27 (로컬)
├── images/                ← icon-* · logo-* (SVG) · @img-sample-* (더미 사진 — 히어로 · 프로젝트 카드) · favicon* · og-default.png
├── fonts/                 ← Pretendard 400 · 500 · 600 · 700 + 라이선스
└── site.webmanifest       ← 홈 화면 아이콘 (192 · 512)
CLAUDE.md · PROJECT.md · TODO.md   ← 작업 규칙 · 결정 기록 · 할 일
.claude/                   ← Claude Code — launch.json(미리보기 서버 「preview」) · skills/(publishing — 코딩 컨벤션 · a11y-check — 접근성 점검 · site-check — 배포 전 전체 점검)
```

## 콘텐츠 고치기

| 무엇 | 어디 |
| --- | --- |
| 색 · 글자 크기 | `common/scss/common/_tokens.scss` (`:root` · 검정 구획 `[data-tone="dark"]` · 1024/600) |
| 프로젝트 카드 | `index.html` `#workGrid`(쌓이는 카드) · `projects.html` `#workGrid` · `#personalGrid`(3열 `.project-grid`) 의 `<article class="project-card">` — 「설명 보기」 모달 내용은 카드의 `data-*` (`data-pages` · `data-contrib` 는 `\|` 구분, `data-tags` 는 `,` 구분, `data-url` · `data-video` 는 있을 때만). 공개 주소가 있는 카드만 「사이트 보기」 링크. 사진 자리 면색은 `.project-card-bg1`~`3` |
| 전체 프로젝트 · 건너뛰기 | 왼쪽 「프로젝트」 아래 `.more-btn`(서브페이지 `projects.html` — 스크립트가 있으면 `#projectsModal` 화면이 오른쪽에서 밀고 들어온다. 헤더는 위에 남고, 헤더 링크를 누르면 화면을 닫고 그 섹션으로) · `.skip-btn`(소개로). 팝업 안 서브페이지는 `html[data-embed]`(theme.js)로 헤더 · 푸터를 감춘다 |
| 지금 보는 카드 | 메인 오른쪽 `.preview`(사진 · 이름 · 순번 · `.now-tag`) — `main.js` 「지금 보는 카드 표시」가 지금 붙어 있는 카드의 `data-period` 연도 · `data-category` 로 바꾼다 |
| 분류 필터 (전체 프로젝트) | `projects.html` `.filter-btn[data-filter]` 값 = 카드 `data-category` (`build` 구축 · `dispatch` 파견) |
| 히어로 | 큰 영문 `.hero-name` · 가운데 상자 글자 `.hero-media .media-item`(한 자씩 — `main.js` 「히어로 글자」) · 슬로건 `.intro .tit` · 아래 줄 `.hero-foot`(숫자 · 주요 기술 · 강점 `.info-list` · 흐르는 고객사 `.client-list` 두 벌) |
| 맨 위로 버튼 · 마우스 커서 | `.top-btn`(맨 위가 아니면 보임 — `main.js` 「맨 위로 버튼」) · `.cursor` 점 + 뒤따라오는 `.cursor-ring`(PC 마우스에서만 — 「마우스 커서」) |
| 흐르는 띠(연락) · 검정 구획 · 큰 문장 | `.sec-band`(흐르는 제목 `h2.band-tit` — 같은 묶음 `.set` 두 벌) · 섹션에 `data-tone="dark"` · `.statement[data-fill]`(`main.js` 「문장 채우기」, 왼쪽 정렬 `.statement-left`) |
| 경력 · 학력 타임라인 | `.career-line` 의 `.career-item` (오래된 순). 지금 다니는 곳은 `.is-active` — 스크롤하면 선이 그어지는 동작은 `main.js` 「경력 타임라인」 |
| 검색 결과 문구 | `<head>` 의 `<title>` · `description` · OG · JSON-LD (`PROJECT.md` 「SEO 태그」) |
| 진입 모션 | 블록에 `data-motion`, 차례로 뜨는 묶음은 부모에 `data-motion-group="each"`(제목 묶음) · `"row"`(카드 목록) |

## 연락 폼 (EmailJS)

방문자가 보낸 메시지를 서버 없이 메일로 받는다 (무료 플랜 월 200건).

1. https://www.emailjs.com 가입
2. **Email Services** → Add New Service → SMTP — 네이버면 Host `smtp.naver.com` · Port `465` · SSL 켬 · User 본인 네이버 주소 · 비밀번호는 **네이버 앱 비밀번호**(내정보 → 보안설정 → 2단계 인증 → 애플리케이션 비밀번호). 네이버 메일 환경설정에서 IMAP/SMTP 「사용함」
3. **Email Templates** → 변수 `{{from_name}}` · `{{from_email}}` · `{{subject}}` · `{{message}}` 로 본문 작성, Reply To 는 `{{from_email}}`
4. `index.html` `#contactForm` 의 `data-emailjs-public-key` · `data-emailjs-service-id` · `data-emailjs-template-id` 를 본인 값으로 (Account → API Keys · Email Services · Email Templates)

- 공개 키라 HTML 에 있어도 된다. 받는 메일 주소는 EmailJS 템플릿 설정에만 둔다 (저장소에 적지 않는다)
- 「Invalid login」 은 앱 비밀번호가 아닐 때, 메일이 안 오면 IMAP/SMTP 설정을 확인한다

## 배포 전 점검

```bash
node .claude/skills/publishing/scripts/audit.js
```

안 쓰는 클래스 · 이미지와 페이지 구조(중복 id · 없는 id 참조 · h1 · alt)를 본다. 반응형(기기 폭 표) · 접근성 · SEO 까지 한 번에 보는 순서는 `.claude/skills/site-check/SKILL.md`. 배포 날짜가 바뀌면 `sitemap.xml` 의 `lastmod` 를 고친다.

## 상태 클래스

`.is-active`(현재) · `.is-open`(열림) · `.is-scrolled`(맨 위 아님) · `.is-hidden`(모션으로 숨김) · `.is-fixed`(스크롤 잠금) · `.is-shown`(진입 모션). 검정 구획은 섹션에 `data-tone="dark"`.
