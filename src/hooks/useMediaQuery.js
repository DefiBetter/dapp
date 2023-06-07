import { useCallback, useEffect, useState } from "react";

export default function useMediaQuery(width) {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e) => {
    setTargetReached(e.matches);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener("change", updateTarget);
    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeEventListener("change", updateTarget);
  }, []);

  return targetReached;
}
