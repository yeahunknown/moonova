import { useState, useRef, useEffect } from 'react';

export const useFadeInAnimation = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const processedElements = useRef<Set<string>>(new Set());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !processedElements.current.has(entry.target.id)) {
            processedElements.current.add(entry.target.id);
            setVisibleSections(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => observerRef.current?.disconnect();
  }, []);

  const setSectionRef = (id: string) => (element: HTMLElement | null) => {
    if (element && observerRef.current && !processedElements.current.has(id)) {
      element.id = id;
      observerRef.current.observe(element);
      // Make immediately visible for above-the-fold content
      if (element.getBoundingClientRect().top < window.innerHeight) {
        processedElements.current.add(id);
        setVisibleSections(prev => new Set(prev).add(id));
      }
    }
  };

  const isVisible = (id: string) => visibleSections.has(id);

  return { setSectionRef, isVisible };
};