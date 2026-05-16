import { useEffect, useRef, useState } from 'react';

type Options = {
  rootMargin?: string;
  threshold?: number | number[];
  /** When true, the hook stops observing after the first time it sees the element. */
  once?: boolean;
};

export function useInView<T extends Element = HTMLDivElement>(
  options: Options = {},
): { ref: React.MutableRefObject<T | null>; inView: boolean } {
  const { rootMargin = '0px', threshold = 0.05, once = false } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, inView };
}
