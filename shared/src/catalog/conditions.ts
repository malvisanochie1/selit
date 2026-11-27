export const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like new' },
  { value: 'good', label: 'Good' },
  { value: 'fairly-used', label: 'Fairly used' },
  { value: 'fair', label: 'Fair' },
] as const;

export type Condition = (typeof CONDITIONS)[number]['value'];

export const CONDITION_VALUES = CONDITIONS.map((option) => option.value) as [
  Condition,
  ...Condition[],
];

export function conditionLabel(value: string) {
  return CONDITIONS.find((option) => option.value === value)?.label ?? 'Used';
}
