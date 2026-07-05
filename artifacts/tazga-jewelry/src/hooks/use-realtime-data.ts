import { useState, useEffect, useRef } from "react";
import type { Unsubscribe } from "firebase/firestore";

/**
 * Subscribe to a real-time data source (Firestore onSnapshot or mock event listener).
 * The hook automatically re-renders when data changes — admin edits appear instantly
 * for all users without needing a manual refresh.
 *
 * Usage:
 *   const products = useRealtimeData(
 *     (cb) => productsService.subscribeAll(cb),
 *     []  // deps
 *   );
 *
 * The returned `data` is typed as `T` (never null after first load) — use the `loading`
 * flag to gate your UI.
 */
export function useRealtimeData<T>(
  subscribeFn: (callback: (data: T) => void) => Unsubscribe,
  deps: React.DependencyList = []
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    try {
      // Unsubscribe from previous subscription if any
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      const unsub = subscribeFn((newData) => {
        if (mounted) {
          setData(newData);
          setLoading(false);
          setError(null);
        }
      });
      unsubscribeRef.current = unsub;
    } catch (err) {
      if (mounted) {
        setError(err as Error);
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

/**
 * Subscribe to a real-time data source with a fallback default value.
 * Use this when you want to ensure data is never null (e.g., empty array default).
 *
 * Usage:
 *   const products = useRealtimeDataWithDefault<Product[]>(
 *     (cb) => productsService.subscribeAll(cb),
 *     [],
 *     []
 *   );
 */
export function useRealtimeDataWithDefault<T>(
  subscribeFn: (callback: (data: T) => void) => Unsubscribe,
  deps: React.DependencyList,
  defaultValue: T
): { data: T; loading: boolean; error: Error | null } {
  const { data, loading, error } = useRealtimeData<T>(subscribeFn, deps);
  return { data: data ?? defaultValue, loading, error };
}

/**
 * Subscribe to a single document by ID/slug with real-time updates.
 */
export function useRealtimeDoc<T>(
  subscribeFn: (callback: (data: T | null) => void) => Unsubscribe,
  deps: React.DependencyList = []
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    try {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      const unsub = subscribeFn((newData) => {
        if (mounted) {
          setData(newData);
          setLoading(false);
          setError(null);
        }
      });
      unsubscribeRef.current = unsub;
    } catch (err) {
      if (mounted) {
        setError(err as Error);
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
