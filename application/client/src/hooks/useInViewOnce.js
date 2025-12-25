/**
 * useInViewOnce.js
 * ----------------
 * A React hook that detects when an element enters the viewport. Only fires
 * once, making it perfect for triggering entrance animations.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import { useState, useEffect, useRef } from 'react';

export function useInViewOnce(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Optionally unobserve after first trigger
          if (options.unobserveOnVisible !== false) {
            observer.unobserve(element);
          }
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options.threshold, options.rootMargin, options.unobserveOnVisible]);

  return [ref, isInView];
}

