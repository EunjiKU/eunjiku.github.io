document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // Navigation - Scroll Effect
  // ========================================
  const nav = document.getElementById('nav');

  const floatingChar = document.getElementById('floatingChar');
  let charVisible = false;

  // 초기 상태: 숨김
  if (floatingChar) {
    floatingChar.style.opacity = '0';
    floatingChar.style.transform = 'translateY(40px) scale(0.8)';
    floatingChar.style.pointerEvents = 'none';
  }

  const navProgress = document.getElementById('navProgress');

  window.addEventListener('scroll', () => {
    // Scroll progress bar
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (navProgress) navProgress.style.width = scrollPercent + '%';

    // Nav scroll effect
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Floating character: 스크롤 시작하면 등장
    if (window.scrollY > 0 && !charVisible) {
      charVisible = true;
      if (floatingChar) {
        floatingChar.style.opacity = '1';
        floatingChar.style.transform = 'translateY(0) scale(1)';
        floatingChar.style.pointerEvents = 'auto';
        floatingChar.classList.add('show');
      }
    } else if (window.scrollY <= 0 && charVisible) {
      charVisible = false;
      if (floatingChar) {
        floatingChar.style.opacity = '0';
        floatingChar.style.transform = 'translateY(40px) scale(0.8)';
        floatingChar.style.pointerEvents = 'none';
        floatingChar.classList.remove('show');
      }
    }
  });

  // ========================================
  // Navigation - Active Link
  // ========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72}px 0px 0px 0px`
  });

  sections.forEach(section => sectionObserver.observe(section));

  // ========================================
  // Mobile Navigation Toggle
  // ========================================
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', '메뉴 열기');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ========================================
  // Counter Animation
  // ========================================
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const duration = 600;
        const step = target / (duration / 16);

        const update = () => {
          current += step;
          if (current >= target) {
            el.textContent = target;
          } else {
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
          }
        };

        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ========================================
  // Project Tabs (실무 / 개인) + 슬라이딩 인디케이터
  // ========================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabIndicator = document.querySelector('.tab-indicator');
  const workGrid = document.getElementById('workGrid');
  const personalGrid = document.getElementById('personalGrid');
  const workFilter = document.getElementById('workFilter');

  function moveIndicator(btn) {
    if (!tabIndicator || !btn) return;
    const tabsRect = btn.parentElement.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    tabIndicator.style.left = (btnRect.left - tabsRect.left) + 'px';
    tabIndicator.style.width = btnRect.width + 'px';
  }

  // 초기 위치 설정
  const initialActiveTab = document.querySelector('.tab-btn.active');
  if (initialActiveTab) {
    // transition 없이 초기 위치 세팅
    tabIndicator.style.transition = 'none';
    setTimeout(() => {
      moveIndicator(initialActiveTab);
      // 다음 프레임에 transition 복원
      requestAnimationFrame(() => {
        tabIndicator.style.transition = '';
      });
    }, 100);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      moveIndicator(btn);

      if (btn.dataset.tab === 'work') {
        workGrid.style.display = '';
        personalGrid.style.display = 'none';
        workFilter.style.display = '';
      } else {
        workGrid.style.display = 'none';
        personalGrid.style.display = '';
        workFilter.style.display = 'none';
      }

    });
  });

  // 리사이즈 시 인디케이터 위치 재계산
  window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) moveIndicator(activeTab);
  });

  // ========================================
  // Project Filter (실무)
  // ========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#workGrid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ========================================
  // Project Detail Modal
  // ========================================
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = modal.querySelector('.modal-backdrop');

  const modalTitle = document.getElementById('modalTitle');
  const modalPeriod = document.getElementById('modalPeriod');
  const modalRole = document.getElementById('modalRole');
  const modalClient = document.getElementById('modalClient');
  const modalDetail = document.getElementById('modalDetail');
  const modalTags = document.getElementById('modalTags');
  const modalUrl = document.getElementById('modalUrl');

  const modalVideoWrap = document.getElementById('modalVideo');
  const modalVideoEl = document.getElementById('modalVideoEl');
  const modalPagesWrap = document.getElementById('modalPagesWrap');
  const modalPagesList = document.getElementById('modalPages');
  const modalContribWrap = document.getElementById('modalContribWrap');
  const modalContribList = document.getElementById('modalContrib');

  function openModal(card) {
    modalTitle.textContent = card.dataset.title || '';
    modalPeriod.textContent = card.dataset.period || '';
    modalRole.textContent = card.dataset.role || '';
    modalClient.textContent = card.dataset.client || '';
    modalDetail.textContent = card.dataset.detail || '';
    modalUrl.href = card.dataset.url || '#';

    // Video
    if (card.dataset.video) {
      modalVideoEl.src = card.dataset.video;
      modalVideoWrap.style.display = '';
    } else {
      modalVideoEl.src = '';
      modalVideoWrap.style.display = 'none';
    }

    // Tags
    modalTags.innerHTML = '';
    (card.dataset.tags || '').split(',').forEach(tag => {
      if (tag.trim()) {
        const span = document.createElement('span');
        span.textContent = tag.trim();
        modalTags.appendChild(span);
      }
    });

    // Pages
    modalPagesList.innerHTML = '';
    if (card.dataset.pages) {
      card.dataset.pages.split('|').forEach(page => {
        const li = document.createElement('li');
        li.textContent = page.trim();
        modalPagesList.appendChild(li);
      });
      modalPagesWrap.style.display = '';
    } else {
      modalPagesWrap.style.display = 'none';
    }

    // Contributions
    modalContribList.innerHTML = '';
    if (card.dataset.contrib) {
      card.dataset.contrib.split('|').forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.trim();
        modalContribList.appendChild(li);
      });
      modalContribWrap.style.display = '';
    } else {
      modalContribWrap.style.display = 'none';
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    // 포커스를 모달 닫기 버튼으로 이동
    setTimeout(() => modalClose.focus(), 100);
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    // 영상 정지
    if (modalVideoEl) {
      modalVideoEl.pause();
      modalVideoEl.src = '';
    }
    // 포커스를 트리거 버튼으로 복원
    if (lastFocusedBtn) lastFocusedBtn.focus();
  }

  // Focus trap: 모달 내부에서만 Tab 순환
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('button, a[href], input, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Attach click to all detail buttons
  let lastFocusedBtn = null;
  document.querySelectorAll('.btn-card-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      lastFocusedBtn = btn;
      const card = btn.closest('.project-card');
      openModal(card);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ========================================
  // Contact Form (EmailJS)
  // ========================================
  const contactForm = document.getElementById('contactForm');
  const PUBLIC_KEY = contactForm.dataset.emailjsPublicKey;
  const SERVICE_ID = contactForm.dataset.emailjsServiceId;
  const TEMPLATE_ID = contactForm.dataset.emailjsTemplateId;

  // EmailJS 초기화
  if (window.emailjs && PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(PUBLIC_KEY);
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '전송 중...';
    btn.disabled = true;

    // EmailJS 키가 미설정이면 데모 모드
    if (!window.emailjs || PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      setTimeout(() => {
        btn.textContent = '키를 먼저 설정해주세요';
        btn.style.background = 'var(--color-accent)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 2000);
      }, 500);
      return;
    }

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm)
      .then(() => {
        btn.textContent = '전송 완료!';
        btn.style.background = '#4ade80';
        btn.style.color = '#fff';
        contactForm.reset();
      })
      .catch(() => {
        btn.textContent = '전송 실패 - 다시 시도해주세요';
        btn.style.background = 'var(--color-accent)';
      })
      .finally(() => {
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 3000);
      });
  });

  // ========================================
  // Smooth scroll for anchor links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ========================================
  // Floating Character - 말풍선 문구 순환
  // ========================================
  const charBubble = document.getElementById('charBubble');
  if (charBubble) {
    const messages = [
      '봐주셔서 감사합니다!',
      '같이 일하면 후회 안 하실걸요?',
      '코드로 증명하는 퍼블리셔입니다!'
    ];
    let msgIndex = 0;

    setInterval(() => {
      charBubble.style.opacity = '0';
      charBubble.style.transform = 'translateY(8px)';
      setTimeout(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        charBubble.textContent = messages[msgIndex];
        charBubble.style.opacity = '1';
        charBubble.style.transform = 'translateY(0)';
      }, 300);
    }, 5000);
  }

});