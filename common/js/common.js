/**
 * common.js — 공통 UI 스크립트 (jQuery 3.x · GSAP 3.x + ScrollTrigger)
 *
 * 퍼블리싱 킷 common.js 에서 이 사이트가 쓰는 모듈만 남겼다 (유틸 · 앵커 스크롤 · 진입 모션 · 모달 · 공개 API 는 킷 그대로)
 * - 프로젝트마다 다른 값은 「0. 설정」만 고친다
 * - 모듈은 서로 독립이다. 마크업이 없으면 조용히 건너뛴다
 * - 모듈 머리 주석에 마크업 · 상태 클래스 · CSS 와 맞출 값 · 보내는 이벤트를 적는다
 * - 메인 섹션 전용 동작(히어로 · 쌓이는 카드 · 문장 채우기 · 모달 내용 · 메시지 보내기 · 맨 위로 · 마우스 커서)은 main.js
 *
 * 공개 API — window.UI (이름은 「0. 설정」 API_NAME). HTML 의 onclick 으로 부르지 않는다
 *   UI.init(root) ................... root 안의 새 마크업 초기화 — 열린 모달 · 진입 모션. root 는 선택자 · 요소 · jQuery (없으면 문서 전체)
 *   UI.destroy(root) ................ root 안의 스크롤 트리거 · 열린 모달을 걷어낸다 — 영역을 지우거나 바꾸기 전에
 *   UI.refresh() .................... 스크롤 트리거 시작점을 문서 순서로 다시 계산 — 높이가 바뀐 뒤(탭 전환 · 필터)
 *   UI.pinSpacer(el) ................ 핀 대상의 부모 .pin-spacer — ScrollTrigger 핀 옵션 pinSpacer 에 넘긴다
 *   UI.modal.open(target, opener) ... 모달 열기. opener 는 닫을 때 포커스가 돌아갈 요소 (기본 — 지금 포커스가 있는 요소)
 *   UI.modal.close(target) .......... 모달 닫기 — target 을 생략하면 맨 위 모달
 *   UI.gnb.close() .................. 600↓ 메뉴 닫기
 *   UI.util ......................... 페이지 JS 가 같이 쓰는 유틸 — mqMobile · reduceMotion(MediaQueryList) · remPx() · setCurrent($items, index) · ensureGsap()
 *
 * 보내는 이벤트 — 네이티브 CustomEvent(bubbles). 이름은 ui:모듈-동작
 *   ui:modal-open · ui:modal-close ........... .modal 에서
 *
 * 의존
 * - jQuery — 필수
 * - gsap.min.js · ScrollTrigger.min.js — 현재 섹션 메뉴 · 진입 모션. 없으면 메뉴 표시 없이 · 모션 없이 최종 상태로 보인다
 * - lenis.min.js — 부드러운 스크롤. 없으면 기본 스크롤
 *
 * 로드 순서 — (head) theme.js … (body 끝) jquery → gsap.min.js · ScrollTrigger.min.js → lenis.min.js → (emailjs) → common.js → main.js
 *
 * 작성 규칙
 * - 전역은 공개 API 하나뿐이다. 이 파일은 IIFE 하나로 감싸고 jQuery 를 $ 로 받는다
 * - JS 는 상태 클래스와 ARIA · CSS 변수만 바꾼다. 모양은 CSS 가 그린다
 * - 상태를 바꾸는 곳은 모듈마다 함수 하나 — 클릭 · 키보드 · 공개 API 가 모두 그 함수를 부른다
 * - bindXxx() 는 이벤트(한 번), setupXxx($root) 는 시작 상태(새 마크업마다 — 처리한 요소는 WeakSet 으로 건너뛴다)
 *
 * 구성
 *   0. 설정 ........... 프로젝트 값
 *   1. 유틸 ........... matchMedia · rem → px · 범위 찾기 · 처음 보는 요소 · 이벤트 보내기 · 전환 감지 · 바깥 잠금(inert) · GSAP 준비 · 전환 끝 대기 · 현재 항목
 *   2. GNB ............ 600↓ 메뉴 · 첫 진입 내려오기 · 스크롤 상태(위에 붙음) · 현재 섹션 메뉴
 *   4. 콘텐츠 ......... 부드러운 스크롤(Lenis) · 앵커 스크롤 · 진입 모션 · 글자 나눠 등장
 *   5. 오버레이 ....... 모달(.modal)
 *   6. 공개 API ....... window.UI
 *   7. 초기화
 */
