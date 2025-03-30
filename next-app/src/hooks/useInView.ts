import { useEffect, useRef, useState } from 'react';

const useInView = (
  options?: IntersectionObserverInit & {
    disableRecheck?: boolean;
  }
) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (options?.disableRecheck && isInView) return;

      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isInView] as const;
};

export default useInView;
