export type Pagination = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type Paginated<T> = {
  items: T[];
  pagination: Pagination;
};

export function paginate<T>(items: readonly T[], page = 1, limit = 12) {
  const safeLimit = Math.max(1, Math.min(100, limit));
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / safeLimit));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * safeLimit;
  return {
    items: items.slice(start, start + safeLimit),
    pagination: { total, page: safePage, limit: safeLimit, pages },
  };
}

/** A short, realistic pause so sample mode shows the same loading states as live data. */
export function sampleDelay(ms = 380) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
