import { useRef, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";

export default function useDebounce(callback: () => void) {
  const ref = useRef<typeof callback>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, 1000);
  }, []);

  return debouncedCallback;
}
