import { RefObject, useEffect, useState } from "react";

export function useInViewport(
  element: RefObject<HTMLElement>,
  rootMargin: `${string}px`,
  isMaintain: boolean = true
) {
  const [isVisible, setState] = useState(false);
  useEffect(() => {
    if (element.current) {
      const target = element.current;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (isMaintain) {
            if (entry.isIntersecting) setState(true);
          } else {
            setState(entry.isIntersecting);
          }
        },
        { rootMargin }
      );

      observer.observe(target);
      return () => observer.unobserve(target);
    }
  }, []);

  return isVisible;
}
