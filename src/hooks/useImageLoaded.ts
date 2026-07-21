import { useCallback, useState } from "react";

// Tracks whether an <img> has finished loading so a skeleton/placeholder can be
// shown until it has. Returns a ref + onLoad handler to spread onto the image.
const useImageLoaded = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // If the image is already cached, `onLoad` can fire before React attaches the
  // handler — catch that via the ref's `complete` flag.
  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setIsLoaded(true);
  }, []);

  const onLoad = () => setIsLoaded(true);

  return { isLoaded, ref, onLoad };
};

export default useImageLoaded;
