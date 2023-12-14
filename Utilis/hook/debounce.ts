import { useState, useCallback, useRef } from 'react';

function useDebouncedApi<T>(apiFunction: () => Promise<T>, delay: number): [T | undefined, () => void] {
  const [apiData, setApiData] = useState<T>();
  let timeoutId = useRef<NodeJS.Timeout>();
  const debouncedApiCall = useCallback(
    debounce(() => {
      apiFunction()
        .then((data: T) => {
          setApiData(data);
        })
        .catch((error: any) => {
          console.error(error);
          setApiData(undefined);
        });
    }, delay),
    [apiFunction, delay]
  );

  function debounce(func: () => void, delay: number) {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      timeoutId.current = setTimeout(func, delay);
    };
  }

  return [apiData, debouncedApiCall];
}

export { useDebouncedApi };
