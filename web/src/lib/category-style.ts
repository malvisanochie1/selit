import type { CategoryIcon, CategoryTone } from '@selit/shared';
import {
  BedDouble,
  BookOpen,
  CookingPot,
  Dumbbell,
  GraduationCap,
  Lamp,
  Laptop,
  Shapes,
  Shirt,
  Smartphone,
  Sofa,
  type LucideIcon,
} from 'lucide-react';

export const CATEGORY_ICONS: Record<CategoryIcon, LucideIcon> = {
  BedDouble,
  BookOpen,
  CookingPot,
  Dumbbell,
  GraduationCap,
  Lamp,
  Laptop,
  Shapes,
  Shirt,
  Smartphone,
  Sofa,
};

export const CATEGORY_TINTS: Record<CategoryTone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  amber: 'bg-amber-50 text-amber-700',
  danger: 'bg-danger-50 text-danger-700',
  info: 'bg-info-50 text-info-700',
  ink: 'bg-ink-100 text-ink-700',
};
