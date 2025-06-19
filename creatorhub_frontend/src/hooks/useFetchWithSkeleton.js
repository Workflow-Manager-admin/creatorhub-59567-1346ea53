import { useState, useEffect } from "react";

// PUBLIC_INTERFACE
export default function useFetchWithSkeleton(fetcher, deps = []) {
  /** 
   * Returns [data, loading, error] with skeleton support.
   * Simulate network latency for demo purposes to visualize skeleton/Loader states. 
   */
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    // Simulate async fetch with artificial delay for skeleton UX.
    fetcher()
      .then(result => {
        // Minimum fake load time to ensure skeleton is always visible, for UX demo.
        setTimeout(() => {
          if (!cancelled) setData(result);
        }, 900 + Math.random() * 600); // at least 900ms, up to 1.5s
      })
      .catch(e => !cancelled && setError(e))
      .finally(() => {
        setTimeout(() => { if (!cancelled) setLoading(false); }, 900);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, deps);
  return [data, loading, error];
}

