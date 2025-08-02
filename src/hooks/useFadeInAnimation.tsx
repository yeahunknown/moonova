import { useState, useRef, useEffect } from 'react';

export const useFadeInAnimation = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => observerRef.current?.disconnect();
  }, []);

  const setSectionRef = (id: string) => (element: HTMLElement | null) => {
    if (element && observerRef.current) {
      element.id = id;
      observerRef.current.observe(element);
    }
  };

  const isVisible = (id: string) => visibleSections.has(id);

  return { setSectionRef, isVisible };
};