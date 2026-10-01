'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Math term tooltips (the \tip macro in next.config.mjs emits data-tip).
 *
 * 1. KaTeX places surrounding spacing glue (.mspace) *inside* the annotated
 *    span, making the hover highlight overhang the glyph — move it out.
 * 2. A CSS ::after tooltip anchored to the term lands on top of neighboring
 *    parts of the formula (hover a denominator and the bubble covers the
 *    numerator). Instead, one shared bubble is positioned above the whole
 *    equation, horizontally centered on the hovered term.
 */
export function MathTips() {
  const pathname = usePathname();

  useEffect(() => {
    const bubble = document.createElement('div');
    bubble.className = 'math-tip-bubble';
    document.body.appendChild(bubble);

    const hide = () => {
      bubble.style.opacity = '0';
    };

    const enter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const equation = el.closest('.katex-display, .katex') || el;
      const eqRect = equation.getBoundingClientRect();
      const termRect = el.getBoundingClientRect();
      bubble.textContent = el.getAttribute('data-tip') || '';
      bubble.style.left = `${termRect.left + termRect.width / 2}px`;
      bubble.style.top = `${eqRect.top - 8}px`;
      bubble.style.opacity = '1';
    };

    const terms = Array.from(
      document.querySelectorAll<HTMLElement>('.katex [data-tip]'),
    );

    terms.forEach((el) => {
      // Move spacing glue out of the annotated span (see docblock).
      while (el.lastElementChild?.classList.contains('mspace')) {
        el.parentElement?.insertBefore(el.lastElementChild, el.nextSibling);
      }
      while (el.firstElementChild?.classList.contains('mspace')) {
        el.parentElement?.insertBefore(el.firstElementChild, el);
      }
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', hide);
    });
    window.addEventListener('scroll', hide, { passive: true });

    return () => {
      terms.forEach((el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', hide);
      });
      window.removeEventListener('scroll', hide);
      bubble.remove();
    };
  }, [pathname]);

  return null;
}
