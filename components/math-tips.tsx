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

      // Prefer the empty flank left of the centered formula (a margin note —
      // it can never cover prose or the formula itself). Fall back to above
      // the equation when the flank is too narrow. In display mode, .katex
      // and .katex-html are full-width blocks; the visual formula is the
      // centered inline .base span(s).
      const display = el.closest('.katex-display');
      const bases = display
        ? Array.from(display.querySelectorAll('.katex-html .base'))
        : [];
      const formulaLeft = bases.length
        ? Math.min(...bases.map((b) => b.getBoundingClientRect().left))
        : eqRect.left;
      const flank = formulaLeft - eqRect.left;

      if (flank > 140) {
        bubble.className = 'math-tip-bubble math-tip-bubble--margin';
        bubble.style.maxWidth = `${Math.min(240, flank - 24)}px`;
        bubble.style.left = `${formulaLeft - 12}px`;
        bubble.style.top = `${termRect.top + termRect.height / 2}px`;
      } else {
        bubble.className = 'math-tip-bubble';
        bubble.style.maxWidth = '';
        const half = bubble.offsetWidth / 2 || 100;
        const cx = termRect.left + termRect.width / 2;
        bubble.style.left = `${Math.max(half + 8, Math.min(cx, window.innerWidth - half - 8))}px`;
        bubble.style.top = `${eqRect.top - 6}px`;
      }
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
