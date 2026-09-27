import { useState, useCallback } from 'react';
import { safeGetStorage, safeSetStorage } from '../utils/qrStorage';

/**
 * Custom React hook for syncing state with browser localStorage safely.
 */
export function useLocalStorage(key, initialValue) {
  const [storageError, setStorageError] = useState(null);

  const [storedValue, setStoredValue] = useState(() => {
    const { value, error } = safeGetStorage(key, initialValue);
    if (error) {
      setStorageError(error);
    }
    return value;
  });

  const setValue = useCallback(
    (valueOrUpdater) => {
      try {
        setStoredValue((prev) => {
          const nextValue =
            typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater;
          const { ok, error } = safeSetStorage(key, nextValue);
          if (!ok && error) {
            setStorageError(error);
          } else {
            setStorageError(null);
          }
          return nextValue;
        });
      } catch (err) {
        setStorageError(err?.message || 'Unable to update localStorage.');
      }
    },
    [key]
  );

  return [storedValue, setValue, storageError];
}
