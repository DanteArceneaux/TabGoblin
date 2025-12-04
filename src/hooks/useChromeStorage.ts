/**
 * React hook for syncing state with chrome.storage
 */

import { useEffect, useState } from 'react';

export function useChromeStorage<T>(key: string, defaultValue: T): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial value from storage
  useEffect(() => {
    chrome.storage.local.get(key).then((result) => {
      if (result[key] !== undefined) {
        setValue(result[key]);
      }
      setIsLoading(false);
    });
  }, [key]);

  // Listen for external storage changes
  useEffect(() => {
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[key]) {
        setValue(changes[key].newValue);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, [key]);

  // Update storage when value changes
  const updateValue = (newValue: T) => {
    setValue(newValue);
    chrome.storage.local.set({ [key]: newValue });
  };

  return [value, updateValue, isLoading];
}

