import { type RefObject, useEffect, useState } from 'react';

export const useScrollProgress = (
  element: RefObject<HTMLDivElement>,
  wrapperElement: RefObject<HTMLDivElement>
) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateScrollProgress = () => {
      if (wrapperElement.current && element.current) {
        const wrapperRect = wrapperElement.current.getBoundingClientRect();
        const elementRect = element.current.getBoundingClientRect();

        // Calculate the maximum distance the element can travel
        const maxTravel = wrapperRect.height - elementRect.height;

        // Get current scroll position
        const currentScroll = elementRect.y - wrapperRect.y;

        if (maxTravel > 0) {
          // Calculate progress as a value between 0 and 1
          const scrollProgress = Math.min(
            Math.max(currentScroll / maxTravel, 0),
            1
          );

          setProgress(scrollProgress);
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', calculateScrollProgress);
    window.addEventListener('resize', calculateScrollProgress);

    // Calculate initial progress
    calculateScrollProgress();

    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', calculateScrollProgress);
      window.removeEventListener('resize', calculateScrollProgress);
    };
  }, []);

  return progress;
};
