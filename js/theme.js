/*
 * Colour-scheme controller — IoTSploit Astro Design System (theme.js).
 *
 * Load in <head> BEFORE any stylesheet so the first paint is already correct
 * (no white flash on a dark page):
 *
 *   <script src="js/theme.js"></script>
 *
 * Three states: 'light', 'dark', 'system' (default). The choice persists in
 * localStorage under `aw-theme`; 'system' follows the OS and keeps following it
 * if the OS flips mid-session.
 *
 * Two hooks are written to <html>, because the site runs two styling systems:
 *
 *   .light / .dark     sets `color-scheme`, which is what the design system's
 *                      light-dark() tokens resolve against (navbar, footer,
 *                      css/ds/*).
 *   data-theme=…       Bulma 1.0's own scheme switch; css/theme.css retunes
 *                      Bulma's dark ramp to the design system's navy.
 *
 * Deviation from the upstream design-system file: it only stamped the class for
 * an explicit 'light'/'dark' preference and left <html> bare under 'system'.
 * Bare <html> is fine for light-dark() (color-scheme: light dark on :root
 * follows the OS) but leaves Bulma and the toggle icon with nothing to match on,
 * so an OS-dark visitor got a dark navbar on a light page. Here both hooks
 * always carry the *resolved* scheme; `preference` keeps the three states.
 */
(() => {
  const KEY = 'aw-theme';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  // Address bar / task switcher tint, kept in step with the page background.
  const THEME_COLOR = { light: '#ffffff', dark: '#030620' };

  const stored = () => {
    try { return localStorage.getItem(KEY); } catch { return null; }
  };
  const resolved = (pref) => (pref === 'system' || !pref ? (media.matches ? 'dark' : 'light') : pref);

  const apply = (pref) => {
    const scheme = resolved(pref);
    root.classList.toggle('dark', scheme === 'dark');
    root.classList.toggle('light', scheme === 'light');
    root.setAttribute('data-theme', scheme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLOR[scheme]);

    root.dispatchEvent(new CustomEvent('themechange', { detail: { preference: pref, resolved: scheme } }));
  };

  const AwTheme = {
    /** 'light' | 'dark' | 'system' */
    get preference() { return stored() || 'system'; },
    /** The scheme actually showing: 'light' | 'dark' */
    get resolved() { return resolved(AwTheme.preference); },
    set(pref) {
      try { pref === 'system' ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, pref); } catch {}
      apply(pref);
    },
    /** Flip between light and dark, leaving 'system' behind. */
    toggle() { AwTheme.set(AwTheme.resolved === 'dark' ? 'light' : 'dark'); },
    onChange(fn) {
      const h = (e) => fn(e.detail);
      root.addEventListener('themechange', h);
      return () => root.removeEventListener('themechange', h);
    },
  };

  apply(AwTheme.preference);
  media.addEventListener('change', () => { if (AwTheme.preference === 'system') apply('system'); });
  window.AwTheme = AwTheme;
})();
