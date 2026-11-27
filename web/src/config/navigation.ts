import {
  BadgeCheck,
  Building2,
  Flag,
  Heart,
  House,
  LayoutDashboard,
  LayoutGrid,
  Package,
  Search,
  Settings,
  Shapes,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const PRIMARY_NAV: readonly NavItem[] = [
  { href: '/search', label: 'Browse', icon: Search },
  { href: '/apartments', label: 'Apartments', icon: Building2 },
  { href: '/schools', label: 'Schools', icon: LayoutGrid },
  { href: '/safety', label: 'Safety', icon: ShieldCheck },
];

export const MOBILE_NAV: readonly NavItem[] = [
  { href: '/', label: 'Home', icon: House },
  { href: '/search', label: 'Browse', icon: Search },
  { href: '/apartments', label: 'Homes', icon: Building2 },
  { href: '/saved', label: 'Saved', icon: Heart },
  { href: '/account', label: 'Account', icon: UserRound },
];

export const ACCOUNT_NAV: readonly NavItem[] = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/seller', label: 'My listings', icon: Package },
  { href: '/seller/apartments', label: 'My apartments', icon: Building2 },
  { href: '/seller/reviews', label: 'Reviews', icon: Star },
  { href: '/saved', label: 'Saved', icon: Heart },
  { href: '/account/verification', label: 'Verification', icon: BadgeCheck },
  { href: '/account/profile', label: 'Profile', icon: UserRound },
  { href: '/account/settings', label: 'Settings', icon: Settings },
];

export const ADMIN_NAV: readonly NavItem[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Listings', icon: Package },
  { href: '/admin/apartments', label: 'Apartments', icon: Building2 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: Shapes },
  { href: '/admin/reports', label: 'Reports', icon: Flag },
  { href: '/admin/verifications', label: 'Verifications', icon: BadgeCheck },
];

export const FOOTER_NAV = [
  {
    title: 'Marketplace',
    links: [
      { href: '/search', label: 'Browse items' },
      { href: '/categories', label: 'Categories' },
      { href: '/apartments', label: 'Apartments' },
      { href: '/schools', label: 'Schools' },
      { href: '/sell', label: 'Sell on Selit' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { href: '/safety', label: 'Safety centre' },
      { href: '/legal/community-guidelines', label: 'Community rules' },
      { href: '/account/verification', label: 'Get verified' },
      { href: '/help#report', label: 'Report a problem' },
    ],
  },
  {
    title: 'Selit',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/help', label: 'Help & FAQ' },
      { href: '/legal/terms', label: 'Terms' },
      { href: '/legal/privacy', label: 'Privacy' },
    ],
  },
] as const;
