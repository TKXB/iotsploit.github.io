/*
 * Progressive enhancement for the shared navbar (navbar.html).
 *
 * navbar.html is injected with innerHTML, so a <script> inside the fragment would
 * never execute — this file is loaded by the page instead and waits for the
 * fragment to appear. Everything here is optional polish: the navbar renders and
 * the mobile menu works (pure CSS) without it.
 *
 *   - .is-scrolled on the header as soon as the page scrolls, which swaps the
 *     transparent bar for the blurred surface + shadow.
 *   - .is-active on the nav link matching the current page.
 *   - closes the mobile menu when a link inside it is followed.
 *   - the sun/moon button, wired to window.AwTheme (js/theme.js).
 *
 * The theme button is the one piece that is not merely polish: without this file
 * the icon still shows the right scheme (CSS keys off html.dark) but clicking it
 * does nothing, and without js/theme.js the button hides itself rather than
 * offering a switch that cannot persist.
 */
(function () {
  'use strict';

  // The design system's own value here is 20, but that assumes a hero pulled up
  // under the header. These pages reserve space for the bar instead, so during
  // those 20px the reserved strip slides up behind a still-transparent header and
  // the bar looks like it is shrinking. Switching on the first pixel closes that
  // window; overscroll reports y <= 0, so the rest state still wins at the top.
  var SCROLL_THRESHOLD = 0;

  function currentPage() {
    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf('/') + 1);
    return file === '' ? 'index.html' : file;
  }

  function markActive(header) {
    var page = currentPage();
    var links = header.querySelectorAll('.iots-navlink[data-nav-path], .iots-menu a[href]');

    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var target = link.getAttribute('data-nav-path') || link.getAttribute('href') || '';
      if (target.indexOf('://') !== -1) continue;

      var matches = target === page ||
        (target === 'blog/' && window.location.pathname.indexOf('/blog/') !== -1);
      if (!matches) continue;

      if (link.classList.contains('iots-navlink')) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        // A sub-item is current: light up its parent trigger too.
        link.setAttribute('aria-current', 'page');
        var group = link.closest('li').parentNode.closest('li');
        var trigger = group && group.querySelector('.iots-navlink');
        if (trigger) trigger.classList.add('is-active');
      }
    }
  }

  function trackScroll(header) {
    // Deliberately not throttled through requestAnimationFrame: a single dropped
    // frame would leave the pending flag set and freeze the header for the rest of
    // the page's life. Comparing against the last applied state is cheaper anyway —
    // it writes to the DOM only on the two transitions, not on every scroll event.
    var applied = null;

    function apply() {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      var scrolled = y > SCROLL_THRESHOLD;
      if (scrolled === applied) return;
      applied = scrolled;
      header.classList.toggle('is-scrolled', scrolled);
    }

    window.addEventListener('scroll', apply, { passive: true });
    apply();
  }

  function closeMenuOnNavigate(header) {
    var toggle = header.querySelector('#iots-nav-toggle');
    if (!toggle) return;
    header.addEventListener('click', function (event) {
      if (event.target.closest('a[href]')) toggle.checked = false;
    });
  }

  function wireThemeToggle(header) {
    var button = header.querySelector('.iots-theme-toggle');
    if (!button) return;

    // js/theme.js owns the scheme; a button that cannot change or remember
    // anything is worse than no button, so drop it if the script is missing.
    if (!window.AwTheme) {
      button.hidden = true;
      return;
    }

    function sync() {
      var dark = window.AwTheme.resolved === 'dark';
      button.setAttribute('aria-pressed', dark ? 'true' : 'false');
    }

    button.addEventListener('click', function () {
      window.AwTheme.toggle();
    });
    // Also covers the OS flipping while the preference is still 'system'.
    window.AwTheme.onChange(sync);
    sync();
  }

  function init(header) {
    if (header.dataset.navbarReady) return;
    header.dataset.navbarReady = 'true';
    markActive(header);
    trackScroll(header);
    closeMenuOnNavigate(header);
    wireThemeToggle(header);
  }

  function watch() {
    var header = document.querySelector('.iots-header');
    if (header) {
      init(header);
      return;
    }

    var placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder || !window.MutationObserver) return;

    var observer = new MutationObserver(function () {
      var found = placeholder.querySelector('.iots-header');
      if (!found) return;
      observer.disconnect();
      init(found);
    });
    observer.observe(placeholder, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch);
  } else {
    watch();
  }
})();
