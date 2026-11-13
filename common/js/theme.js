/**
 * 첫 화면 전 표시 — 팝업 안(iframe)에서 열린 서브페이지면 html[data-embed] 로 헤더 · 푸터를 감춘다 (메인 「전체 프로젝트」 화면)
 * <head> 에서 바로 실행한다 (본문 끝에서 실행하면 헤더가 보였다가 사라진다)
 */
(function () {
  "use strict";

  if (window.self !== window.top) document.documentElement.setAttribute("data-embed", "");
})();
