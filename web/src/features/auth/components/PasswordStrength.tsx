import { cn } from '@/lib/cn';

function score(password: string) {
  let points = 0;
  if (password.length >= 8) points += 1;
  if (password.length >= 12) points += 1;
  if (/\d/.test(password) && /[A-Za-z]/.test(password)) points += 1;
  if (/[^A-Za-z0-9]/.test(password) || /[A-Z]/.test(password)) points += 1;
  return points;
}

const LABELS = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'];
const COLOURS = ['bg-danger-500', 'bg-danger-500', 'bg-amber-500', 'bg-brand-400', 'bg-brand-600'];

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const value = score(password);
  return (
    <div className="mt-2 flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1">
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-500',
              step <= value ? COLOURS[value] : 'bg-ink-100',
            )}
          />
        ))}
      </div>
      <span className="w-16 text-right text-xs font-semibold text-ink-500">{LABELS[value]}</span>
    </div>
  );
}
