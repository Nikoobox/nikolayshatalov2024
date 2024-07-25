import { useState, useEffect } from "react";

const useScrollPosition = (): [number, boolean] => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [isPastTarget, setIsPastTarget] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrollPosition(window.scrollY);

      // Check if the target element is in view or past it
      const targetElement = document.getElementById("wave-contact");
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const isPast = rect.top <= 0 && rect.bottom <= window.innerHeight;
        setIsPastTarget(isPast);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Initial check in case the user starts at the target element
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return [scrollPosition, isPastTarget];
};

export default useScrollPosition;
