/**
 * main.js — 메인 섹션 동작
 * 히어로 덮기 · 히어로 글자 · 숫자 세기 · 경력 타임라인 · 프로젝트 탭(실무 · 개인) · 분류 필터 · 지금 보는 카드 표시 · 쌓이는 카드 · 문장 채우기 · 전체 프로젝트 화면(헤더 · Esc) · 프로젝트 설명 모달 채우기 · 메시지 보내기(EmailJS) · 맨 위로 버튼 · 마우스 커서
 * common.js 다음에 로드한다 — UI.util · UI.refresh 를 쓴다
 */
(function ($) {
  "use strict";

  if (!window.UI) return;
  const util = window.UI.util;

  /* --------------------------------------------------------------------------
     히어로 덮기 — 히어로 무대(.main-hero .stage)가 화면에 멈추고 다음 섹션(프로젝트)이 그 위로 올라와 덮는다
     · 무대 아래끝이 화면 아래에 닿을 때 멈춘다(화면보다 짧으면 위끝이 닿을 때) — 화면 높이만큼 멈춰 있는다(pinSpacing 없음)
     · 덮이는 동안 무대가 점점 검정이 된다 — 다 덮이기 직전(HERO_COVER.full)에 완전 검정, 진행도를 --cover-dim 으로 (모양은 SCSS cover-dim)
     · 모션 줄이기 · GSAP 없음은 핀 없이 그냥 스크롤
     -------------------------------------------------------------------------- */
  const HERO_COVER = { full: 0.85 };   // 덮이는 진행도가 이만큼일 때 완전 검정 (0 ~ 1 — 다 덮이기 직전)

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
      onUpdate: (self) => stage.style.setProperty("--cover-dim", Math.min(1, self.progress / HERO_COVER.full).toFixed(3))
    });
  }

  /* --------------------------------------------------------------------------
     히어로 글자 — 가운데 상자(.hero-media)의 글자 면(.media-item)이 한 자씩 .is-active (모양은 SCSS)
     · HERO_LETTER.interval 초마다 다음 글자
     · 모션 줄이기 · GSAP 없음은 첫 글자 그대로
     -------------------------------------------------------------------------- */
  const HERO_LETTER = { interval: 0.9 };

  function setupHeroLetters() {
    const $items = $(".main-hero .hero-media .media-item");
    if ($items.length < 2 || util.reduceMotion.matches || !util.ensureGsap()) return;
    let index = $items.index($items.filter(".is-active"));
    function next() {
      index = (index + 1) % $items.length;
      $items.each(function (i) { $(this).toggleClass("is-active", i === index); });
    }
    gsap.timeline({ repeat: -1 }).call(next, null, HERO_LETTER.interval);
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
     지금 보는 카드 표시 — 오른쪽 .preview 의 사진 · 이름 · 순번과 .now-tag 의 .year · .type 을 지금 붙어 있는 카드로 (「쌓이는 카드」가 부른다)
     · 연도는 data-period 앞 네 자리, 구분은 data-category(build 구축 · dispatch 파견 · 없으면 개인)
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
    const $mini = $preview.find(".mini").removeClass(BG_CLASSES).addClass(bg);
    $mini.find(".genre").text($card.find(".thumb .genre").text());
    $mini.find(".photo").attr("src", $card.find(".thumb .photo").attr("src"));
  }

  /* --------------------------------------------------------------------------
     쌓이는 카드 — .stack-list 의 카드는 화면 위에 붙고(sticky, SCSS) 다음 카드가 그 위를 덮는다
     · 덮이는 동안 카드가 작아지며 위로 밀린다 — 진행도(0 → 1)를 --stack 으로. 마지막 카드는 그대로
     · 붙기 조금 전(화면 높이의 STACK.nowAt 만큼)부터 다음 카드가 올 때까지 「지금 보는 카드」
     · 붙는 위치는 앞 카드 높이 + 간격을 더해 잰다 (붙어 있는 카드는 화면 위치가 달라서) — 숨긴 카드는 건너뛴다
     · 모션 줄이기는 쌓임 효과 없이 붙기만, GSAP 없음은 표시도 그대로. 1024↓ 은 SCSS 가 붙음 · 쌓임을 꺼 그냥 흘러간다
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
     문장 채우기 — .statement[data-fill] 의 단어를 나눠(.word) 스크롤하는 만큼 앞에서부터 .is-filled (색은 SCSS)
     · 문장 윗변이 화면 FILL.start 에 오면 시작, 아랫변이 FILL.end 에 오면 다 채움
     · 모션 줄이기 · GSAP 없음은 처음부터 다 채움
     -------------------------------------------------------------------------- */
  const FILL = { start: "top 80%", end: "bottom 45%" };

  function setupFill() {
    $(".statement[data-fill]").each(function () {
      const el = this;
      const words = el.textContent.trim().split(/\s+/);
      el.textContent = "";
      words.forEach((word, i) => {
        if (i) el.appendChild(document.createTextNode(" "));
        $("<span>", { "class": "word", text: word }).appendTo(el);
      });
      const $words = $(el).find(".word");
      if (util.reduceMotion.matches || !util.ensureGsap()) {
        $words.addClass("is-filled");
        return;
      }
      ScrollTrigger.create({
        trigger: el,
        start: FILL.start,
        end: FILL.end,
        scrub: true,
        onUpdate: (self) => {
          const count = Math.round(self.progress * $words.length);
          $words.each(function (i) { $(this).toggleClass("is-filled", i < count); });
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     전체 프로젝트 화면 — #projectsModal(.modal-page)이 열려 있어도 헤더는 위에 남아 누를 수 있다
     · 모달은 바깥을 모두 inert 로 막는다 — 열리면 헤더만 풀고 본문 · 푸터는 막아 둔다
     · 헤더 링크(로고 · 메뉴)를 누르면 화면이 원래대로 밀려 돌아간 뒤(transform 전환 끝) 그 섹션으로 스크롤 (앵커 스크롤은 common.js)
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
     마우스 커서 — .cursor 점이 마우스를 따라온다 (PC 마우스에서만 — html.has-cursor 로 기본 커서를 숨긴다)
     · 링크 · 버튼 위 .is-hover(크게), 입력칸 위 .is-text(숨김 — 기본 글자 커서), 창 밖 · iframe 위로 나가면 숨김
     · 점은 마우스 자리에 바로, 링(.cursor-ring)은 매 프레임 남은 거리의 CURSOR.ringLag 만큼 뒤따라온다 (모션 줄이기는 링도 바로)
     -------------------------------------------------------------------------- */
  const CURSOR = { ringLag: 0.18, hover: "a, button, label, summary, [role='button'], [role='tab']", text: "input, textarea, select" };

  function setupCursor() {
    const dot = $(".cursor")[0];
    const ring = $(".cursor-ring")[0];
    if (!dot || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const parts = [dot, ring].filter(Boolean);
    const setState = (name, on) => parts.forEach((el) => el.classList.toggle(name, on));
    const place = (el, x, y) => { el.style.translate = x + "px " + y + "px"; };   // transform 이 아니라 translate — 크게(scale)가 이동 거리까지 키우지 않게
    const lag = util.reduceMotion.matches ? 1 : CURSOR.ringLag;

    /* 점은 마우스 자리에 바로, 링은 매 프레임 남은 거리의 lag 만큼 따라간다 */
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let running = false;
    function frame() {
      place(dot, x, y);
      if (ring) {
        rx += (x - rx) * lag;
        ry += (y - ry) * lag;
        place(ring, rx, ry);
      }
      running = ring ? Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1 : false;
      if (running) requestAnimationFrame(frame);
    }
    document.addEventListener("mousemove", (e) => {
      x = e.clientX;
      y = e.clientY;
      setState("is-visible", true);
      if (running) return;
      running = true;
      requestAnimationFrame(frame);
    }, { passive: true });
    document.addEventListener("mouseover", (e) => {
      /* iframe(전체 프로젝트 화면) 위 — 그 안의 서브페이지가 자기 커서를 그린다. 여기 것은 숨겨 두 개가 되지 않게 */
      if (e.target.tagName === "IFRAME") {
        setState("is-visible", false);
        return;
      }
      setState("is-hover", !!e.target.closest(CURSOR.hover));
      setState("is-text", !!e.target.closest(CURSOR.text));
    });
    document.documentElement.addEventListener("mouseleave", () => setState("is-visible", false));
  }

  /* --------------------------------------------------------------------------
     맨 위로 버튼 — 맨 위(TOP_BTN.showAt 이하)에서는 .top-btn.is-hidden, 내려가면 오른쪽 아래에 나타난다 (이동은 common.js 앵커 스크롤)
     -------------------------------------------------------------------------- */
  const TOP_BTN = { showAt: 400 };

  function bindTopBtn() {
    const $btn = $(".top-btn");
    if (!$btn.length) return;
    let ticking = false;
    function update() {
      $btn.toggleClass("is-hidden", window.scrollY <= TOP_BTN.showAt);
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  setupHeroCover();
  setupHeroLetters();
  setupCount();
  setupCareerLine();
  bindTabs();
  bindFilter();
  setupStack();
  setupFill();
  bindPageScreen();
  bindEmbedEscape();
  bindProjectModal();
  bindContact();
  bindTopBtn();
  setupCursor();
})(jQuery);
