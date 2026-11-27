export const REPORT_REASONS = [
  { value: 'scam', label: 'Scam or fake item' },
  { value: 'too-cheap', label: 'Price looks too good to be true' },
  { value: 'upfront-payment', label: 'Asked me to pay before meeting' },
  { value: 'unsafe-location', label: 'Wanted to meet somewhere private' },
  { value: 'already-taken', label: 'No longer available' },
  { value: 'offensive', label: 'Offensive or inappropriate' },
  { value: 'other', label: 'Something else' },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]['value'];

export function reportReasonLabel(value: string) {
  return REPORT_REASONS.find((option) => option.value === value)?.label ?? value;
}
