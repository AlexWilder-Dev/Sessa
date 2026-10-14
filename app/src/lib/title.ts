import { useEffect } from 'react';

const BASE = 'Sessa · All-day bar & café, Herne Hill';

export function useTitle(page: string | null) {
  useEffect(() => {
    document.title = page ? `${page} · Sessa, Herne Hill` : BASE;
  }, [page]);
}
