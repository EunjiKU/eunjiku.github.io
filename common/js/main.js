/**
 * main.js — 메인 섹션 동작
 * 히어로 덮기 · 숫자 세기 · 경력 타임라인 · 프로젝트 탭(실무 · 개인) · 분류 필터 · 지금 보는 카드 표시 · 쌓이는 카드 · 프로젝트 제목 등장 · 전체 프로젝트 화면(헤더 · Esc) · 프로젝트 설명 모달 채우기 · 메시지 보내기(EmailJS) · 떠 있는 캐릭터
 * common.js 다음에 로드한다 — UI.util · UI.refresh 를 쓴다
 */
(function ($) {
  "use strict";

  if (!window.UI) return;
  const util = window.UI.util;

  /* --------------------------------------------------------------------------
     히어로 덮기 — 히어로 무대(.main-hero .stage)가 화면에 멈추고 다음 섹션(프로젝트)이 그 위로 올라와 덮는다
     · 무대 아래끝이 화면 아래에 닿을 때 멈춘다(화면보다 짧으면 위끝이 닿을 때) — 화면 높이만큼 멈춰 있는다(pinSpacing 없음)
     · 덮이는 동안 무대가 조금 어두워진다 — 진행도(0 → 1)를 --cover-dim 으로 (모양은 SCSS cover-dim)
     · 모션 줄이기 · GSAP 없음은 핀 없이 그냥 스크롤
     -------------------------------------------------------------------------- */
  const HERO_COVER = { dim: 0.6 };   // 다 덮였을 때의 딤 세기 (0 ~ 1)

  function setupHeroCover() {
    const stage = $(".main-hero .stage")[0];
    if (!stage || util.reduceMotion.matches || !util.ensureGsap()) return;
    ScrollTrigger.create({
      trigger: stage,
      start: () => (stage.offsetHeight > window.innerHeight ? "bottom bottom" : "top top"),
      end: () => "+=" + window.innerHeight,
      pin: stage,
      pinSpacing: false,
      pinSpacer: window.UI.pinSpacer(stage),
      invalidateOnRefresh: true,
      onUpdate: (self) => stage.style.setProperty("--cover-dim", (self.progress * HERO_COVER.dim).toFixed(3))
    });
  }

  /* --------------------------------------------------------------------------
     숫자 세기 — [data-count] 숫자가 화면에 들어오면 0 부터 그 값까지 센다 (마크업에는 최종 값)
     · 처음부터 화면에 보이는 숫자 · 모션 줄이기 · GSAP 없음은 최종 값 그대로
     -------------------------------------------------------------------------- */
  const COUNT = { start: "top 95%", duration: 0.8 };

  function setupCount() {
    const $nums = $("[data-count]");
    if (!$nums.length || util.reduceMotion.matches || !util.ensureGsap()) return;
    $nums.each(function () {
      const el = this;
      const target = parseInt($(el).attr("data-count"), 10) || 0;
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: COUNT.start,
        once: true,
        onEnter: () => {
          const counter = { value: 0 };
          gsap.to(counter, {
            value: target,
            duration: COUNT.duration,
            ease: "power1.out",
            onUpdate: () => { el.textContent = Math.round(counter.value); }
          });
        }
      });
      /* 아직 화면 밖 — 들어오기 전에 0 으로 둔다. 이미 지난 숫자는 최종 값 그대로 */
      if (trigger.progress === 0) el.textContent = "0";
      else trigger.kill();
    });
  }

  /* --------------------------------------------------------------------------
     경력 타임라인 — 스크롤하는 만큼 .career-line 의 선이 그어진다 (진행도 0 → 1 을 --line-progress 로)
     · 선이 항목의 점 위치에 닿으면 그 항목에 .is-reached — 눈금 · 점 · 글이 나타난다 (모양은 SCSS)
     · PC 는 가로(왼쪽 → 오른쪽), 1024↓ 세로(위 → 아래) — 점 위치는 화면 크기가 바뀔 때 다시 잰다
     · 모션 줄이기 · GSAP 없음은 다 그은 상태
     -------------------------------------------------------------------------- */
  const CAREER = { start: "top 80%", end: "bottom 55%", scrub: 0.6 };

  function setupCareerLine() {
    const line = $(".main-experience .career-line")[0];
    if (!line) return;
    const $items = $(line).find(".career-item");
    let points = $items.map(() => 0).get();
    function draw(progress) {
      line.style.setProperty("--line-progress", progress.toFixed(3));
      $items.each(function (i) { $(this).toggleClass("is-reached", progress > points[i]); });
    }
    if (util.reduceMotion.matches || !util.ensureGsap()) return draw(1);
    /* 항목마다 점이 선의 몇 % 지점에 있는지 */
    function measure() {
      const box = line.getBoundingClientRect();
      const vertical = util.mqMobile.matches;
      points = $items.map(function () {
        const r = this.getBoundingClientRect();
        return vertical ? (r.top - box.top) / box.height : (r.left - box.left) / box.width;
      }).get();
    }
    ScrollTrigger.create({
      trigger: line,
      start: CAREER.start,
      end: CAREER.end,
      scrub: CAREER.scrub,
      invalidateOnRefresh: true,
      onRefresh: (self) => { measure(); draw(self.progress); },
      onUpdate: (self) => draw(self.progress)
    });
  }

  /**
   * 다시 보이게 된 카드의 진입 차례를 0 부터 다시 매긴다 — hidden 이 풀리면 CSS 진입 모션이 다시 재생되므로, 처음 스크롤 때 매긴 순번(지연)이 남아 늦게 뜨지 않게
   * @param {jQuery} $cards 보이는 카드
   */
  function restartOrder($cards) {
    $cards.filter(".is-shown").each(function (i) { this.style.setProperty("--motion-order", i); });
  }

  /* --------------------------------------------------------------------------
     프로젝트 탭 — .tabs > .tab-btn(role="tab", aria-controls 패널) · 선택 표시 알약 .indicator
     · 선택: .is-active + aria-selected="true" + tabindex 0, 나머지는 -1 — 패널은 hidden
     · 좌우 화살표 · Home · End 로 탭 이동
     · 실무 탭에서만 분류 필터(.filter)를 보인다
     · 알약 위치 · 폭은 CSS 변수 --indicator-x · --indicator-w
     -------------------------------------------------------------------------- */
  const $tabs = $(".main-projects .tabs");
  const $tabBtns = $tabs.find(".tab-btn");
  const $indicator = $tabs.find(".indicator");
  const $filter = $(".main-projects .filter");

  function moveIndicator() {
    const btn = $tabBtns.filter(".is-active")[0];
    const bar = $indicator[0];
    if (!btn || !bar) return;
    bar.style.setProperty("--indicator-x", btn.offsetLeft + "px");
    bar.style.setProperty("--indicator-w", btn.offsetWidth + "px");
  }

  /** 탭 버튼이 가리키는 패널 */
  const panelOf = (btn) => $(document.getElementById($(btn).attr("aria-controls")));

  function setTab(index, focus) {
    $tabBtns.each(function (i) {
      const on = i === index;
      $(this).toggleClass("is-active", on).attr({ "aria-selected": String(on), tabindex: on ? null : "-1" });
      panelOf(this).prop("hidden", !on);
    });
    const $panel = panelOf($tabBtns[index]);
    if (focus) $tabBtns.eq(index).trigger("focus");
    $filter.prop("hidden", $panel.attr("id") !== "workGrid");
    restartOrder($panel.find(".project-card").not("[hidden]"));
    moveIndicator();
    window.UI.refresh();   // 패널 높이가 바뀌었다
  }

  function bindTabs() {
    if (!$tabBtns.length) return;
    $tabs.on("click", ".tab-btn", function () { setTab($tabBtns.index(this)); });
    $tabs.on("keydown", ".tab-btn", function (e) {
      const last = $tabBtns.length - 1;
      const i = $tabBtns.index(this);
      const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      setTab(next, true);
    });
    moveIndicator();
    if (document.fonts) document.fonts.ready.then(moveIndicator);   // 글꼴이 바뀌면 탭 폭이 바뀐다
    let ticking = false;
    window.addEventListener("resize", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        moveIndicator();
        ticking = false;
      });
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     분류 필터 — .filter-btn[data-filter] 하나만 aria-pressed="true". 실무 카드 중 data-category 가 다른 것은 hidden
     -------------------------------------------------------------------------- */
  function setFilter(value) {
    $filter.find(".filter-btn").each(function () {
      $(this).attr("aria-pressed", String($(this).attr("data-filter") === value));
    });
    $("#workGrid .project-card").each(function () {
      $(this).prop("hidden", value !== "all" && $(this).attr("data-category") !== value);
    });
    restartOrder($("#workGrid .project-card").not("[hidden]"));
    window.UI.refresh();
  }

  function bindFilter() {
    if (!$filter.length) return;
    $filter.on("click", ".filter-btn", function () { setFilter($(this).attr("data-filter")); });
  }

  /* --------------------------------------------------------------------------
     지금 보는 카드 표시 — .now-tag 의 .year · .type 을 지금 보는 카드의 연도 · 구분으로, .preview 가 있으면 면색 · 이름 · 순번도
     · 연도는 data-period 앞 네 자리, 구분은 data-category(build 구축 · dispatch 파견 · 없으면 개인)
     · 2열 카드(백업 페이지)는 화면 가운데를 지나는 카드, 쌓이는 카드는 지금 붙어 있는 카드 (「쌓이는 카드」)
     · 카드마다 ScrollTrigger — 숨긴 카드는 건너뛴다. 필터 · 탭 뒤에는 UI.refresh() 가 다시 잰다
     -------------------------------------------------------------------------- */
  const NOW_TYPE = { build: "구축", dispatch: "파견" };
  const BG_CLASSES = "project-card-bg1 project-card-bg2 project-card-bg3";
  const pad = (n) => String(n).padStart(2, "0");

  /** 카드 하나를 지금 보는 카드로 표시 */
  function showNow(card) {
    if (!card || !card.offsetParent) return;
    const $card = $(card);
    const year = ($card.attr("data-period") || "").slice(0, 4);
    $(".main-projects .now-tag .year").text(year ? "#" + year : "");
    $(".main-projects .now-tag .type").text("#" + (NOW_TYPE[$card.attr("data-category")] || "개인"));
    const $preview = $(".main-projects .preview");
    if (!$preview.length) return;
    const $visible = $card.parent().children(".project-card").not("[hidden]");
    $preview.find(".num").text(pad($visible.index(card) + 1));
    $preview.find(".total").text(pad($visible.length));
    const bg = (card.className.match(/project-card-bg\d/) || [""])[0];
    $preview.find(".mini").removeClass(BG_CLASSES).addClass(bg)
      .find(".genre").text($card.find(".thumb > .genre").text());
  }

  /** 2열 카드 — 화면 가운데를 지나는 카드 */
  function setupNowTag() {
    const $cards = $(".main-projects .project-card").filter(function () { return !$(this).closest(".stack-list").length; });
    if (!$cards.length || !util.ensureGsap()) return;
    showNow($cards[0]);
    $cards.each(function () {
      const card = this;
      ScrollTrigger.create({
        trigger: card,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => { if (self.isActive) showNow(card); }
      });
    });
  }

  /* --------------------------------------------------------------------------
     쌓이는 카드 — .stack-list 의 카드는 화면 위에 붙고(sticky, SCSS) 다음 카드가 그 위를 덮는다
     · 덮이는 동안 카드가 작아지며 위로 밀린다 — 진행도(0 → 1)를 --stack 으로. 마지막 카드는 그대로
     · 붙기 조금 전(화면 높이의 STACK.nowAt 만큼)부터 다음 카드가 올 때까지 「지금 보는 카드」
     · 붙는 위치는 앞 카드 높이 + 간격을 더해 잰다 (붙어 있는 카드는 화면 위치가 달라서) — 숨긴 카드는 건너뛴다
     · 모션 줄이기는 쌓임 효과 없이 붙기만, GSAP 없음은 표시도 그대로
     -------------------------------------------------------------------------- */
  const STACK = { nowAt: 0.4 };

  function setupStack() {
    const $cards = $(".main-projects .stack-list .project-card");
    if (!$cards.length || !util.ensureGsap()) return;
    const reduce = util.reduceMotion.matches;

    /** 카드가 화면 위에 붙기 시작하는 스크롤 위치(start) · 다음 카드가 붙을 때까지 거리(step) · 마지막 카드인지 */
    function range(card) {
      const list = card.parentElement;
      const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
      let y = list.getBoundingClientRect().top + window.scrollY;
      let last = true;
      let passed = false;
      $(list).children(".project-card").each(function () {
        if (this === card) {
          passed = true;
          return;
        }
        if (this.hidden) return;
        if (passed) last = false;
        else y += this.offsetHeight + gap;
      });
      return { start: y - (parseFloat(getComputedStyle(card).top) || 0), step: card.offsetHeight + gap, last: last };
    }

    showNow($cards.filter(function () { return this.offsetParent; })[0]);
    $cards.each(function () {
      const card = this;
      let r = range(card);
      ScrollTrigger.create({
        start: () => (r = range(card)).start - window.innerHeight * STACK.nowAt,
        end: () => r.start + r.step - window.innerHeight * STACK.nowAt,
        invalidateOnRefresh: true,
        onToggle: (self) => { if (self.isActive) showNow(card); }
      });
      if (reduce) return;
      ScrollTrigger.create({
        start: () => (r = range(card)).start,
        end: () => r.start + r.step,
        invalidateOnRefresh: true,
        onUpdate: (self) => card.style.setProperty("--stack", r.last || card.hidden ? 0 : self.progress.toFixed(3))
      });
    });
  }

  /* --------------------------------------------------------------------------
     프로젝트 제목 등장 — 「프로젝트」 제목이 화면 가운데에 크게 있다가, 스크롤하면 작아지며 왼쪽 고정 칸 자리로 간 뒤 쌓이는 카드가 올라온다 (PC)
     · 제목은 가로는 페이지 가운데, 세로는 헤더 아래 보이는 영역의 가운데 — 위치 · 크기는 --intro(1 가운데 → 0 제자리) × --intro-x · --intro-y · --intro-s, 나머지(버튼 · 오른쪽 표시)는 --intro-rest 로 나타난다 (모양은 SCSS)
     · 카드 목록 앞에 제목이 움직일 스크롤 거리(--intro-space = 화면 높이 × INTRO.space)를 둔다
     · 1024↓ · 모션 줄이기 · GSAP 없음은 제자리 그대로
     -------------------------------------------------------------------------- */
  const INTRO = { space: 0.8, scale: 3, fill: 0.7, move: 0.85, restFrom: 0.7 };   // 거리(화면 높이 배) · 최대 배율 · 가운데 칸 폭 대비 제목 폭 · 제목이 움직이는 구간 · 나머지가 나타나기 시작하는 진행도

  function setupProjectsIntro() {
    const layout = $(".main-projects .project-layout-stack")[0];
    if (!layout || util.reduceMotion.matches || !util.ensureGsap()) return;
    const side = $(layout).find(".side")[0];
    const sticky = $(side).find(".side-sticky")[0];
    const title = $(sticky).find(".sec-head .tit")[0];
    if (!title) return;
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const active = () => !util.mqMobile.matches;

    /* 거리 · 가운데 자리 — 위치 계산 전에 */
    function measure() {
      if (!active()) {
        layout.style.setProperty("--intro-space", "0px");
        return;
      }
      layout.style.setProperty("--intro-space", Math.round(window.innerHeight * INTRO.space) + "px");
      const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
      const box = layout.getBoundingClientRect();
      const fromX = sticky.getBoundingClientRect().left + title.offsetLeft + title.offsetWidth / 2;
      const fromY = stickyTop + title.offsetTop + title.offsetHeight / 2;
      const scale = Math.min(INTRO.scale, (box.width * INTRO.fill) / title.offsetWidth);
      layout.style.setProperty("--intro-x", (box.left + box.width / 2 - fromX).toFixed(1) + "px");
      const gnb = $(".gnb")[0];
      const top = gnb ? gnb.offsetHeight : 0;   // 헤더 아래 보이는 영역의 가운데
      layout.style.setProperty("--intro-y", ((top + window.innerHeight) / 2 - fromY).toFixed(1) + "px");
      layout.style.setProperty("--intro-s", scale.toFixed(3));
    }
    function draw(progress) {
      const on = active();
      layout.style.setProperty("--intro", on ? (1 - clamp(progress / INTRO.move)).toFixed(3) : 0);
      layout.style.setProperty("--intro-rest", on ? clamp((progress - INTRO.restFrom) / (1 - INTRO.restFrom)).toFixed(3) : 1);
    }

    ScrollTrigger.addEventListener("refreshInit", measure);
    measure();
    ScrollTrigger.create({
      trigger: side,
      start: () => "top " + (parseFloat(getComputedStyle(sticky).top) || 0) + "px",
      end: () => "+=" + Math.max(1, Math.round(window.innerHeight * INTRO.space)),
      invalidateOnRefresh: true,
      onRefresh: (self) => draw(self.progress),
      onUpdate: (self) => draw(self.progress)
    });
  }

  /* --------------------------------------------------------------------------
     전체 프로젝트 화면 — #projectsModal(.modal-page)이 열려 있어도 헤더는 위에 남아 누를 수 있다
     · 모달은 바깥을 모두 inert 로 막는다 — 열리면 헤더만 풀고 본문 · 푸터는 막아 둔다
     · 헤더 링크(로고 · 메뉴)를 누르면 화면이 원래대로 밀려 돌아간 뒤(transform 전환 끝) 그 섹션으로 스크롤 (앵커 스크롤은 common.js)
     · 헤더에서 테마를 바꾸면 화면 안 서브페이지(iframe)도 같이 바꾼다
     -------------------------------------------------------------------------- */
  function bindPageScreen() {
    const $screen = $("#projectsModal");
    if (!$screen.length) return;
    const $wrapper = $(".wrapper");
    $screen.on("ui:modal-open", () => {
      $wrapper.prop("inert", false);
      $wrapper.children().not(".gnb").prop("inert", true);
    });
    $screen.on("ui:modal-close", () => $wrapper.children().prop("inert", false));
    /* 헤더 링크 — 화면을 닫아 원래대로 밀려 돌아간 뒤 앵커 스크롤(common.js — document 위임)로 이어 간다. 헤더에서 먼저 받아 막는다 */
    const $box = $screen.find(".modal-box");
    $(".gnb").on("click", "a[href^=\"#\"]", function (e) {
      if (!$screen.hasClass("is-open")) return;
      e.preventDefault();
      e.stopPropagation();
      const link = this;
      window.UI.modal.close("#projectsModal");
      if (util.reduceMotion.matches) return link.click();
      $box.off(".screen").on("transitionend.screen transitioncancel.screen", (ev) => {   // 같은 때 겹(.modal)이 숨으면 cancel 로 끝난다
        if (ev.target !== $box[0] || ev.originalEvent.propertyName !== "transform") return;
        $box.off(".screen");
        link.click();
      });
    });
    /* 테마 — html[data-theme] 가 바뀌면 iframe 문서에도 */
    new MutationObserver(() => {
      const frame = $screen.find(".page-frame")[0];   // 닫을 때 새 노드로 바뀐다 (common.js 모달)
      const doc = frame && frame.contentDocument;
      if (!doc) return;
      const theme = document.documentElement.getAttribute("data-theme");
      if (theme) doc.documentElement.setAttribute("data-theme", theme);
      else doc.documentElement.removeAttribute("data-theme");
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* --------------------------------------------------------------------------
     팝업 안 서브페이지 — 메인 「전체 프로젝트」 화면(#projectsModal iframe — 여닫기 · 밀려 들어오는 전환은 common.js 모달 + SCSS .modal-page)에서 열렸으면(html[data-embed]) Esc 로 그 화면을 닫는다
     · 서브페이지 안 모달이 열려 있으면 그 모달만 닫힌다 (common.js 가 먼저 받아 기본 동작을 막는다)
     -------------------------------------------------------------------------- */
  function bindEmbedEscape() {
    if (!document.documentElement.hasAttribute("data-embed")) return;
    $(document).on("keydown", (e) => {
      if (e.key !== "Escape" || e.isDefaultPrevented()) return;
      try {
        window.parent.UI.modal.close("#projectsModal");
      } catch (err) {
        /* 다른 곳에 끼워진 경우 — 닫을 팝업이 없다 */
      }
    });
  }

  /* --------------------------------------------------------------------------
     프로젝트 설명 모달 — 카드의 「설명 보기」(.detail-btn)를 누르면 카드 제목 · data-* 로 #projectModal 을 채운다 (열기는 common.js 모달)
     · data-pages · data-contrib 「|」 구분 → .slash-list, data-tags 「,」 구분 → .tag-list
     · data-url(사이트 보기 버튼) · data-video(영상)는 있을 때만 보인다. 닫으면 영상을 멈춘다
     -------------------------------------------------------------------------- */
  const $modal = $("#projectModal");

  /** 구분자로 나눈 값을 목록 항목으로 — 비면 false */
  function fillList($list, value, sep, itemClass) {
    const items = (value || "").split(sep).map((v) => v.trim()).filter(Boolean);
    $list.empty().append(items.map((v) => $("<li>", { "class": itemClass, text: v })));
    return items.length > 0;
  }

  const field = (name) => $modal.find("[data-field=\"" + name + "\"]");

  function fillModal($card) {
    $modal.find(".modal-head .tit").text($card.find(".info .tit").first().text());
    ["period", "role", "client", "detail"].forEach((name) => {
      const value = $card.attr("data-" + name) || "";
      field(name).text(value).prop("hidden", !value);
    });
    ["pages", "contrib"].forEach((name) => {
      const has = fillList(field(name), $card.attr("data-" + name), "|", "slash-item");
      field(name).closest(".modal-section").prop("hidden", !has);
    });
    fillList(field("tags"), $card.attr("data-tags"), ",", "tag");
    const href = $card.attr("data-url");
    field("url").attr("href", href || "javascript:").prop("hidden", !href);
    const video = $card.attr("data-video");
    const $video = field("video");
    if (video) $video.attr("src", video);
    else $video.removeAttr("src");
    $video.closest(".modal-video").prop("hidden", !video);
  }

  function bindProjectModal() {
    if (!$modal.length) return;
    /* common.js 의 여는 동작(document 위임)보다 먼저 — 카드 목록에서 받는다 */
    $(".main-projects").on("click", ".project-card .detail-btn", function () {
      fillModal($(this).closest(".project-card"));
    });
    $modal.on("ui:modal-close", () => {
      const video = field("video")[0];
      if (video) video.pause();
    });
  }

  /* --------------------------------------------------------------------------
     메시지 보내기 — #contactForm 을 EmailJS 로 보낸다 (키는 form 의 data-emailjs-*)
     · SDK 는 defer 로 늦게 받으므로 보낼 때 준비 여부를 본다 (첫 화면을 막지 않게)
     · 보내는 동안 버튼 disabled + 글자(.txt — aria-live)로 상태를 알리고, 잠시 뒤 원래 글자로
     -------------------------------------------------------------------------- */
  const SEND_MESSAGE = { sending: "전송 중...", done: "전송 완료!", fail: "전송 실패 — 다시 시도해 주세요", noKey: "메일 설정이 없습니다", resetAfter: 2500 };

  function bindContact() {
    const $form = $("#contactForm");
    if (!$form.length) return;
    const publicKey = $form.attr("data-emailjs-public-key");
    const serviceId = $form.attr("data-emailjs-service-id");
    const templateId = $form.attr("data-emailjs-template-id");
    const $btn = $form.find("[type=\"submit\"]");
    const $label = $btn.find(".txt");
    const original = $label.text();

    /** 버튼 글자를 바꾸고 잠근다 — finished 면 잠시 뒤 원래 글자로 풀어 준다 */
    function setStatus(text, finished) {
      $label.text(text);
      $btn.prop("disabled", true);
      if (!finished) return;
      /* 결과 문구를 읽을 시간 — 레이아웃과 무관한 표시 시간 */
      setTimeout(() => {
        $label.text(original);
        $btn.prop("disabled", false);
      }, SEND_MESSAGE.resetAfter);
    }

    $form.on("submit", (e) => {
      e.preventDefault();
      if (!window.emailjs || !publicKey) return setStatus(SEND_MESSAGE.noKey, true);
      setStatus(SEND_MESSAGE.sending, false);
      window.emailjs.sendForm(serviceId, templateId, $form[0], { publicKey: publicKey })
        .then(() => {
          $form[0].reset();
          setStatus(SEND_MESSAGE.done, true);
        }, () => setStatus(SEND_MESSAGE.fail, true));
    });
  }

  /* --------------------------------------------------------------------------
     떠 있는 캐릭터 — 맨 위(FLOAT.showAt 이하)에서는 .main-float.is-hidden
     · 말풍선 .bubble 문구를 FLOAT.interval 초마다 바꾼다 — 바꾸는 동안 .bubble.is-hidden (모션 줄이기는 바로 바꾼다)
     -------------------------------------------------------------------------- */
  const FLOAT = {
    showAt: 200,
    interval: 5,
    fade: 0.3,
    messages: ["봐주셔서 감사합니다!", "같이 일하면 후회 안 하실걸요?", "코드로 증명하는 퍼블리셔입니다!", "웹 퍼블리셔 · 서울"]
  };

  function bindFloat() {
    const $float = $(".main-float");
    if (!$float.length) return;
    let ticking = false;
    function update() {
      $float.toggleClass("is-hidden", window.scrollY <= FLOAT.showAt);
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();

    const $bubble = $float.find(".bubble");
    if (!$bubble.length || !util.ensureGsap()) return;
    let index = 0;
    function next() {
      index = (index + 1) % FLOAT.messages.length;
      if (util.reduceMotion.matches) {
        $bubble.text(FLOAT.messages[index]);
        return;
      }
      $bubble.addClass("is-hidden");
      gsap.delayedCall(FLOAT.fade, () => $bubble.text(FLOAT.messages[index]).removeClass("is-hidden"));
    }
    gsap.timeline({ repeat: -1 }).call(next, null, FLOAT.interval);
  }

  setupHeroCover();
  setupCount();
  setupCareerLine();
  bindTabs();
  bindFilter();
  setupNowTag();
  setupStack();
  setupProjectsIntro();
  bindPageScreen();
  bindEmbedEscape();
  bindProjectModal();
  bindContact();
  bindFloat();
})(jQuery);
