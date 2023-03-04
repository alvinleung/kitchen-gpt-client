import { MutableRefObject, useEffect, useRef } from "react";

export function useStateRef<T>(state: T): MutableRefObject<T> {
  const ref = useRef<T>(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);

  return ref;
}
