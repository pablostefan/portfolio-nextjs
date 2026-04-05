'use client';

import { useEffect, useState } from 'react';

/**
 * Returns `true` once the splash screen exit animation completes.
 * On return visits (no splash), resolves within ~2 frames.
 */
export function useAfterSplash(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) setReady(true);
    };

    window.addEventListener('splash-done', done, { once: true });

    // After effects settle & paint, check if splash is actually present.
    // Double-rAF ensures SplashScreen's state update has rendered.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!document.getElementById('splash-screen')) {
          done();
        }
      });
    });

    return () => {
      cancelled = true;
      window.removeEventListener('splash-done', done);
    };
  }, []);

  return ready;
}
