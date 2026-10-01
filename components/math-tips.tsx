'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * KaTeX's \htmlData (our \tip macro) wraps its term in a span — but KaTeX
 * also places the surrounding spacing glue (.mspace) *inside* that span, so
 * the hover highlight overhangs the glyph. Move leading/trailing spacing out
 * so the highlight hugs the symbol.
 */
export function MathTips() {
  const pathname = usePathname();

  useEffect(() => {
    document.querySelectorAll('.katex [data-tip]').forEach((el) => {
      while (el.lastElementChild?.classList.contains('mspace')) {
        el.parentElement?.insertBefore(el.lastElementChild, el.nextSibling);
      }
      while (el.firstElementChild?.classList.contains('mspace')) {
        el.parentElement?.insertBefore(el.firstElementChild, el);
      }
    });
  }, [pathname]);

  return null;
}
