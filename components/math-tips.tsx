'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Math term tooltips (the \tip macro in next.config.mjs emits data-tip).
 *
 * - One shared bubble, positioned above the whole equation so it never
 *   covers neighboring parts of the formula.
 * - Listeners are delegated to the document, so they work regardless of
 *   when the math content appears.
 * - KaTeX places surrounding spacing glue (.mspace) *inside* annotated
 *   spans, making the hover highlight overhang the glyph — moved out once
 *   per term (eagerly on mount/navigation, lazily as a fallback on hover).
 */

function fixSpacing(el: HTMLElement) {
  if (el.dataset.tipFixed) return;
  el.dataset.tipFixed = '1';
  while (el.lastElementChild?.classList.contains('mspace')) {
    el.parentElement?.insertBefore(el.lastElementChild, el.nextSibling);
  }
  while (el.firstElementChild?.classList.contains('mspace')) {
    el.parentElement?.insertBefore(el.firstElementChild, el);
  }
}

export function MathTips() {
  const pathname = usePathname();

  useEffect(() => {
    document
      .querySelectorAll<HTMLElement>('.katex [data-tip]')
      .forEach(fixSpacing);
  }, [pathname]);

  useEffect(() => {
    const bubble = document.createElement('div');
    bubble.className = 'math-tip-bubble';
    document.body.appendChild(bubble);

    const hide = () => {
      bubble.style.opacity = '0';
    };

    const over = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(
        '.katex [data-tip]',
      );
      if (!el) {
        hide();
        return;
      }
      fixSpacing(el);
      const eq = el.closest('.katex-display') || el.closest('.katex') || el;
      const eqRect = eq.getBoundingClientRect();
      const termRect = el.getBoundingClientRect();
      bubble.textContent = el.getAttribute('data-tip') || '';
      // Center on the term, but keep the bubble on screen.
      const half = bubble.offsetWidth / 2 || 100;
      const cx = termRect.left + termRect.width / 2;
      bubble.style.left = `${Math.max(half + 8, Math.min(cx, window.innerWidth - half - 8))}px`;
      bubble.style.top = `${eqRect.top - 6}px`;
      bubble.style.opacity = '1';
    };

    document.addEventListener('mouseover', over);
    window.addEventListener('scroll', hide, { passive: true });
    return () => {
      document.removeEventListener('mouseover', over);
      window.removeEventListener('scroll', hide);
      bubble.remove();
    };
  }, []);

  return null;
}
