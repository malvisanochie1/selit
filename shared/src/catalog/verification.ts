export type IdType = 'nin' | 'voters-card' | 'drivers-licence' | 'passport';

export const ID_TYPES: readonly { value: IdType; label: string; pattern: RegExp; hint: string }[] =
  [
    { value: 'nin', label: 'NIN slip or card', pattern: /^\d{11}$/, hint: '11 digits' },
    {
      value: 'voters-card',
      label: "Voter's card",
      pattern: /^[A-Z0-9]{19}$/i,
      hint: '19 characters',
    },
    {
      value: 'drivers-licence',
      label: "Driver's licence",
      pattern: /^[A-Z0-9-]{8,15}$/i,
      hint: '8 to 15 characters',
    },
    {
      value: 'passport',
      label: 'International passport',
      pattern: /^[A-Z]\d{8}$/i,
      hint: 'A letter and 8 digits',
    },
  ];

export function idTypeLabel(value: IdType) {
  return ID_TYPES.find((option) => option.value === value)?.label ?? 'ID';
}

/** Spaces and dashes people type in are ignored. */
export function normaliseIdNumber(value: string) {
  return value.replace(/[\s-]/g, '').toUpperCase();
}
