import type { ApartmentType } from '../types';

export const APARTMENT_TYPES: readonly { value: ApartmentType; label: string }[] = [
  { value: 'self-contain', label: 'Self-contain' },
  { value: 'single-room', label: 'Single room' },
  { value: 'one-bedroom', label: '1-bedroom flat' },
  { value: 'two-bedroom', label: '2-bedroom flat' },
  { value: 'shared', label: 'Shared / roommate' },
];

export const AMENITIES = [
  'Running water',
  'Prepaid meter',
  'Fenced and gated',
  'Security',
  'Tiled floor',
  'Wardrobe',
  'Kitchen',
  'Solar or inverter',
  'Good network',
  'Parking',
] as const;

/** Listings must be renewed this often, so stale "vacant" houses disappear on their own. */
export const RENEWAL_DAYS = 14;

export function apartmentTypeLabel(type: ApartmentType) {
  return APARTMENT_TYPES.find((option) => option.value === type)?.label ?? 'Apartment';
}

export function daysSince(isoDate: string, now = Date.now()) {
  return Math.floor((now - Date.parse(isoDate)) / 86_400_000);
}

export function daysUntilRenewal(lastRenewedAt: string, now = Date.now()) {
  return Math.max(0, RENEWAL_DAYS - daysSince(lastRenewedAt, now));
}
