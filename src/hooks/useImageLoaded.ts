import { useCallback, useState } from "react";

const useImageLoaded = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setIsLoaded(true);
  }, []);

  const onLoad = () => setIsLoaded(true);

  return { isLoaded, ref, onLoad };
};

export default useImageLoaded;