(function ($) {
  "use strict";

  /* ==========================================================================
     0. 설정 — 프로젝트마다 다른 값은 여기만 고친다
     ========================================================================== */
  const MQ_MOBILE = "(max-width: 1024px)";   // 모바일 분기 — CSS 브레이크포인트와 같은 값
  const MQ_SMALL = "(max-width: 600px)";     // 햄버거 메뉴 구간 — CSS 와 같은 값
  const MOTION_START = "top 90%";            // 진입 모션 시작선 — 블록 윗변이 화면 위에서 90% 지점에 닿을 때
  const GNB_DROP = 1.2;                      // 페이지 첫 진입 — 헤더가 위에서 내려오는 초
  const SMOOTH_SCROLL = { lerp: 0.1 };      // 부드러운 스크롤 — 한 프레임에 남은 거리를 따라가는 비율 (작을수록 더 미끄러진다)
  const SMOOTH_SCROLL_SKIP = "textarea, select, [data-lenis-prevent]";   // 부드러운 스크롤을 건너뛰는 곳 — 그 안의 휠은 기본 스크롤
  const API_NAME = "UI";                     // 공개 API 전역 이름

  /* ==========================================================================
     1. 유틸
     ========================================================================== */
  const mqMobile = window.matchMedia(MQ_MOBILE);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /** 1rem 의 px — 브라우저 글자 크기 설정에 따라 다르다 */
  function remPx() {
    return parseFloat($("html").css("font-size"));
  }

  /** $root 안에서 sel 에 맞는 요소 — $root 자신도 포함 */
  function findIn($root, sel) {
    return $root.find(sel).addBack(sel);
  }

  /**
   * 처음 보는 요소만 남긴다 — seen 에 없는 것을 골라 seen 에 넣는다. setupXxx 가 같은 마크업에 다시 불려도 한 번만 처리하게
   * @param {jQuery}  $els
   * @param {WeakSet} seen
   * @returns {jQuery}
   */
  function firstSeen($els, seen) {
    return $els.filter(function () {
      if (seen.has(this)) return false;
      seen.add(this);
      return true;
    });
  }

  /** 상태 변화를 알린다 — 네이티브 CustomEvent 라 jQuery .on · addEventListener 둘 다 받는다 */
  function emit(el, name) {
    el.dispatchEvent(new CustomEvent(name, { bubbles: true }));
  }

  /** 전환 모션이 있는 요소인지 — CSS 에 transition 이 없으면(0s) transitionend 가 오지 않으므로 바로 숨긴다 */
  function hasTransition(el) {
    return parseFloat($(el).css("transition-duration")) > 0;
  }

  /** el 바깥을 inert 로 — el 에서 body 까지 올라가며 각 단계의 형제 요소에 건다 */
  function setOutsideInert(el, on) {
    $(el).parentsUntil("body").addBack().each(function () {
      $(this).siblings().not("script").prop("inert", on);
    });
  }

  /**
   * 바깥 잠금 — body.is-fixed + el 바깥 inert. MO GNB 패널 · 모달 공용
   * 잠근 요소를 쌓아 두고, 하나를 풀면 남은 맨 위 요소를 다시 잠근다 (서로 풀어 버리지 않게)
   */
  const lockers = [];
  function lockOutside(el, on) {
    const i = lockers.indexOf(el);
    if (on === (i !== -1)) return;   // 이미 그 상태
    if (on) {
      /* 이전 잠금이 새 요소를 inert 로 막고 있으면 먼저 푼다 (모달 위에 모달) */
      if (lockers.length) setOutsideInert(lockers[lockers.length - 1], false);
      lockers.push(el);
      setOutsideInert(el, true);
    } else {
      lockers.splice(i, 1);
      setOutsideInert(el, false);
      if (lockers.length) setOutsideInert(lockers[lockers.length - 1], true);
    }
    $("body").toggleClass("is-fixed", lockers.length > 0);
    if (lenis) {
      if (lockers.length) lenis.stop();
      else lenis.start();
    }
  }

  /** GSAP + ScrollTrigger 준비 — 쓸 수 있으면 true. 처음 부를 때 플러그인 등록 · 설정을 한 번 한다 */
  let gsapReady = false;
  function ensureGsap() {
    if (!window.gsap || !window.ScrollTrigger) return false;
    if (!gsapReady) {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });   // MO 주소창이 접혔다 펴질 때는 다시 계산하지 않는다
      gsapReady = true;
    }
    return true;
  }

  /**
   * 전환이 끝나면 done — el 자신의 prop 전환만 본다 (안쪽 요소의 전환은 지나친다)
   * @param {jQuery}   $el
   * @param {string}   prop 기다릴 속성 (transition-property 중 하나)
   * @param {string}   ns   이벤트 이름공간 — 같은 요소에 다시 걸면 앞의 것을 뗀다
   * @param {Function} done
   */
  function afterTransition($el, prop, ns, done) {
    $el.off("transitionend." + ns).on("transitionend." + ns, (e) => {
      if (e.target !== $el[0] || e.originalEvent.propertyName !== prop) return;
      $el.off("transitionend." + ns);
      done();
    });
  }

  /** 목록에서 index 번째만 현재 — .is-active + aria-current="true", 나머지는 둘 다 뗀다 */
  function setCurrent($items, index) {
    $items.each(function (i) {
      const on = i === index;
      $(this).toggleClass("is-active", on).attr("aria-current", on ? "true" : null);
    });
  }

  /**
   * 핀 자리 지킴 요소 — 핀 대상을 HTML 에서 직접 감싼 .pin-spacer. 핀 옵션에 pinSpacer: UI.pinSpacer(대상) 으로 넘긴다
   * @param {Element} el 핀 대상
   * @returns {Element|undefined} 래퍼가 없으면 undefined — ScrollTrigger 가 스스로 만든다
   */
  function pinSpacer(el) {
    const parent = el && el.parentElement;
    return parent && parent.classList.contains("pin-spacer") ? parent : undefined;
  }

  /* ==========================================================================
     2. GNB
     ========================================================================== */

  /* --------------------------------------------------------------------------
     600↓ 메뉴 — 햄버거 .menu-btn(aria-controls="gnbMenu")가 .gnb.is-open + aria-expanded 를 바꾼다
     · 메뉴 링크를 누르거나 Esc · 600 초과로 넓어지면 닫는다
     -------------------------------------------------------------------------- */
  let setGnbOpen = null;   // bindGnb 가 채운다 — UI.gnb.close 가 부른다

  function closeGnb() {
    if (setGnbOpen) setGnbOpen(false);
  }

  function bindGnb() {
    const $gnb = $(".gnb").first();
    const $btn = $gnb.find(".menu-btn");
    if (!$gnb.length || !$btn.length) return;

    setGnbOpen = (open, focusBtn) => {
      $gnb.toggleClass("is-open", open);
      $btn.attr("aria-expanded", String(open));
      if (!open && focusBtn) $btn.trigger("focus");
    };

    $btn.on("click", () => setGnbOpen(!$gnb.hasClass("is-open")));
    $gnb.on("click", ".depth1-link", () => setGnbOpen(false));
    $(document).on("keydown", (e) => {
      if (e.key !== "Escape" || e.isDefaultPrevented() || !$gnb.hasClass("is-open")) return;
      setGnbOpen(false, true);
    });
    window.matchMedia(MQ_SMALL).addEventListener("change", (e) => { if (!e.matches) setGnbOpen(false); });
  }

  /**
   * 첫 진입 — 헤더가 위에서 내려온다 (GNB_DROP). 숨김(위로 올림)은 CSS 가 처음부터, 여기서는 .is-shown 을 붙이며 제자리로
   * gsap 이 없거나 reduceMotion 이면 .is-shown 만 바로
   */
  function introGnb() {
    const gnb = $(".gnb")[0];
    if (!gnb || gnb.classList.contains("is-shown")) return;
    if (!ensureGsap() || reduceMotion.matches) {
      gnb.classList.add("is-shown");
      return;
    }
    gnb.classList.add("is-shown");
    gsap.fromTo(gnb, { yPercent: -100 }, { yPercent: 0, duration: GNB_DROP, ease: "power2.out", clearProps: "transform" });
  }

  /* --------------------------------------------------------------------------
     스크롤 상태 — 헤더가 화면 위끝에 붙어 있으면 .gnb.is-stuck(반투명 흐림 바탕)
     -------------------------------------------------------------------------- */
  function bindGnbScroll() {
    const $gnb = $(".gnb").first();
    if (!$gnb.length) return;
    let ticking = false;

    function update() {
      $gnb.toggleClass("is-stuck", $gnb[0].getBoundingClientRect().top <= 0);
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* --------------------------------------------------------------------------
     현재 섹션 메뉴 — 메뉴 링크(href="#id")의 섹션이 화면 가운데를 지나는 동안 그 링크에 .is-active + aria-current="true"
     · ScrollTrigger 가 없으면 표시하지 않는다
     -------------------------------------------------------------------------- */
  function setupGnbCurrent() {
    const $links = $(".gnb .depth1-link");
    if (!$links.length || !ensureGsap()) return;
    $links.each(function (i) {
      const target = document.getElementById(($(this).attr("href") || "").slice(1));
      if (!target) return;
      ScrollTrigger.create({
        trigger: target,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) setCurrent($links, i);
          else if (!$links.filter(".is-active").not($links.eq(i)).length) setCurrent($links, -1);
        }
      });
    });
  }

  /* ==========================================================================
     4. 콘텐츠
     ========================================================================== */

  /* --------------------------------------------------------------------------
     부드러운 스크롤 — Lenis(common/js/lib/lenis.min.js)가 마우스 휠 스크롤을 부드럽게 감속시킨다
     · GSAP 이 있으면 gsap.ticker 로 돌리고 스크롤마다 ScrollTrigger.update — 핀 · 진입 모션이 어긋나지 않게
     · 터치는 기기 기본 스크롤 그대로(Lenis 기본값), 모션 줄이기 · Lenis 없음은 아무것도 하지 않는다
     · 모달이 열려 있는 동안은 멈춘다(lockOutside) — 모달 안 스크롤은 기본 스크롤 ([data-lenis-prevent])
     · 텍스트 영역 · 셀렉트 안에서는 휠이 그 칸을 스크롤한다 (SMOOTH_SCROLL_SKIP — 긴 메시지를 쓰면 칸 안이 내려간다)
     · 앵커 스크롤도 이 인스턴스로 이동한다
     -------------------------------------------------------------------------- */
  let lenis = null;

  function setupSmoothScroll() {
    if (lenis || !window.Lenis || reduceMotion.matches) return;
    lenis = new window.Lenis({
      lerp: SMOOTH_SCROLL.lerp,
      prevent: (node) => !!(node.closest && node.closest(SMOOTH_SCROLL_SKIP))   // 이 안에서는 휠이 그 칸을 스크롤한다
    });
    if (ensureGsap()) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const loop = (time) => {
        lenis.raf(time);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  /* --------------------------------------------------------------------------
     앵커 스크롤 — 같은 페이지 #id 링크(약관 조항 목차 등) 클릭 시 부드럽게 이동 + 포커스
     · 멈추는 위치는 대상의 scroll-margin-top(CSS)
     · 클릭에만 부드럽게 이동 (Tab · 스킵 링크는 즉시)
     · 주소창에 #id 를 남기지 않는다 (뒤로가기 이력). reduceMotion 은 즉시 이동
     · 포커스 이동 — 키보드 사용자가 그 조항부터 Tab 을 이어가게 (tabindex -1 을 잠시 주고 blur 에 뗀다)
     · 스킵 링크(.skip)는 제외
     -------------------------------------------------------------------------- */
  function bindAnchorScroll() {
    $(document).on("click", "a[href^=\"#\"]", function (e) {
      const $link = $(this);
      if ($link.hasClass("skip")) return;
      const id = $link.attr("href").slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const $target = $(target);
      const offset = parseFloat($target.css("scroll-margin-top")) || 0;
      const top = $target.offset().top - offset;
      if (lenis) lenis.scrollTo(top);
      else window.scrollTo({ top: top, behavior: reduceMotion.matches ? "auto" : "smooth" });
      if (!$target.is("[tabindex]")) {
        $target.attr("tabindex", "-1").one("blur", function () { $(this).removeAttr("tabindex"); });
      }
      target.focus({ preventScroll: true });
    });
  }

  /* --------------------------------------------------------------------------
     진입 모션 — 떠오를 블록에 data-motion, 자식을 차례로 띄우는 묶음은 부모 data-motion-group="row | each". 화면에 들어오면 .is-shown (한 번만)
     · 감지는 GSAP ScrollTrigger — 블록 윗변이 화면의 MOTION_START 선을 지나면 켠다
     · 차례는 자식의 순번 변수 --motion-order(0, 1, 2 …) — CSS 가 순번 × --motion-step 만큼 늦춘다 (간격은 CSS 한 곳)
     · 순서 묶음(each)은 부모가 시작점 — 자식 순번은 등록 때 마크업 순서대로 적고, 부모 윗변이 선을 지나면 자식 전부에 .is-shown 을 한 번에 붙인다.
     · 줄 묶음(data-motion-group="row")만 자식이 시작점 — 같은 줄 자식은 함께 선을 지나 한 무리로 묶이고, 무리 안에서 문서 순서대로 순번을 적고 .is-shown (줄 수 · 열 수가 반응형으로 바뀌어도 그대로). 앞 무리 차례가 다 시작되기 전에 들어온 무리(스크롤 복원)는 순번을 이어 매긴다
     · 이미 지나친 블록(스크롤 복원 · 앵커 이동)은 바로 .is-shown. gsap · ScrollTrigger 가 없거나 reduceMotion 이면 전부 바로 .is-shown
     · 트리거 등록은 한 프레임(rAF) 뒤 — 페이지 JS 의 핀이 끼운 여백을 반영한 레이아웃으로 잰다
     · 숨김(opacity 0 · 아래로)은 CSS 가 처음부터 — 이 모듈은 .is-shown 과 순번 --motion-order 만 붙인다
     · 블록을 새로 그린 뒤 UI.init(root) 를 부르면 새 블록만 등록된다. 이미 등록한 묶음에 자식을 덧붙인 뒤(더보기 · 무한 스크롤)도 같다 — 새 자식만 이어서 등록 (each 는 묶음이 이미 떴으면 새 자식끼리 차례로 바로, row 는 새 자식이 줄마다 들어올 때)
     · 높이가 바뀌는 동작(탭 · 아코디언) 뒤에는 UI.refresh()
     · UI.destroy(root) 는 root 안의 진입 모션 트리거와 등록 기억을 함께 지운다 — 틀(data-motion)을 남기고 안쪽만 바꿔도 UI.init(root) 가 틀을 다시 등록한다
     -------------------------------------------------------------------------- */
  const motionSeen = new WeakSet();   // 등록한 블록 · 묶음 자식

  function setupMotion($root) {
    /* 시작점 — 묶음 부모와, 묶음 자식이 아닌 data-motion 블록 */
    const $items = findIn($root, "[data-motion-group], [data-motion]").filter(function () {
      return !motionSeen.has(this) && !$(this).parent().is("[data-motion-group]");
    });
    /* 이미 등록한 묶음에 나중에 붙은 자식 — root 안(또는 root 자신)의 묶음 자식과, 묶음 자식인 root */
    const $late = findIn($root, "[data-motion-group]").children()
      .add($root.filter(function () { return $(this).parent().is("[data-motion-group]"); }))
      .filter(function () { return !motionSeen.has(this) && motionSeen.has(this.parentElement); });
    if (!$items.length && !$late.length) return;
    $items.each(function () {
      motionSeen.add(this);
      if ($(this).is("[data-motion-group]")) $(this).children().each(function () { motionSeen.add(this); });
    });
    $late.each(function () { motionSeen.add(this); });

    /** 시작점 하나가 띄우는 요소 — 묶음이면 자식 전부(그때의 자식), 아니면 자신 */
    const targets = (el) => ($(el).is("[data-motion-group]") ? $(el).children() : $(el));

    /** 나중에 붙은 자식을 묶음별로 */
    const lateGroups = new Map();
    $late.each(function () {
      const group = this.parentElement;
      if (!lateGroups.has(group)) lateGroups.set(group, []);
      lateGroups.get(group).push(this);
    });

    /* 순서 묶음(each) — 자식 순번을 마크업 순서대로 */
    $items.filter("[data-motion-group=\"each\"]").each(function () { setMotionOrder($(this).children()); });

    if (reduceMotion.matches || !ensureGsap()) {
      $items.each(function () { targets(this).addClass("is-shown"); });
      $late.addClass("is-shown");
      return;
    }

    /* each 에 나중에 붙은 자식 — 묶음이 이미 떴으면 새 자식끼리 차례로 바로, 아직이면 순번만 이어서 매긴다(묶음이 뜰 때 함께) */
    lateGroups.forEach((children, group) => {
      if (!$(group).is("[data-motion-group=\"each\"]")) return;
      if ($(group).children(".is-shown").length) {
        setMotionOrder($(children));
        $(children).addClass("is-shown");
      } else {
        setMotionOrder($(group).children());
      }
    });

    /* 한 프레임 뒤 등록 */
    requestAnimationFrame(() => {
      $items.each(function () {
        const el = this;
        if ($(el).is("[data-motion-group=\"row\"]")) return initMotionRow(el, $(el).children().get());
        const show = () => targets(el).addClass("is-shown");
        const trigger = ScrollTrigger.create({ trigger: el, start: MOTION_START, once: true, onEnter: show });
        /* 시작선을 이미 지난 블록 */
        if (trigger.progress > 0) show();
      });
      /* row 에 나중에 붙은 자식 — 새 자식만 줄마다 */
      lateGroups.forEach((children, group) => {
        if ($(group).is("[data-motion-group=\"row\"]")) initMotionRow(group, children);
      });
    });
  }

  /* --------------------------------------------------------------------------
     글자 나눠 등장 — [data-split] 제목의 글자를 .char 로 나눈다. 진입 모션으로 .is-shown 이 붙으면 글자가 차례로 올라온다(모양은 CSS)
     · 함께 data-motion="custom" 을 붙인다 (묶음 자식이면 묶음 차례에 맞춰, 아니면 블록 단독으로 켜진다)
     · 단어는 .word 로 묶어 줄바꿈이 단어 가운데서 일어나지 않게, 글자 순번은 --char-i
     · 스크린리더는 숨김 글자(.blind)로 문장을 한 번만 읽는다 — 나눈 글자는 aria-hidden
     -------------------------------------------------------------------------- */
  const splitSeen = new WeakSet();

  function setupSplitText($root) {
    firstSeen(findIn($root, "[data-split]"), splitSeen).each(function () {
      const text = this.textContent.replace(/\s+/g, " ").trim();
      const $read = $("<span>", { "class": "blind", text: text });
      const $show = $("<span>", { "aria-hidden": "true" });
      let index = 0;
      text.split(" ").forEach((word, w) => {
        if (w) $show.append(" ");
        const $word = $("<span>", { "class": "word" });
        Array.from(word).forEach((ch) => {
          const $char = $("<span>", { "class": "char", text: ch });
          $char[0].style.setProperty("--char-i", index++);
          $word.append($char);
        });
        $show.append($word);
      });
      $(this).empty().append($read, $show);
    });
  }

  /** 묶음 자식 순번(--motion-order) — 마크업 순서대로, 숨긴 자식(display: none)은 건너뛴다 */
  function setMotionOrder($children) {
    let order = 0;
    $children.each(function () {
      if (getComputedStyle(this).display !== "none") this.style.setProperty("--motion-order", order++);
    });
  }

  const motionRowNext = new WeakMap();   // 줄 묶음 → 다음 자식이 뜰 수 있는 가장 이른 시각(ms)

  /** 줄 묶음 — 자식마다 시작선을 재고, 함께 들어온 자식(한 줄)끼리 차례로 */
  function initMotionRow(el, children) {
    /* 순번은 문서 순서로 (스크롤 복원 때는 아래 자식부터 넘어온다) — 화면 위로 지나간 자식은 순번 없이(지연 0) 바로.
       앞 무리 차례가 다 시작되기 전에 들어온 무리(스크롤이 몇 번에 나눠 복원될 때 · 덧붙인 자식)는 순번을 앞 무리 뒤로 이어 매긴다 */
    const show = (batch) => {
      const now = performance.now();
      const step = motionStep(el);
      let order = step ? Math.max(0, ((motionRowNext.get(el) || 0) - now) / step) : 0;
      $(el).children().filter(batch).not(".is-shown").each(function () {
        if (this.getBoundingClientRect().bottom > 0) this.style.setProperty("--motion-order", +(order++).toFixed(3));
        $(this).addClass("is-shown");
      });
      motionRowNext.set(el, now + order * step);
    };
    const triggers = ScrollTrigger.batch(children, { start: MOTION_START, once: true, onEnter: show });
    /* 시작선을 이미 지난 자식 */
    show(triggers.filter((trigger) => trigger.progress > 0).map((trigger) => trigger.trigger));
  }

  /** 묶음 차례 간격(--motion-step, CSS) — ms */
  function motionStep(el) {
    const value = getComputedStyle(el).getPropertyValue("--motion-step").trim();
    return (parseFloat(value) || 0) * (/ms$/.test(value) ? 1 : 1000);
  }

  /* ==========================================================================
     5. 오버레이
     ========================================================================== */

  /* --------------------------------------------------------------------------
     모달 — <div class="modal" id hidden><div class="modal-box" role="dialog" aria-modal="true">…</div></div>
     · 여는 버튼: aria-haspopup="dialog" + aria-controls="모달 id". 닫는 버튼: .modal 의 .close-btn 또는 data-modal-close
       (모달 안에 자체 닫기 버튼을 가진 부품이 들어가면 그 부품은 .close-btn 대신 자기 역할 이름을 쓴다)
     · 코드로 열고 닫기: UI.modal.open("#id") · UI.modal.close() (맨 위) · UI.modal.close("#id")
     · 열림: hidden 해제 + .is-open + body.is-fixed + 바깥 inert, 포커스는 닫기 버튼(없으면 .modal-box — tabindex -1)
     · 닫기: 닫는 버튼 · 딤 클릭 · Esc. 포커스는 연 버튼으로
     · 중첩: 모달 안에서 다른 모달을 열면 아래 모달은 열린 채 남고, 맨 위 모달만 .is-active (딤은 .is-active 에만 그린다)
       닫기 · Esc · 딤 클릭은 맨 위 모달만 닫고, 포커스는 그 모달을 연 버튼(아래 모달 안)으로
     · 페이드는 CSS(opacity 전환). JS 는 hidden 순서만 — 닫을 때 transitionend 뒤 hidden, reduceMotion 은 바로
     · 숨길 때 iframe 을 새 노드로 바꿔 영상을 멈추고, 본문(.scroll-box) 스크롤을 맨 위로
     · 채울 내용은 개발 담당 — 여기서는 열고 닫기만
     · hidden 없이 마크업된 모달(팝업 화면 등)은 처음부터 연 상태
     · 이벤트 — .modal 에서 ui:modal-open · ui:modal-close
     -------------------------------------------------------------------------- */
  const modalStack = [];               // 열린 모달 { $modal, $opener } — 마지막이 맨 위
  const modalSeen = new WeakSet();     // 시작 상태를 본 .modal

  /** 맨 위 모달만 .is-active — 딤 · 포커스 대상 */
  function activateModal() {
    modalStack.forEach((item, i) => item.$modal.toggleClass("is-active", i === modalStack.length - 1));
  }

  /**
   * 모달 열기
   * @param {string|Element|jQuery} target .modal
   * @param {string|Element|jQuery|null} [opener] 닫을 때 포커스가 돌아갈 요소. 생략하면 지금 포커스가 있는 요소, null 이면 돌려주지 않는다
   */
  function openModal(target, opener) {
    const $modal = $(target).first();
    if (!$modal.hasClass("modal")) return;
    if (modalStack.some((item) => item.$modal[0] === $modal[0])) return;   // 이미 열려 있음
    const $opener = $(opener === undefined ? document.activeElement : opener).not("body");
    modalSeen.add($modal[0]);
    modalStack.push({ $modal: $modal, $opener: $opener });
    /* 페이드 인 — display none → flex 로 바뀐 opacity 0 상태를 브라우저가 한 번 그려야 1 로의 전환이 일어난다 (강제 레이아웃 1회) */
    $modal.prop("hidden", false);
    if (!reduceMotion.matches) void $modal[0].offsetHeight;
    $modal.addClass("is-open");
    activateModal();
    lockOutside($modal[0], true);
    /* 포커스 — 닫는 버튼, 없으면 창 상자 자체(tabindex -1) */
    const $focus = $modal.find(".close-btn, [data-modal-close]").first();
    if ($focus.length) $focus.trigger("focus");
    else {
      const box = $modal.find(".modal-box")[0] || $modal[0];
      if (!box.hasAttribute("tabindex")) box.setAttribute("tabindex", "-1");
      box.focus();
    }
    emit($modal[0], "ui:modal-open");
  }

  /** 숨긴 뒤 정리 — 영상 정지 · 본문 스크롤 복귀 */
  function hideModal($modal) {
    $modal.prop("hidden", true);
    /* 영상 정지 — iframe 을 같은 속성의 새 노드로 바꾼다 */
    $modal.find("iframe").each(function () { $(this).replaceWith(this.cloneNode(true)); });
    /* 다음에 열 때 본문이 맨 위부터 보이게 */
    $modal.find(".scroll-box").scrollTop(0);
  }

  /**
   * 모달 닫기
   * @param {string|Element|jQuery} [target] 닫을 .modal — 생략하면 맨 위 모달. 맨 위가 아니면 포커스는 그대로 둔다
   */
  function closeModal(target) {
    const el = target === undefined ? null : $(target)[0];
    if (target !== undefined && !el) return;   // 넘긴 대상이 없으면 아무것도 닫지 않는다
    const index = el ? modalStack.findIndex((item) => item.$modal[0] === el) : modalStack.length - 1;
    if (index < 0) return;
    const isTop = index === modalStack.length - 1;
    const item = modalStack.splice(index, 1)[0];
    const $modal = item.$modal;
    /* 페이드 아웃 — .is-open 을 떼고 전환이 끝나면 숨긴다. 그 사이 다시 열렸으면(.is-open) 그대로 둔다 */
    $modal.removeClass("is-open is-active");
    if (reduceMotion.matches || !hasTransition($modal[0])) {
      hideModal($modal);
    } else {
      afterTransition($modal, "opacity", "modal", () => {
        if (!$modal.hasClass("is-open")) hideModal($modal);
      });
    }
    activateModal();
    lockOutside($modal[0], false);
    if (isTop && item.$opener.length) item.$opener.trigger("focus");
    emit($modal[0], "ui:modal-close");
  }

  function bindModal() {
    /* 여는 버튼 */
    $(document).on("click", "[aria-haspopup=\"dialog\"][aria-controls]", function (e) {
      const $modal = $(document.getElementById($(this).attr("aria-controls")));
      if (!$modal.hasClass("modal")) return;
      e.preventDefault();
      openModal($modal, $(this));
    });
    /* 닫는 버튼 · 딤(박스 바깥) — 맨 위 모달만. 딤은 누른 곳 · 뗀 곳이 둘 다 딤일 때만 (입력칸에서 끌다 딤에서 떼면 닫지 않는다) */
    let downOnDim = false;
    $(document).on("pointerdown", (e) => {
      const item = modalStack[modalStack.length - 1];
      downOnDim = !!item && e.target === item.$modal[0];
    });
    $(document).on("click", (e) => {
      const item = modalStack[modalStack.length - 1];
      if (!item) return;
      if ($(e.target).closest("[aria-haspopup=\"dialog\"][aria-controls]").length) return;
      const onDim = e.target === item.$modal[0] && downOnDim;
      downOnDim = false;
      if ($(e.target).closest(".close-btn, [data-modal-close]").length || onDim) closeModal();
    });

    $(document).on("keydown", (e) => {
      if (e.key !== "Escape" || !modalStack.length) return;
      e.preventDefault();   // 같은 Esc 로 다른 부품(드롭다운 · 펼친 창)까지 닫히지 않게 — 그쪽은 e.isDefaultPrevented() 로 지나친다
      closeModal();
    });
  }

  /** hidden 없이 마크업된 모달은 연다 — 처음 보는 모달만 (닫히는 중인 모달을 다시 열지 않게) */
  function setupModal($root) {
    firstSeen(findIn($root, ".modal"), modalSeen).each(function () {
      if (!this.hidden) openModal(this, null);
    });
  }

  /* ==========================================================================
     6. 공개 API — 전역은 이것 하나 (목록 · 쓰는 법은 머리 주석)
     ========================================================================== */

  /** 스크롤 트리거 시작점 다시 계산 — 문서 순서로 정렬해 잰다 */
  function refresh() {
    if (!ensureGsap()) return;
    ScrollTrigger.sort((x, y) => {
      if (!x.trigger || !y.trigger || x.trigger === y.trigger) return 0;
      return x.trigger.compareDocumentPosition(y.trigger) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    ScrollTrigger.refresh();
  }

  /**
   * root 안의 새 마크업 초기화 — 처리한 요소는 건너뛰므로 두 번 불러도 된다
   * @param {string|Element|jQuery} [root] 없으면 문서 전체
   */
  function init(root) {
    const $root = $(root || document);
    setupModal($root);
    setupSplitText($root);   // 진입 모션보다 먼저 — 나눈 글자가 처음부터 숨은 상태로 등록되게
    setupMotion($root);
    refresh();
  }

  /**
   * root 안의 스크롤 트리거 · 열린 모달을 걷어낸다 — 영역을 지우거나 바꾸기 전에 부른다
   * @param {string|Element|jQuery} root
   */
  function destroy(root) {
    const roots = $(root).get();
    if (!roots.length) return;
    const inRoot = (el) => !!el && roots.some((r) => r === el || $.contains(r, el));

    modalStack.slice().reverse().forEach((item) => { if (inRoot(item.$modal[0])) closeModal(item.$modal); });
    if (ensureGsap()) {
      ScrollTrigger.getAll().forEach((trigger) => { if (inRoot(trigger.trigger)) trigger.kill(true); });
    }
    roots.forEach((r) => {
      findIn($(r), "[data-motion], [data-motion-group], [data-motion-group] > *").each(function () { motionSeen.delete(this); });
    });
    refresh();
  }

  window[API_NAME] = Object.freeze({
    init: init,
    destroy: destroy,
    refresh: refresh,
    pinSpacer: pinSpacer,
    util: Object.freeze({
      mqMobile: mqMobile,
      reduceMotion: reduceMotion,
      remPx: remPx,
      setCurrent: setCurrent,
      ensureGsap: ensureGsap
    }),
    modal: Object.freeze({
      open: openModal,
      close: closeModal
    }),
    gnb: Object.freeze({
      close: closeGnb
    })
  });

  /* ==========================================================================
     7. 초기화 — 헤더 · 푸터가 페이지 안에 있어 조각을 불러오지 않는다
     ========================================================================== */
  setupSmoothScroll();
  introGnb();
  bindModal();
  bindGnb();
  bindAnchorScroll();
  /* ↑ Esc 를 받는 모듈(bindGnb)은 bindModal 다음에 — 모달이 받은 Esc(preventDefault)를 지나치게. 순서를 바꾸지 않는다 */
  bindGnbScroll();
  setupGnbCurrent();
  init(document);

  /* 늦게 오는 이미지 · 폰트로 높이가 바뀐다 — load 뒤 한 번 더 */
  window.addEventListener("load", refresh);
})(jQuery);
