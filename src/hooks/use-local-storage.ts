
"use client";

import { useState, useEffect, useCallback } from 'react';

// Helper function to safely parse JSON
function safelyParseJSON<T>(jsonString: string | null, defaultValue: T): T {
  if (jsonString === null) {
    return defaultValue;
  }
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn("Error parsing JSON from localStorage", error);
    return defaultValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? safelyParseJSON<T>(item, (typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue)) : (typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue);
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);

  // Listen to storage events to sync across tabs (optional)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
         setStoredValue(safelyParseJSON<T>(event.newValue, (typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue)));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);


  // Effect to ensure state is synced with localStorage on initial client mount
  // This is important for Next.js hydration
   useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key);
      const currentInitialValue = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
      const localStorageValue = item ? safelyParseJSON<T>(item, currentInitialValue) : currentInitialValue;
      
      if (JSON.stringify(storedValue) !== JSON.stringify(localStorageValue)) {
         setStoredValue(localStorageValue);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Run only once on mount for the key

  return [storedValue, setValue];
}

