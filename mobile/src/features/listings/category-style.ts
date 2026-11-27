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
} from 'lucide-react-native';

import { COLORS } from '@/theme';

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

export const CATEGORY_TONES: Record<CategoryTone, { box: string; color: string }> = {
  brand: { box: 'bg-brand-50', color: COLORS.brand[700] },
  amber: { box: 'bg-amber-50', color: COLORS.amber[700] },
  danger: { box: 'bg-danger-50', color: COLORS.danger[700] },
  info: { box: 'bg-info-50', color: COLORS.info[700] },
  ink: { box: 'bg-ink-100', color: COLORS.ink[700] },
};
