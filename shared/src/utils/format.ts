import { SITE } from '../config/site';

const nairaFormatter = new Intl.NumberFormat(SITE.locale, {
  style: 'currency',
  currency: SITE.currency,
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat(SITE.locale, {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatNaira(amount: number) {
  return nairaFormatter.format(amount);
}

export function formatCompact(value: number) {
  return compactFormatter.format(value);
}

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeTime(isoDate: string, now = Date.now()) {
  const seconds = Math.max(0, Math.round((now - new Date(isoDate).getTime()) / 1000));
  if (Number.isNaN(seconds)) return '';
  if (seconds < MINUTE) return 'Just now';
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)}m ago`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h ago`;
  if (seconds < 7 * DAY) return `${Math.floor(seconds / DAY)}d ago`;
  return formatDate(isoDate);
}

export function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString(SITE.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count.toLocaleString(SITE.locale)} ${count === 1 ? singular : plural}`;
}
