'use client';

import { useEffect, useRef, useState } from "react";

export default function useLocalStorageCourseWatcher(key: string) {
  const [array, setArray] = useState<any[]>([]);
  const prevLength = useRef(0);

  useEffect(() => {
    const checkForUpdate = () => {
      const data = localStorage.getItem(key);
      if (!data) return;

      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length !== prevLength.current) {
          prevLength.current = parsed.length;
          setArray(parsed);
        }
      } catch {
        // ignore invalid JSON
      }
    };

    // Load initial value
    checkForUpdate();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) checkForUpdate();
    };

    window.addEventListener("storage", handleStorage);
    const interval = setInterval(checkForUpdate, 500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [key]);

  return array;
}
