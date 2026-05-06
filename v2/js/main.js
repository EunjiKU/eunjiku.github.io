document.addEventListener('DOMContentLoaded', () => {

  // ================================
  // Theme toggle
  // ================================
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      if (next === 'dark') root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      try { localStorage.setItem('theme-v2', next); } catch (e) {}
      themeToggle.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
    });
  }

  // ================================
  // Mobile burger menu
  // ================================
  const navBurger = document.getElementById('navBurger');
  const headerNav = document.getElementById('exploreMenu');
  if (navBurger && headerNav) {
    navBurger.addEventListener('click', () => {
      const open = headerNav.classList.toggle('open');
      navBurger.classList.toggle('open');
      navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
      navBurger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    headerNav.querySelectorAll('.header-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        headerNav.classList.remove('open');
        navBurger.classList.remove('open');
        navBurger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ================================
  // Smooth anchor scroll
  // ================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ================================
  // Scroll: progress bar + header border + char visibility
  // ================================
  const header = document.querySelector('.header');
  const progress = document.getElementById('scrollProgress');
  const floatingChar = document.getElementById('floatingChar');
  let charVisible = false;
  let scrollTicking = false;

  function onScroll() {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
    if (progress) progress.style.width = pct + '%';

    if (header) header.style.borderBottomColor = scrollTop > 8 ? 'var(--line)' : 'transparent';

    if (scrollTop > 200 && !charVisible) {
      charVisible = true;
      floatingChar?.classList.add('show');
    } else if (scrollTop <= 200 && charVisible) {
      charVisible = false;
      floatingChar?.classList.remove('show');
    }

    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  // ================================
  // Nav active link (IntersectionObserver)
  // ================================
  const sections = document.querySelectorAll('section[id], .about-track[id]');
  const navLinks = document.querySelectorAll('.header-nav-link');
  if (sections.length && navLinks.length) {
    const sectionObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
    sections.forEach(s => sectionObs.observe(s));
  }

  // ================================
  // Counter animation
  // ================================
  const counters = document.querySelectorAll('[data-count]');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 800;
      const step = target / (duration / 16);
      let current = 0;
      const tick = () => {
        current += step;
        if (current >= target) el.textContent = target;
        else { el.textContent = Math.floor(current); requestAnimationFrame(tick); }
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  // ================================
  // Project tabs (work / personal)
  // ================================
  const tabBtns = document.querySelectorAll('.proj-tab');
  const tabIndicator = document.querySelector('.proj-tab-indicator');
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

  const initialTab = document.querySelector('.proj-tab.active');
  if (initialTab && tabIndicator) {
    const setInitial = () => {
      tabIndicator.classList.add('no-trans');
      moveIndicator(initialTab);
      requestAnimationFrame(() => tabIndicator.classList.remove('no-trans'));
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setInitial);
    else setInitial();
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      moveIndicator(btn);
      const tab = btn.dataset.tab;
      if (tab === 'work') {
        workGrid.hidden = false;
        personalGrid.hidden = true;
        if (workFilter) workFilter.style.display = '';
      } else {
        workGrid.hidden = true;
        personalGrid.hidden = false;
        if (workFilter) workFilter.style.display = 'none';
      }
    });
  });

  window.addEventListener('resize', () => {
    const active = document.querySelector('.proj-tab.active');
    if (active) moveIndicator(active);
  });

  // ================================
  // Project filter
  // ================================
  const filterBtns = document.querySelectorAll('.proj-filter');
  const workCards = document.querySelectorAll('#workGrid .project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      workCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  // ================================
  // Project Modal
  // ================================
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = modal?.querySelector('.modal-backdrop');
  const mTitle = document.getElementById('modalTitle');
  const mLabel = document.getElementById('modalLabel');
  const mPeriod = document.getElementById('modalPeriod');
  const mRole = document.getElementById('modalRole');
  const mClient = document.getElementById('modalClient');
  const mDetail = document.getElementById('modalDetail');
  const mTags = document.getElementById('modalTags');
  const mPagesWrap = document.getElementById('modalPagesWrap');
  const mPages = document.getElementById('modalPages');
  const mContribWrap = document.getElementById('modalContribWrap');
  const mContrib = document.getElementById('modalContrib');

  let lastFocused = null;

  function openModal(card) {
    if (!modal) return;
    mTitle.textContent = card.dataset.title || '';
    mLabel.textContent = card.querySelector('.project-card-label')?.textContent || '/ project';
    mPeriod.textContent = card.dataset.period || '';
    mRole.textContent = card.dataset.role || '';
    mClient.textContent = card.dataset.client || '';
    mDetail.textContent = card.dataset.detail || '';

    mTags.innerHTML = '';
    (card.dataset.tags || '').split(',').forEach(t => {
      const trimmed = t.trim();
      if (trimmed) {
        const s = document.createElement('span');
        s.textContent = trimmed;
        mTags.appendChild(s);
      }
    });

    mPages.innerHTML = '';
    if (card.dataset.pages) {
      card.dataset.pages.split('|').forEach(p => {
        const li = document.createElement('li');
        li.textContent = p.trim();
        mPages.appendChild(li);
      });
      mPagesWrap.hidden = false;
    } else mPagesWrap.hidden = true;

    mContrib.innerHTML = '';
    if (card.dataset.contrib) {
      card.dataset.contrib.split('|').forEach(c => {
        const li = document.createElement('li');
        li.textContent = c.trim();
        mContrib.appendChild(li);
      });
      mContribWrap.hidden = false;
    } else mContribWrap.hidden = true;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    setTimeout(() => modalClose.focus(), 100);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
  }

  // Card click → open modal
  document.querySelectorAll('.project-card').forEach(card => {
    const open = (e) => {
      // 카드 자체나 내부 버튼 모두 트리거
      lastFocused = card;
      openModal(card);
    };
    card.addEventListener('click', open);
    const btn = card.querySelector('.project-card-btn');
    if (btn) btn.addEventListener('click', e => { e.stopPropagation(); lastFocused = btn; openModal(card); });
  });

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
  });

  // Modal focus trap
  modal?.addEventListener('keydown', e => {
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

  // ================================
  // Contact Form (EmailJS)
  // ================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const PUB = contactForm.dataset.emailjsPublicKey;
    const SVC = contactForm.dataset.emailjsServiceId;
    const TPL = contactForm.dataset.emailjsTemplateId;

    if (window.emailjs && PUB) {
      try { emailjs.init(PUB); } catch (e) {}
    }

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const label = btn.querySelector('span:first-child');
      const original = label.textContent;
      label.textContent = '전송 중...';
      btn.disabled = true;

      if (!window.emailjs || !PUB) {
        setTimeout(() => {
          label.textContent = '키 미설정';
          setTimeout(() => { label.textContent = original; btn.disabled = false; }, 2000);
        }, 400);
        return;
      }

      emailjs.sendForm(SVC, TPL, contactForm)
        .then(() => {
          label.textContent = '전송 완료!';
          contactForm.reset();
        })
        .catch(() => { label.textContent = '전송 실패'; })
        .finally(() => {
          setTimeout(() => { label.textContent = original; btn.disabled = false; }, 2500);
        });
    });
  }

  // ================================
  // Floating character bubble rotation
  // ================================
  const charBubble = document.getElementById('charBubble');
  if (charBubble) {
    const messages = [
      '봐주셔서 감사합니다!',
      '같이 일하면 후회 안 하실걸요?',
      '코드로 증명하는 퍼블리셔입니다!',
      'Front-end Publisher · Seoul'
    ];
    let i = 0;
    setInterval(() => {
      charBubble.classList.add('is-fading');
      setTimeout(() => {
        i = (i + 1) % messages.length;
        charBubble.textContent = messages[i];
        charBubble.classList.remove('is-fading');
      }, 300);
    }, 5000);
  }

});
