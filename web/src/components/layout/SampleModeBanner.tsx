import { isSampleMode } from '@/config/env';

/** Makes it obvious when the site is running on demo data, so nobody mistakes it for real listings. */
export function SampleModeBanner() {
  if (!isSampleMode) return null;
  return (
    <div className="bg-amber-500 px-4 py-1.5 text-center text-xs font-semibold text-ink-950">
      Demo mode: everything you see is sample data.
    </div>
  );
}
