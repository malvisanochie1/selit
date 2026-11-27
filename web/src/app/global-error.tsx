'use client';

import './globals.css';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-NG">
      <body className="flex min-h-dvh items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-3xl font-semibold text-ink-900">Selit hit a snag</h1>
          <p className="mt-3 text-ink-500">
            Please reload the page. If it keeps happening, try again shortly.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 h-11 cursor-pointer rounded-2xl bg-brand-500 px-5 font-semibold text-white"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
