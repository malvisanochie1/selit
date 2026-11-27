type FormSectionProps = {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function FormSection({ step, title, description, children }: FormSectionProps) {
  return (
    <section className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
      <header className="mb-5 flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-ink-900 font-display text-sm font-bold text-white">
          {step}
        </span>
        <div>
          <h2 className="font-sans text-lg font-semibold text-ink-900">{title}</h2>
          {description ? <p className="mt-0.5 text-sm text-ink-500">{description}</p> : null}
        </div>
      </header>
      {children}
    </section>
  );
}
