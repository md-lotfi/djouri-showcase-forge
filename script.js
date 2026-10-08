/* Shared behavior for the four static pages. No framework or build required. */
(() => {
  'use strict';

  const languageFromUrl = () =>
    new URLSearchParams(window.location.search).get('lang') === 'ar' ? 'ar' : 'fr';
  let language = languageFromUrl();
  const inquiryLanguageUpdates = [];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionEasing = 'cubic-bezier(.22, 1, .36, 1)';
  const entranceAnimations = new Set();

  const preparedReveals = new Set();
  const preparedImages = new Set();

  function trackEntrance(animation) {
    entranceAnimations.add(animation);
    animation.finished.then(
      () => entranceAnimations.delete(animation),
      () => entranceAnimations.delete(animation),
    );
    return animation;
  }

  function finishEntrances(within = document) {
    entranceAnimations.forEach((animation) => {
      if (within.contains(animation.effect?.target)) {
        animation.cancel();
        entranceAnimations.delete(animation);
      }
    });
    preparedImages.forEach((element) => {
      if (within.contains(element)) {
        element.removeAttribute('data-image-pending');
        preparedImages.delete(element);
      }
    });
    preparedReveals.forEach((element) => {
      if (within.contains(element)) {
        element.removeAttribute('data-reveal-pending');
        preparedReveals.delete(element);
      }
    });
  }

  // Fade only freshly loaded lightbox surfaces, never already-painted page content.
  function enter(element, duration = 250) {
    if (motionPreference.matches || !element.animate) return;
    try {
      trackEntrance(element.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration, easing: motionEasing,
      }));
    } catch { /* Content remains visible if animations are unsupported. */ }
  }

  function revealMask(element, duration = 750, delay = 0, rise = 0, bottomUp = false) {
    if (motionPreference.matches || !element.animate) return;
    trackEntrance(element.animate([
      { clipPath: bottomUp ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)', transform: `translateY(${rise}px)` },
      { clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)' },
    ], { duration, delay, easing: motionEasing, fill: 'backwards' }));
  }

  function revealImage(surface, image, delay = 0) {
    surface.setAttribute('data-image-pending', '');
    preparedImages.add(surface);
    image.loading = 'eager';
    const clear = () => {
      surface.removeAttribute('data-image-pending');
      preparedImages.delete(surface);
    };
    // A slow or failed image must never leave a permanent mask or block focus.
    const deadline = window.setTimeout(clear, 1500);
    Promise.resolve().then(() => image.decode()).then(() => {
      if (!preparedImages.has(surface) || motionPreference.matches) return;
      revealMask(surface, 750, delay, 0, true);
      if (image.animate && CSS.supports('scale', '1.04')) {
        trackEntrance(image.animate([{ scale: '1.04' }, { scale: '1' }], {
          duration: 750, delay, easing: motionEasing, fill: 'backwards',
        }));
      }
    }).catch(() => {}).finally(() => {
      window.clearTimeout(deadline);
      clear();
    });
  }

  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) {
      finishEntrances();
      document.documentElement.classList.remove('motion-boot');
    }
  });
  // Keyboard focus and anchors never wait behind a reveal mask.
  document.addEventListener('focusin', (event) => {
    const target = event.target.closest('[data-project], [data-reveal-pending], .hero-copy');
    if (target) finishEntrances(target);
  });
  function anchorTarget() {
    try { return document.getElementById(decodeURIComponent(location.hash.slice(1))); }
    catch { return null; }
  }
  window.addEventListener('hashchange', () => {
    const target = anchorTarget();
    if (target) finishEntrances(target);
  });
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
  let menuOpen = menuButton.getAttribute('aria-expanded') === 'true';

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
    window.djouriOpening?.languageObserver?.disconnect();
    if (document.documentElement.lang !== language) finishEntrances();
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

  // Translation is ready before any opening animation starts.
  applyLanguage();
  if (window.djouriOpening) window.djouriOpening.ready = true;

  const hero = document.querySelector('.hero');
  if (hero) {
    const slides = [...hero.querySelectorAll('.hero-slide')];
    const dots = [...hero.querySelectorAll('[data-slide]')];
    const caption = hero.querySelector('.hero-caption');
    const pauseButton = hero.querySelector('[data-pause-carousel]');
    const progressBar = hero.querySelector('.hero-progress > span');
    const decoded = new Map();
    let current = 0;
    let desired = 0;
    let revision = 0;
    let paused = motionPreference.matches;
    let ready = false;
    let timer;
    let startedAt = null;
    let remaining = 8000;
    let camera;
    let progress;
    let transition;
    let automaticPending = false;

    function decodeSlide(index) {
      if (decoded.has(index)) return decoded.get(index);
      const slide = slides[index];
      slide.loading = 'eager';
      const promise = Promise.resolve().then(() => slide.decode()).then(() => {
        if (!slide.naturalWidth) throw new Error('Image unavailable');
        return slide;
      }).catch((error) => {
        decoded.delete(index);
        throw error;
      });
      decoded.set(index, promise);
      return promise;
    }

    function stopClock() {
      window.clearTimeout(timer);
      if (startedAt !== null) {
        remaining = Math.max(0, remaining - (performance.now() - startedAt));
        startedAt = null;
      }
      progress?.pause();
    }

    function startCamera(from = getComputedStyle(slides[current]).transform) {
      camera?.cancel();
      camera = null;
      if (motionPreference.matches || !slides[current].animate) return;
      try {
        camera = slides[current].animate([
          { transform: from === 'none' ? 'scale(1)' : from },
          { transform: 'scale(1)' },
        ], { duration: 8000, easing: motionEasing, fill: 'forwards' });
        if (paused || document.hidden) camera.pause();
      } catch { slides[current].style.transform = ''; }
    }

    function freezeCamera() {
      // Preserve the outgoing frame until the incoming image completely covers it.
      if (camera) slides[current].style.transform = getComputedStyle(slides[current]).transform;
      camera?.cancel();
      camera = null;
    }

    function resetCycle() {
      stopClock();
      remaining = 8000;
      progress?.cancel();
      progress = null;
      if (!motionPreference.matches && progressBar?.animate) {
        try {
          progress = progressBar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
            duration: 8000, easing: 'linear', fill: 'both',
          });
          progress.pause();
        } catch { /* Playback remains available without a progress animation. */ }
      }
    }

    function updatePlayback() {
      stopClock();
      pauseButton.setAttribute('aria-pressed', String(paused));
      pauseButton.disabled = motionPreference.matches;
      setTranslatedLabel(pauseButton,
        paused ? 'Reprendre le carrousel' : 'Mettre en pause',
        paused ? 'تشغيل العرض' : 'إيقاف العرض');
      if (motionPreference.matches) {
        camera?.cancel();
        camera = null;
        slides.forEach((slide) => { slide.style.transform = ''; });
        progress?.cancel();
        progress = null;
      }
      if (paused || motionPreference.matches || document.hidden || !ready) {
        camera?.pause();
        return;
      }
      if (camera?.playState === 'paused') camera.play();
      if (!progress && progressBar?.animate) {
        try {
          progress = progressBar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 8000, easing: 'linear', fill: 'both' });
          progress.currentTime = 8000 - remaining;
        } catch { /* Progress is decorative. */ }
      }
      if (remaining > 0 && !automaticPending) progress?.play();
      if (automaticPending) return;
      startedAt = performance.now();
      timer = window.setTimeout(() => {
        stopClock();
        requestSlide(current + 1, true);
      }, remaining);
    }

    function settleTransition() {
      if (!transition) return;
      const { animation, outgoing } = transition;
      transition = null;
      slides[current].style.opacity = '1';
      animation?.cancel();
      outgoing.classList.remove('visible');
      outgoing.style.opacity = '';
      outgoing.style.zIndex = '';
      outgoing.style.transform = '';
      slides[current].style.zIndex = '1';
    }

    function updateSelection() {
      slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== current)));
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
        dot.setAttribute('aria-pressed', String(i === current));
      });
      hero.querySelector('.slide-number').textContent = String(current + 1).padStart(2, '0');
      setTranslatedText(caption, slides[current].dataset.altFr, slides[current].dataset.altAr);
    }

    async function requestSlide(index, automatic = false) {
      desired = (index + slides.length) % slides.length;
      const target = desired;
      const request = ++revision;
      automaticPending = automatic;
      try {
        await decodeSlide(target);
        if (request !== revision) return;
        if (automatic && (paused || document.hidden || motionPreference.matches)) {
          automaticPending = false;
          remaining = 0;
          return;
        }
        automaticPending = false;
        if (target === current) {
          if (!ready) {
            ready = true;
            startCamera();
            resetCycle();
          }
          updatePlayback();
          return;
        }
        settleTransition();
        stopClock();
        freezeCamera();
        const outgoing = slides[current];
        const incoming = slides[target];
        outgoing.style.zIndex = '1';
        outgoing.style.opacity = '1';
        incoming.style.zIndex = '2';
        incoming.style.opacity = '0';
        incoming.style.transform = motionPreference.matches ? '' : 'scale(1.045)';
        incoming.classList.add('visible');
        current = target;
        ready = true;
        finishEntrances(caption);
        updateSelection();
        if (!motionPreference.matches && incoming.animate) {
          try {
            const animation = incoming.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 850, easing: motionEasing, fill: 'both',
            });
            const active = { animation, outgoing };
            transition = active;
            animation.finished.then(() => {
              if (transition === active) settleTransition();
            }, () => {});
            revealMask(caption, 220);
          } catch {
            if (!transition) transition = { outgoing };
            settleTransition();
          }
        } else {
          transition = { outgoing };
          settleTransition();
        }
        startCamera();
        resetCycle();
        updatePlayback();
        // Warm only the next original slide, after the first image has rendered.
        decodeSlide((current + 1) % slides.length).catch(() => {});
      } catch {
        if (request !== revision) return;
        automaticPending = false;
        desired = current;
        resetCycle();
        updatePlayback();
      }
    }

    dots.forEach((dot) => dot.addEventListener('click', () => requestSlide(Number(dot.dataset.slide))));
    hero.querySelectorAll('[data-slide-step]').forEach((button) => {
      button.addEventListener('click', () => requestSlide(desired + Number(button.dataset.slideStep)));
    });
    pauseButton.addEventListener('click', () => {
      paused = !paused;
      updatePlayback();
    });
    motionPreference.addEventListener('change', () => {
      if (motionPreference.matches) {
        paused = true;
        revision++;
        desired = current;
        automaticPending = false;
        settleTransition();
      }
      updatePlayback();
    });
    document.addEventListener('visibilitychange', updatePlayback);

    // Transfer the prepared camera frame before removing the bootstrap CSS state.
    slides[0].style.transform = getComputedStyle(slides[0]).transform;
    const opening = window.djouriOpening;
    if (opening?.active && performance.now() < opening.deadline && !motionPreference.matches) {
      try {
        hero.classList.add('hero-opening');
        hero.querySelectorAll('[data-hero-reveal]').forEach((element, i) => revealMask(element, 750, i * 60, 16));
      } catch { finishEntrances(hero); }
    }
    updateSelection();
    updatePlayback();
    decodeSlide(0).then(() => {
      if (current !== 0 || revision !== 0) return;
      ready = true;
      startCamera();
      resetCycle();
      updatePlayback();
      decodeSlide(1).catch(() => {});
    }).catch(() => { /* Text and controls remain usable if the first image fails. */ });
  }
  document.documentElement.classList.remove('motion-boot');
  if (window.djouriOpening) {
    window.clearTimeout(window.djouriOpening.timer);
    window.djouriOpening.active = false;
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
    let collection = [];
    let imageRevision = 0;

    function showProject(index) {
      selected = (index + collection.length) % collection.length;
      const project = collection[selected];
      const source = project.querySelector('img');
      const title = project.querySelector('h3');
      const caption = project.querySelector('p');
      const image = dialog.querySelector('.lightbox-image');
      const revision = ++imageRevision;
      image.getAnimations().forEach((animation) => animation.cancel());
      image.style.visibility = 'hidden';
      const loaded = new Image();
      loaded.onload = () => {
        if (revision !== imageRevision || !dialog.open) return;
        image.src = loaded.src;
        image.style.visibility = '';
        enter(image, 250, 0, 0);
      };
      loaded.onerror = () => {
        if (revision !== imageRevision || !dialog.open) return;
        image.src = source.src;
        image.style.visibility = '';
      };
      loaded.src = source.src;
      ['fr', 'ar'].forEach((lang) => {
        image.setAttribute(`data-alt-${lang}`, source.getAttribute(`data-alt-${lang}`));
      });
      image.alt = source.alt;
      setTranslatedText(dialog.querySelector('h2'), title.dataset.fr, title.dataset.ar);
      setTranslatedText(dialog.querySelector('p'), caption.dataset.fr, caption.dataset.ar);
      dialog.querySelector('.lightbox-counter').textContent =
        `${String(selected + 1).padStart(2, '0')} / ${String(collection.length).padStart(2, '0')}`;
      dialog.querySelectorAll('[data-project-step]').forEach((button) => {
        button.disabled = collection.length < 2;
      });
    }

    projects.forEach((project) => {
      project.querySelector('button').addEventListener('click', (event) => {
        opener = event.currentTarget;
        collection = projects.filter((item) => !item.hidden);
        showProject(collection.indexOf(project));
        dialog.showModal();
        enter(dialog, 200, 0, 0);
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
        if (collection.length > 1) showProject(selected + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    // Native <dialog> provides the inert background and Escape handling.
    dialog.addEventListener('close', () => {
      imageRevision++;
      dialog.getAnimations().forEach((animation) => animation.cancel());
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
    function verificationState(state) { verification.dataset.state = state; }
    function awaitingVerification() {
      verificationState('awaiting');
      verificationMessage('Veuillez terminer la vérification', 'يرجى إكمال التحقق');
    }

    function verificationMessage(fr, ar, canRetry = false) {
      setTranslatedText(verificationStatus, fr, ar);
      verificationStatus.hidden = false;
      retry.hidden = !canRetry;
    }

    function verificationFailed() {
      verificationState('unavailable');
      token = '';
      verificationMessage(
        'Vérification indisponible. Réessayez ou contactez-nous par email ou téléphone.',
        'التحقق غير متاح. حاول مجددًا أو تواصل معنا عبر البريد أو الهاتف.',
        true,
      );
      return true;
    }

    function verificationExpired() {
      verificationState('expired');
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
      verificationState('loading');
      token = '';
      verificationMessage('Chargement de la vérification…', 'جارٍ تحميل التحقق…');
      try {
        const api = await loadTurnstile();
        if (widgetId !== undefined) api.remove(widgetId);
        widgetLanguage = language;
        widgetSize = verificationSize();
        awaitingVerification();
        widgetId = api.render(widget, {
          sitekey: verification.dataset.turnstileSitekey,
          language,
          theme: 'light',
          size: widgetSize,
          'response-field': false,
          retry: 'never',
          callback: (value) => {
            token = value;
            verificationState('verified');
            verificationMessage('Vérification terminée', 'اكتمل التحقق');
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
        if (widgetId !== undefined && (widgetLanguage !== language || widgetSize !== verificationSize())) renderVerification();
      }
    }

    retry.addEventListener('click', renderVerification);
    if (window.ResizeObserver) new ResizeObserver(() => {
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
      const controller = new AbortController();
      let deadline;
      const timeout = new Promise((_, reject) => {
        deadline = window.setTimeout(() => {
          controller.abort();
          reject(new DOMException('Submission timeout', 'TimeoutError'));
        }, 30000);
      });
      try {
        // The deadline covers both the response headers and JSON body parsing.
        const [response, result] = await Promise.race([
          (async () => {
            const response = await fetch(form.action, {
              method: 'POST',
              headers: { Accept: 'application/json' },
              body: payload,
              signal: controller.signal,
            });
            const result = await response.json().catch(() => null);
            return [response, result];
          })(),
          timeout,
        ]);
        // Formspree returns a JSON acknowledgement; never follow its next URL.
        const confirmed = result && typeof result === 'object' && !Array.isArray(result) && ((typeof result.next === 'string' && result.next.length > 0) || result.ok === true);
        if (!response.ok || !confirmed || result.error ||
            (result.errors && (!Array.isArray(result.errors) || result.errors.length))) {
          const invalidFields = (Array.isArray(result?.errors) ? result.errors : [])
            .map((error) => form.elements.namedItem(error.field))
            .filter((field) => fields.includes(field));
          invalidFields.forEach((field) => { field.setAttribute('aria-invalid', 'true'); });
          if (response.status === 429) {
            showStatus(
              'Veuillez patienter quelques instants avant de réessayer. Votre texte reste dans ce formulaire.',
              'يرجى الانتظار قليلًا قبل المحاولة مجددًا. يبقى نصك في هذا النموذج.',
            );
          } else if (invalidFields.length) {
            showStatus(
              'Vérifiez les champs indiqués et réessayez. Votre texte reste dans ce formulaire.',
              'تحقق من الحقول المحددة وحاول مجددًا. يبقى نصك في هذا النموذج.',
            );
          } else {
            showStatus(
              'Votre demande n’a pas pu être confirmée. Réessayez ou contactez-nous par email ou téléphone. Votre texte reste dans ce formulaire.',
              'تعذّر تأكيد استلام طلبك. حاول مجددًا أو تواصل معنا عبر البريد أو الهاتف. يبقى نصك في هذا النموذج.',
            );
          }
          return;
        }
        form.reset();
        showStatus('Votre demande a bien été reçue. Merci.', 'تم استلام طلبك بنجاح. شكرًا لك.');
      } catch {
        showStatus(
          'La réception de votre demande n’a pas pu être confirmée. Réessayez ou contactez-nous par email ou téléphone. Votre texte reste dans ce formulaire.',
          'تعذّر تأكيد استلام طلبك. حاول مجددًا أو تواصل معنا عبر البريد أو الهاتف. يبقى نصك في هذا النموذج.',
        );
      } finally {
        window.clearTimeout(deadline);
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
            awaitingVerification();
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

  document.documentElement.classList.add('js');

  // Seed only offscreen surfaces. An already-painted heading or card is never hidden.
  try {
    if ('IntersectionObserver' in window && !motionPreference.matches) {
      const revealTargets = new Map();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target: container, isIntersecting }) => {
          if (!isIntersecting || container.hidden) return;
          observer.unobserve(container);
          revealTargets.get(container)?.forEach((target) => {
            if (target.hidden || !preparedReveals.has(target)) return;
            const project = target.matches('[data-project]');
            const siblings = project ? [...target.parentElement.querySelectorAll('[data-project]:not([hidden])')] : [];
            const stagger = project ? Math.min((siblings.indexOf(target) % 3) * 60, 180) : 0;
            try {
              if (project) {
                revealImage(target.querySelector('.project-image'), target.querySelector('img'), stagger);
                revealMask(target.querySelector('.project-label'), 600, stagger + 60, 8);
              } else if (target.matches('img')) {
                revealImage(target, target);
              } else {
                revealMask(target, 650, 0, 12);
                target.closest('.section-heading')?.classList.add('is-revealed');
              }
            } catch { finishEntrances(target); }
            target.removeAttribute('data-reveal-pending');
            preparedReveals.delete(target);
          });
        });
      }, { threshold: 0.08 });
      // Observe unmasked containers: a fully clipped target has an empty intersection.
      const warmTargets = new Map();
      const warmer = new IntersectionObserver((entries) => {
        entries.forEach(({ target: container, isIntersecting }) => {
          if (!isIntersecting || container.hidden) return;
          const image = warmTargets.get(container);
          if (image) image.loading = 'eager';
          warmer.unobserve(container);
        });
      }, { rootMargin: '600px 0px' });
      const anchor = anchorTarget();
      const candidates = [...document.querySelectorAll('.section-heading h2, .section-heading .eyebrow, .studio-copy h2, .studio-visual img, .film-copy h2, [data-project]')]
        .filter((element) => element.getBoundingClientRect().top >= window.innerHeight + 64 && !anchor?.contains(element));
      candidates.forEach((element) => {
        const container = element.matches('[data-project]') ? element : element.parentElement;
        if (!revealTargets.has(container)) {
          revealTargets.set(container, new Set());
          observer.observe(container);
        }
        revealTargets.get(container).add(element);
        element.setAttribute('data-reveal-pending', '');
        preparedReveals.add(element);
      });
      const warmNearby = () => candidates.filter((element) => element.matches('img, [data-project]')).forEach((element) => {
        const container = element.matches('[data-project]') ? element : element.parentElement;
        warmTargets.set(container, element.matches('img') ? element : element.querySelector('img'));
        warmer.observe(container);
      });
      const firstImage = hero?.querySelector('.hero-slide');
      if (firstImage) Promise.resolve().then(() => firstImage.decode()).then(warmNearby, warmNearby);
      else warmNearby();
    }
  } catch { finishEntrances(); }
})();
