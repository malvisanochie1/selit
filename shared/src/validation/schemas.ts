import { z } from 'zod';

import { CATEGORY_SLUGS } from '../catalog/categories';
import { CONDITION_VALUES } from '../catalog/conditions';
import { isValidNigerianNumber } from '../utils/phone';

const email = z.string().trim().toLowerCase().email('Enter a valid email address');

export const PASSWORD_RULES = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(72, 'Use at most 72 characters')
  .regex(/[A-Za-z]/, 'Include at least one letter')
  .regex(/\d/, 'Include at least one number');

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
});

export const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Enter your full name')
    .max(80, 'Keep your name under 80 characters'),
  email,
  password: PASSWORD_RULES,
  accountType: z.enum(['buyer', 'seller']),
});

export const passwordResetSchema = z.object({ email });

export const newPasswordSchema = z
  .object({ password: PASSWORD_RULES, confirm: z.string() })
  .refine((values) => values.password === values.confirm, {
    message: 'The passwords do not match',
    path: ['confirm'],
  });

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(80, 'Keep it under 80 characters'),
  campusLocation: z.string().trim().max(160).optional().default(''),
  department: z.string().trim().max(80, 'Keep it under 80 characters').optional().default(''),
  whatsApp: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || isValidNigerianNumber(value),
      'Enter a valid Nigerian number, e.g. 0803 123 4567',
    ),
  bio: z.string().trim().max(300, 'Keep your bio under 300 characters').optional().default(''),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const MAX_PHOTO_BYTES = 12 * 1024 * 1024;
export const MAX_LISTING_PHOTOS = 5;
export const MIN_APARTMENT_PHOTOS = 2;
export const MAX_APARTMENT_PHOTOS = 8;

export const listingFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Give it a clear title of at least 5 characters')
    .max(90, 'Keep the title under 90 characters'),
  category: z.enum(CATEGORY_SLUGS, { message: 'Choose a category' }),
  condition: z.enum(CONDITION_VALUES, { message: 'Choose the condition' }),
  description: z
    .string()
    .trim()
    .min(20, 'Describe it in at least 20 characters: size, age, any faults')
    .max(2000, 'Keep the description under 2,000 characters'),
  price: z
    .number({ message: 'Enter a price' })
    .int('Use whole naira')
    .min(50, 'Price must be at least ₦50')
    .max(50_000_000, 'That price looks too high'),
  school: z.string().trim().min(3, 'Choose your school'),
  location: z.string().trim().min(3, 'Choose a public meet-up spot').max(120),
  photoCount: z
    .number()
    .min(1, 'Add at least one photo')
    .max(MAX_LISTING_PHOTOS, `Add at most ${MAX_LISTING_PHOTOS} photos`),
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;

const naira = z
  .number({ message: 'Enter an amount' })
  .int('Use whole naira')
  .min(0)
  .max(100_000_000);

export const apartmentFormSchema = z.object({
  title: z.string().trim().min(8, 'Give it a clear title').max(90),
  type: z.enum(['self-contain', 'single-room', 'one-bedroom', 'two-bedroom', 'shared'], {
    message: 'Choose the type',
  }),
  rentPerYear: naira.min(10_000, 'Enter the yearly rent'),
  agencyFee: naira,
  cautionFee: naira,
  agencyName: z.string().trim().max(80).optional().default(''),
  school: z.string().trim().min(3, 'Choose the nearest school'),
  area: z.string().trim().min(2, 'Enter the area or street').max(80),
  distanceToCampus: z.string().trim().min(2, 'e.g. 5 min walk').max(40),
  description: z.string().trim().min(30, 'Describe the room in at least 30 characters').max(2000),
  amenities: z.array(z.string()).max(12),
  photoCount: z
    .number()
    .min(MIN_APARTMENT_PHOTOS, `Add at least ${MIN_APARTMENT_PHOTOS} photos`)
    .max(MAX_APARTMENT_PHOTOS, `Add at most ${MAX_APARTMENT_PHOTOS} photos`),
});

export type ApartmentFormValues = z.infer<typeof apartmentFormSchema>;

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Choose a rating').max(5),
  comment: z
    .string()
    .trim()
    .min(3, 'Say a little about the deal')
    .max(1000, 'Keep it under 1,000 characters'),
});

export const reportSchema = z.object({
  reason: z.string().min(1, 'Choose a reason'),
  details: z.string().trim().max(1000, 'Keep it under 1,000 characters'),
});

/** Prices far below what similar items sell for are a common bait tactic. */
export const SUSPICIOUS_PRICE_RATIO = 0.35;

export function fieldErrorsOf(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
