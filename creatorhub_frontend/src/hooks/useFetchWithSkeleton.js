import { useState, useEffect } from "react";

// PUBLIC_INTERFACE
export default function useFetchWithSkeleton(fetcher, deps = []) {
  /** Returns [data, loading, error] with skeleton support */
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetcher()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, deps);
  return [data, loading, error];
}
