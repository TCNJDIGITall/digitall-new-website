/*
 * DIGIT.all aurora
 * Subtle motion driven by scroll position and the user's pointer.
 * Does not track, record, or send cursor/scroll data anywhere.
 */
(() => {
  'use strict';
  const scene = document.querySelector('.ambient-scene');
  if (!scene) return;

  const root = document.documentElement;
  const pointerLight = scene.querySelector('.ambient-pointer-light');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const cardSelector = '.feature-card,.team-card,.event-row,.event-panel,.meeting-banner,.mailing-signup,.join-inner';

  let scrollPending = false;
  function updateScroll() {
    scrollPending = false;
    if (reducedMotion.matches) return;
    const max = Math.max(1, root.scrollHeight - window.innerHeight);
    const offset = Math.min(1600, window.scrollY) * 0.35;
    root.style.setProperty('--ambient-scroll', offset.toFixed(1) + 'px');
    root.style.setProperty('--ambient-progress', (window.scrollY / max).toFixed(3));
  }
  function onScroll() {
    if (scrollPending || reducedMotion.matches) return;
    scrollPending = true;
    window.requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  let pointerPending = false;
  let lastX = -700, lastY = -700, hoverTarget = null;
  function updatePointer() {
    pointerPending = false;
    if (reducedMotion.matches || !finePointer.matches) return;
    if (pointerLight) {
      pointerLight.style.transform =
        'translate3d(' + Math.round(lastX - 235) + 'px,' + Math.round(lastY - 235) + 'px,0)';
      scene.classList.add('has-pointer');
    }
    if (hoverTarget && hoverTarget.isConnected) {
      const rect = hoverTarget.getBoundingClientRect();
      hoverTarget.style.setProperty('--glow-x', Math.round(lastX - rect.left) + 'px');
      hoverTarget.style.setProperty('--glow-y', Math.round(lastY - rect.top) + 'px');
    }
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    if (reducedMotion.matches || !finePointer.matches) return;
    lastX = event.clientX;
    lastY = event.clientY;
    hoverTarget = event.target instanceof Element ? event.target.closest(cardSelector) : null;
    if (!pointerPending) {
      pointerPending = true;
      window.requestAnimationFrame(updatePointer);
    }
  }, { passive: true });

  document.addEventListener('pointerout', event => {
    // Only hide the pointer light when leaving the whole document.
    if (event.relatedTarget === null) scene.classList.remove('has-pointer');
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) scene.classList.remove('has-pointer');
  });
  function updatePreference() {
    if (reducedMotion.matches) {
      scene.classList.remove('has-pointer');
      root.style.setProperty('--ambient-scroll', '0px');
    } else onScroll();
  }
  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', updatePreference);
  }
})();
