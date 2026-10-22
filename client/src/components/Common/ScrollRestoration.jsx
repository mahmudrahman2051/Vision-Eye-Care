import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Universal Scroll Restoration Manager
 * - Forward navigation (PUSH / REPLACE): Always resets scroll to the very top (0, 0)
 * - Backward/History navigation (POP): Restores the exact scroll position where the user was
 */
export default function ScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositionsRef = useRef(new Map());
  const currentLocationRef = useRef(location);

  currentLocationRef.current = location;

  // Continuously record scroll positions
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const loc = currentLocationRef.current;
          const pos = { x: window.scrollX, y: window.scrollY };

          if (loc.key) {
            scrollPositionsRef.current.set(loc.key, pos);
            try {
              sessionStorage.setItem(`vec_scroll_${loc.key}`, JSON.stringify(pos));
            } catch {}
          }

          const pathKey = `${loc.pathname}${loc.search}`;
          scrollPositionsRef.current.set(pathKey, pos);
          try {
            sessionStorage.setItem(`vec_scroll_path_${pathKey}`, JSON.stringify(pos));
          } catch {}

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle location changes (Forward vs Backward)
  useEffect(() => {
    // Disable native browser auto-scroll restoration so our deterministic logic takes control
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (navigationType === 'POP') {
      // BACKWARD / FORWARD HISTORY TRAVERSAL:
      const pathKey = `${location.pathname}${location.search}`;
      let saved = location.key ? scrollPositionsRef.current.get(location.key) : null;

      if (!saved && location.key) {
        try {
          const stored = sessionStorage.getItem(`vec_scroll_${location.key}`);
          if (stored) saved = JSON.parse(stored);
        } catch {}
      }

      if (!saved) {
        saved = scrollPositionsRef.current.get(pathKey);
      }

      if (!saved) {
        try {
          const stored = sessionStorage.getItem(`vec_scroll_path_${pathKey}`);
          if (stored) saved = JSON.parse(stored);
        } catch {}
      }

      if (saved && typeof saved.y === 'number') {
        const restore = () => {
          window.scrollTo({
            top: saved.y,
            left: saved.x || 0,
            behavior: 'instant',
          });
        };

        restore();
        requestAnimationFrame(restore);
        const t1 = setTimeout(restore, 50);
        const t2 = setTimeout(restore, 150);
        const t3 = setTimeout(restore, 350);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }
    } else {
      // FORWARD NAVIGATION (Link click, button navigation, PUSH / REPLACE):
      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        if (target) {
          target.scrollIntoView();
          return;
        }
      }

      // Start every new forward page at the top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
    }
  }, [location.key, location.pathname, location.search, navigationType, location.hash]);

  return null;
}
