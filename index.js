/* Experimental Zen no-color opacity bridge for Sine's JS injection. */
(() => {
  'use strict';
  if (window.__zenNoColorOpacityLoaded) return;
  window.__zenNoColorOpacityLoaded = true;
  const ROOT = 'PanelUI-zen-gradient-generator';
  const KEY = 'zen-no-color-opacity-v1';
  const clamp = x => Math.max(0, Math.min(1, x));
  const panel = () => document.getElementById(ROOT) || document.querySelector(`[id^="${ROOT}"]`);
  const colors = p => [...p.querySelectorAll('[data-color], .zen-theme-picker-color, .zen-gradient-generator-color')];
  const empty = p => !colors(p).some(el => el.matches('[selected], [checked], .selected, .active') || el.getAttribute('aria-pressed') === 'true');
  const sliders = p => [...p.querySelectorAll('input[type="range"], input[type="number"], scale')];
  const wave = p => sliders(p).find(el => /opacity|alpha|transparen/i.test([el.id, el.className, el.getAttribute('aria-label'), el.getAttribute('tooltiptext')].join(' '))) || sliders(p).at(-1);
  const store = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
  const workspace = () => document.documentElement.getAttribute('zen-current-workspace-id') || document.documentElement.getAttribute('zen-workspace-id') || 'default';
  const value = el => {
    const min = Number(el.min ?? el.getAttribute('min') ?? 0);
    const max = Number(el.max ?? el.getAttribute('max') ?? 100);
    return clamp((Number(el.value ?? el.getAttribute('value')) - min) / (max - min || 1));
  };
  function apply(alpha) {
    // Keep the OS/system theme's original RGB; replace only its alpha channel.
    const root = document.documentElement;
    root.style.setProperty('--zen-no-color-opacity', String(alpha));
    root.setAttribute('zen-no-color-opacity-active', 'true');
  }
  function clear() {
    document.documentElement.removeAttribute('zen-no-color-opacity-active');
  }
  function sync() {
    const p = panel();
    if (!p || !empty(p)) { clear(); return; }
    const saved = store()[workspace()];
    if (typeof saved === 'number') apply(saved);
    const slider = wave(p);
    if (slider && typeof saved === 'number' && !slider.matches(':active')) {
      const min = Number(slider.min ?? slider.getAttribute('min') ?? 0);
      const max = Number(slider.max ?? slider.getAttribute('max') ?? 100);
      slider.value = String(min + saved * (max - min));
    }
  }
  function changed(e) {
    const p = panel();
    if (!p || !p.contains(e.target) || !empty(p)) return;
    if (e.target !== wave(p)) return;
    const alpha = value(e.target);
    const saved = store(); saved[workspace()] = alpha;
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch {}
    apply(alpha);
  }
  document.addEventListener('input', changed, true);
  document.addEventListener('change', changed, true);
  const observer = new MutationObserver(() => { if (!window.__zenNoColorOpacityTimer) {
    window.__zenNoColorOpacityTimer = setTimeout(() => { window.__zenNoColorOpacityTimer = null; sync(); }, 100);
  }});
  observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['selected', 'checked', 'zen-current-workspace-id', 'zen-workspace-id'] });
  sync();
})();
