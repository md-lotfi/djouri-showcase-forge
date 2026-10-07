/* Shared behavior for the four static pages. No framework or build required. */
(() => {
  'use strict';

  const languageFromUrl = () =>
    new URLSearchParams(window.location.search).get('lang') === 'ar' ? 'ar' : 'fr';
  let language = languageFromUrl();
  const inquiryLanguageUpdates = [];
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
    inquiryLanguageUpdates.forEach((update) => update());
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

  let turnstileReady;
  function loadTurnstile() {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (turnstileReady) return turnstileReady;
    turnstileReady = new Promise((resolve, reject) => {
      const sdk = document.createElement('script');
      sdk.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      sdk.async = true;
      const fail = () => {
        window.clearTimeout(timer);
        sdk.remove();
        turnstileReady = null;
        reject(new Error('Turnstile unavailable'));
      };
      const timer = window.setTimeout(fail, 15000);
      sdk.onerror = fail;
      sdk.onload = () => {
        window.clearTimeout(timer);
        if (!window.turnstile) return fail();
        resolve(window.turnstile);
      };
      document.head.append(sdk);
    });
    return turnstileReady;
  }

  document.querySelectorAll('.inquiry-form').forEach((form) => {
    const status = form.querySelector('[data-inquiry-status]');
    const button = form.querySelector('button[type="submit"]');
    const buttonLabel = button.querySelector('span');
    const fields = [...form.querySelectorAll('input, select, textarea')];
    let pending = false;
    const verification = form.querySelector('.inquiry-verification');
    const widget = verification.querySelector('[data-turnstile-widget]');
    const verificationStatus = verification.querySelector('[data-turnstile-status]');
    const retry = verification.querySelector('[data-turnstile-retry]');
    let widgetId;
    let widgetLanguage;
    let widgetSize;
    const verificationSize = () => widget.clientWidth < 300 ? 'compact' : 'flexible';
    let token = '';
    let initializing = false;

    function verificationMessage(fr, ar, canRetry = false) {
      setTranslatedText(verificationStatus, fr, ar);
      verificationStatus.hidden = false;
      retry.hidden = !canRetry;
    }

    function verificationFailed() {
      token = '';
      verificationMessage(
        'Vérification indisponible. Réessayez ou contactez-nous par email ou téléphone.',
        'التحقق غير متاح. حاول مجددًا أو تواصل معنا عبر البريد أو الهاتف.',
        true,
      );
      return true;
    }

    function verificationExpired() {
      token = '';
      verificationMessage(
        'La vérification a expiré. Veuillez la renouveler avant l’envoi.',
        'انتهت صلاحية التحقق. يرجى تجديده قبل الإرسال.',
        true,
      );
    }

    async function renderVerification() {
      if (pending || initializing) return;
      initializing = true;
      token = '';
      verificationMessage('Chargement de la vérification…', 'جارٍ تحميل التحقق…');
      try {
        const api = await loadTurnstile();
        if (widgetId !== undefined) api.remove(widgetId);
        widgetLanguage = language;
        widgetSize = verificationSize();
        widgetId = api.render(widget, {
          sitekey: verification.dataset.turnstileSitekey,
          language,
          theme: 'light',
          size: widgetSize,
          'response-field': false,
          retry: 'never',
          callback: (value) => {
            token = value;
            verificationStatus.hidden = true;
            retry.hidden = true;
          },
          'error-callback': verificationFailed,
          'expired-callback': verificationExpired,
          'timeout-callback': verificationExpired,
        });
      } catch {
        verificationFailed();
      } finally {
        initializing = false;
      }
    }

    retry.addEventListener('click', renderVerification);
    new ResizeObserver(() => {
      if (widgetSize && widgetSize !== verificationSize()) renderVerification();
    }).observe(widget);
    inquiryLanguageUpdates.push(() => {
      if (widgetLanguage && widgetLanguage !== language) renderVerification();
    });
    renderVerification();

    function showStatus(fr, ar) {
      setTranslatedText(status, fr, ar);
      status.hidden = false;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (pending || !form.reportValidity()) return;
      if (!token || widgetId === undefined || !window.turnstile ||
          window.turnstile.isExpired(widgetId)) {
        token = '';
        verificationMessage(
          'Veuillez terminer la vérification avant d’envoyer votre demande.',
          'يرجى إكمال التحقق قبل إرسال طلبك.',
          true,
        );
        return;
      }
      fields.forEach((field) => { field.removeAttribute('aria-invalid'); });
      const payload = new FormData(form);
      payload.set('cf-turnstile-response', token);
      retry.disabled = true;
      pending = true;
      button.disabled = true;
      fields.forEach((field) => { field.disabled = true; });
      form.setAttribute('aria-busy', 'true');
      setTranslatedText(buttonLabel, 'Envoi en cours…', 'جارٍ الإرسال…');
      showStatus('Envoi de votre demande en cours…', 'جارٍ إرسال طلبك…');
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: payload,
        });
        const result = await response.json().catch(() => null);
        // Formspree returns a JSON acknowledgement; never follow its next URL.
        const confirmed = result && (typeof result.next === 'string' || result.ok === true);
        if (!response.ok || !confirmed || result.error || result.errors?.length) {
          const invalidFields = (Array.isArray(result?.errors) ? result.errors : [])
            .map((error) => form.elements.namedItem(error.field))
            .filter((field) => fields.includes(field));
          invalidFields.forEach((field) => { field.setAttribute('aria-invalid', 'true'); });
          if (response.status === 429) {
            showStatus(
              'Veuillez patienter quelques instants avant de réessayer. Votre demande est conservée.',
              'يرجى الانتظار قليلًا قبل المحاولة مجددًا. تم الاحتفاظ بطلبك.',
            );
          } else if (invalidFields.length) {
            showStatus(
              'Vérifiez les champs indiqués et réessayez. Votre demande est conservée.',
              'تحقق من الحقول المحددة وحاول مجددًا. تم الاحتفاظ بطلبك.',
            );
          } else {
            showStatus(
              'Votre demande n’a pas pu être confirmée. Réessayez ou contactez-nous par email ou téléphone. Votre demande est conservée.',
              'تعذّر تأكيد استلام طلبك. حاول مجددًا أو تواصل معنا عبر البريد أو الهاتف. تم الاحتفاظ بطلبك.',
            );
          }
          return;
        }
        form.reset();
        showStatus('Votre demande a bien été reçue. Merci.', 'تم استلام طلبك بنجاح. شكرًا لك.');
      } catch {
        showStatus(
          'Connexion indisponible. Réessayez ou contactez-nous par email ou téléphone. Votre demande est conservée.',
          'الاتصال غير متاح. حاول مجددًا أو تواصل معنا عبر البريد أو الهاتف. تم الاحتفاظ بطلبك.',
        );
      } finally {
        pending = false;
        button.disabled = false;
        fields.forEach((field) => { field.disabled = false; });
        form.removeAttribute('aria-busy');
        setTranslatedText(buttonLabel, 'Envoyer la demande', 'إرسال الطلب');
        retry.disabled = false;
        // Verification tokens are single-use, including uncertain network outcomes.
        token = '';
        if (widgetLanguage !== language || widgetSize !== verificationSize()) {
          renderVerification();
        } else {
          try {
            window.turnstile.reset(widgetId);
          } catch {
            verificationFailed();
          }
        }
      }
    });
    // JavaScript enables the form and keeps submissions on this page.
    form.addEventListener('input', (event) => {
      if (fields.includes(event.target)) event.target.removeAttribute('aria-invalid');
    });
    button.disabled = false;
  });

  applyLanguage();
})();
