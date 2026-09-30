'use client';

import { useEffect } from 'react';

const IDLE_MS = 2000;

/**
 * Fades out the sidebar and TOC (via html.chrome-hidden, see styles.scss)
 * when the mouse hasn't moved for IDLE_MS. Any movement brings them back.
 */
export function IdleChrome() {
  useEffect(() => {
    // Only meaningful on devices with a mouse.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let timer: number | undefined;

    const idle = () => {
      // Don't hide the chrome out from under a cursor resting on it.
      if (document.querySelector('.nextra-sidebar:hover, .nextra-toc:hover')) {
        timer = window.setTimeout(idle, IDLE_MS);
        return;
      }
      document.documentElement.classList.add('chrome-hidden');
    };

    const wake = () => {
      document.documentElement.classList.remove('chrome-hidden');
      window.clearTimeout(timer);
      timer = window.setTimeout(idle, IDLE_MS);
    };

    wake();
    document.addEventListener('mousemove', wake, { passive: true });
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mousemove', wake);
      document.documentElement.classList.remove('chrome-hidden');
    };
  }, []);

  return null;
}
