import { Logo } from './Logo';

type StatusScreenProps = {
  code: string;
  title: string;
  description: string;
  actions: React.ReactNode;
};

/** Full-page message used for not found and unexpected errors. */
export function StatusScreen({ code, title, description, actions }: StatusScreenProps) {
  return (
    <main id="main" className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-brand-100/60 blur-3xl"
      />
      <div className="relative container-page flex h-20 items-center">
        <Logo />
      </div>
      <div className="relative container-page flex flex-1 flex-col items-center justify-center pb-24 text-center">
        <p className="font-display text-[7rem] leading-none font-bold tracking-tighter text-ink-100 sm:text-[10rem]">
          {code}
        </p>
        <h1 className="-mt-6 text-3xl font-semibold text-ink-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-md text-ink-500">{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
      </div>
    </main>
  );
}
