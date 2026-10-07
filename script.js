/* Shared behavior for the four static pages. No framework or build required. */
(() => {
  'use strict';

  const languageFromUrl = () =>
    new URLSearchParams(window.location.search).get('lang') === 'ar' ? 'ar' : 'fr';
  let language = languageFromUrl();
  const text = (fr, ar) => (language === 'ar' ? ar : fr);

  function setTranslatedText(element, fr, ar) {
    element.dataset.fr = fr;
    element.dataset.ar = ar;
    element.textContent = text(fr, ar);
  }

  function setTranslatedLabel(element, fr, ar) {
    element.setAttribute('data-aria-label-fr', fr);
    element.setAttribute('data-aria-label-ar', ar);
    element.setAttribute('aria-label', text(fr, ar));
  }

  const menuButton = document.querySelector('.mobile-menu');
  const navigation = document.querySelector('.main-nav');
  let menuOpen = false;

  function updateMenu() {
    navigation.classList.toggle('is-open', menuOpen);
    menuButton.setAttribute('aria-expanded', String(menuOpen));
    setTranslatedLabel(
      menuButton,
      menuOpen ? 'Fermer le menu' : 'Ouvrir le menu',
      menuOpen ? 'إغلاق القائمة' : 'فتح القائمة',
    );
  }

  function applyLanguage() {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-fr][data-ar]').forEach((element) => {
      element.textContent = element.getAttribute(`data-${language}`);
    });
    ['alt', 'aria-label', 'placeholder', 'content', 'title'].forEach((attribute) => {
      document.querySelectorAll(`[data-${attribute}-fr]`).forEach((element) => {
        element.setAttribute(attribute, element.getAttribute(`data-${attribute}-${language}`));
      });
    });
    document.querySelectorAll('[data-language]').forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-site-link]').forEach((link) => {
      const url = new URL(link.href);
      url.searchParams.set('lang', language);
      // Keep links relative, including when this site is opened from local files.
      let href = link.getAttribute('href').split(/[?#]/)[0];
      // A file browser does not resolve directory links to index.html like a server.
      if (window.location.protocol === 'file:' && href.endsWith('/')) href += 'index.html';
      link.setAttribute('href', `${href}${url.search}${url.hash}`);
    });
    document.querySelectorAll('[data-location-map]').forEach((map) => {
      const url = new URL(map.src);
      if (url.searchParams.get('hl') !== language) {
        url.searchParams.set('hl', language);
        map.src = url.href;
      }
    });
    updateMenu();
    try {
      localStorage.setItem('djouri-language', language);
    } catch {
      // The URL remains the source of truth when storage is unavailable.
    }
  }

  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextLanguage = button.dataset.language;
      if (nextLanguage === language) return;
      const url = new URL(window.location.href);
      url.searchParams.set('lang', nextLanguage);
      window.history.pushState(null, '', url);
      language = nextLanguage;
      applyLanguage();
    });
  });
  window.addEventListener('popstate', () => {
    language = languageFromUrl();
    applyLanguage();
  });
  menuButton.addEventListener('click', () => {
    menuOpen = !menuOpen;
    updateMenu();
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuOpen = false;
      updateMenu();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) {
      menuOpen = false;
      updateMenu();
      menuButton.focus();
    }
  });
  const mobileViewport = window.matchMedia('(max-width: 640px)');
  mobileViewport.addEventListener('change', () => {
    if (!mobileViewport.matches) {
      menuOpen = false;
      updateMenu();
    }
  });

  const hero = document.querySelector('.hero');
  if (hero) {
    const slides = [...hero.querySelectorAll('.hero-slide')];
    const dots = [...hero.querySelectorAll('[data-slide]')];
    const caption = hero.querySelector('.hero-caption');
    const pauseButton = hero.querySelector('[data-pause-carousel]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;
    let paused = reducedMotion.matches;
    let timer;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('visible', i === current);
        slide.setAttribute('aria-hidden', String(i !== current));
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
        dot.setAttribute('aria-pressed', String(i === current));
      });
      hero.querySelector('.slide-number').textContent = String(current + 1).padStart(2, '0');
      setTranslatedText(
        caption,
        current === 0 ? 'Design Contemporain de Haute Tour' : slides[current].getAttribute('data-alt-fr'),
        current === 0 ? 'تصميم برجي معاصر' : slides[current].getAttribute('data-alt-ar'),
      );
    }

    function updatePlayback() {
      window.clearInterval(timer);
      pauseButton.setAttribute('aria-pressed', String(paused));
      pauseButton.disabled = reducedMotion.matches;
      setTranslatedLabel(
        pauseButton,
        paused ? 'Reprendre le carrousel' : 'Mettre en pause',
        paused ? 'تشغيل العرض' : 'إيقاف العرض',
      );
      if (!paused && !reducedMotion.matches && !document.hidden) {
        timer = window.setInterval(() => showSlide(current + 1), 8000);
      }
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        showSlide(Number(dot.dataset.slide));
        updatePlayback();
      });
    });
    hero.querySelectorAll('[data-slide-step]').forEach((button) => {
      button.addEventListener('click', () => {
        showSlide(current + Number(button.dataset.slideStep));
        updatePlayback();
      });
    });
    pauseButton.addEventListener('click', () => {
      paused = !paused;
      updatePlayback();
    });
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) paused = true;
      updatePlayback();
    });
    document.addEventListener('visibilitychange', updatePlayback);
    showSlide(0);
    updatePlayback();
  }

  const projects = [...document.querySelectorAll('[data-project]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projects.forEach((project) => {
        project.hidden = filter !== 'all' && project.dataset.type !== filter;
      });
    });
  });

  const dialog = document.querySelector('.lightbox');
  if (dialog) {
    let selected = 0;
    let opener;

    function showProject(index) {
      selected = (index + projects.length) % projects.length;
      const project = projects[selected];
      const source = project.querySelector('img');
      const title = project.querySelector('h3');
      const caption = project.querySelector('p');
      const image = dialog.querySelector('.lightbox-image');
      image.src = source.src;
      ['fr', 'ar'].forEach((lang) => {
        image.setAttribute(`data-alt-${lang}`, source.getAttribute(`data-alt-${lang}`));
      });
      image.alt = source.alt;
      setTranslatedText(dialog.querySelector('h2'), title.dataset.fr, title.dataset.ar);
      setTranslatedText(dialog.querySelector('p'), caption.dataset.fr, caption.dataset.ar);
      dialog.querySelector('.lightbox-counter').textContent =
        `${String(selected + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
    }

    projects.forEach((project, index) => {
      project.querySelector('button').addEventListener('click', (event) => {
        opener = event.currentTarget;
        showProject(index);
        dialog.showModal();
        document.body.classList.add('lightbox-open');
      });
    });
    dialog.querySelectorAll('[data-project-step]').forEach((button) => {
      button.addEventListener('click', () => showProject(selected + Number(button.dataset.projectStep)));
    });
    dialog.querySelector('[data-close-lightbox]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        const controls = [...dialog.querySelectorAll('button:not(:disabled)')];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        showProject(selected + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    // Native <dialog> provides the inert background and Escape handling.
    dialog.addEventListener('close', () => {
      document.body.classList.remove('lightbox-open');
      opener?.focus({ preventScroll: true });
    });
  }

  document.querySelectorAll('.inquiry-form').forEach((form) => {
    const status = form.querySelector('[role="status"]');
    const downloadButton = form.querySelector('[data-download-inquiry]');

    function prepareRequest() {
      if (!form.reportValidity()) return null;
      // Use visible labels in the current language and keep the visitor's draft intact.
      return [
        text('DJOURI DESIGNE — Demande de projet', 'ديجوري ديزاين — طلب مشروع'),
        `${text('Nom', 'الاسم')}: ${form.elements.Nom.value}`,
        `${text('Email', 'البريد الإلكتروني')}: ${form.elements.Email.value}`,
        `${text('Type de projet', 'نوع المشروع')}: ${form.elements.Projet.selectedOptions[0].textContent}`,
        `${text('Message', 'الرسالة')}: ${form.elements.Message.value}`,
      ].join('\n\n');
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const request = prepareRequest();
      if (request === null) return;
      const subject = text('Demande de projet — DJOURI DESIGNE', 'طلب مشروع — ديجوري ديزاين');
      const compose = document.createElement('a');
      compose.href = `mailto:${form.dataset.recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(request)}`;
      document.body.append(compose);
      compose.click();
      compose.remove();
      // Opening a mailto link cannot confirm whether an email app opened or sent anything.
      setTranslatedText(
        status,
        'Finalisez l’envoi dans votre messagerie. Si elle ne s’ouvre pas, téléchargez la demande ou utilisez notre adresse email.',
        'أكمل الإرسال من تطبيق البريد. إذا لم يفتح، نزّل الطلب أو استخدم عنوان بريدنا الإلكتروني.',
      );
      status.hidden = false;
    });

    downloadButton.addEventListener('click', () => {
      const request = prepareRequest();
      if (request === null) return;
      const url = URL.createObjectURL(new Blob([request], { type: 'text/plain;charset=utf-8' }));
      const download = document.createElement('a');
      download.href = url;
      download.download = 'demande-projet-djouri.txt';
      document.body.append(download);
      download.click();
      download.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setTranslatedText(
        status,
        'Votre demande a été téléchargée. Aucun message n’a été envoyé.',
        'تم تنزيل طلبك. لم يتم إرسال أي رسالة.',
      );
      status.hidden = false;
    });
    // Without JavaScript the form stays disabled instead of issuing a GET request.
    form.querySelector('button[type="submit"]').disabled = false;
    downloadButton.disabled = false;
  });

  applyLanguage();
})();
