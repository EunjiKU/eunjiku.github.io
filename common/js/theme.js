/**
 * 테마 — 저장해 둔 다크 모드를 첫 화면을 그리기 전에 html[data-theme="dark"] 로 건다 · 팝업 안(iframe)이면 html[data-embed]
 * <head> 에서 바로 실행한다 (본문 끝에서 실행하면 밝은 화면이 먼저 보였다가 바뀐다). 전환 버튼은 common.js 「GNB」
 */
(function () {
  "use strict";

  try {
    if (localStorage.getItem("kej-theme") === "dark") document.documentElement.setAttribute("data-theme", "dark");
  } catch (e) {
    /* 저장소를 쓸 수 없는 환경 — 기본(밝은) 테마 */
  }

  /* 팝업 안(iframe)에서 열린 서브페이지 — html[data-embed] 로 헤더 · 푸터를 감춘다 (메인 「전체 프로젝트」 팝업) */
  if (window.self !== window.top) document.documentElement.setAttribute("data-embed", "");
})();
