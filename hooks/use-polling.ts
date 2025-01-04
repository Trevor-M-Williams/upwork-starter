import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export function usePolling(ms: number) {
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      console.log("polling");
      router.refresh();
    }, ms);
  }, [router, ms]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return { startPolling, stopPolling };
}
