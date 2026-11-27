import type { AdminUser, Report, VerificationRequest } from '../types';
import { SAMPLE_SELLERS, SAMPLE_USERS } from './people';

const at = (daysAgo: number) =>
  new Date(Date.parse('2026-11-26T09:00:00.000Z') - daysAgo * 86_400_000).toISOString();

export const SAMPLE_ADMIN_USERS: AdminUser[] = [
  ...SAMPLE_SELLERS.map((seller, index) => ({
    id: seller.id,
    email: `${seller.fullName.split(' ')[0].toLowerCase()}@example.com`,
    fullName: seller.fullName,
    campusLocation: seller.campusLocation,
    role: seller.role,
    status: index === 5 ? ('watchlist' as const) : ('active' as const),
    verificationStatus: seller.verificationStatus,
    profileImageUrl: '',
    createdAt: seller.createdAt,
  })),
  ...['Chinedu Okoro', 'Favour Ekeh', 'Samuel Ighalo', 'Esther Ojo', 'David Uche', 'Grace Obi'].map(
    (fullName, index) => ({
      id: `buyer-${index}`,
      email: `${fullName.split(' ')[0].toLowerCase()}@example.com`,
      fullName,
      campusLocation: 'Delta State Polytechnic, Ogwashi-Uku',
      role: 'buyer' as const,
      status: index === 4 ? ('banned' as const) : ('active' as const),
      verificationStatus: 'unverified' as const,
      profileImageUrl: '',
      createdAt: at(10 + index * 7),
    }),
  ),
  { ...SAMPLE_USERS[1], campusLocation: SAMPLE_USERS[1].campusLocation, profileImageUrl: '' },
];

export const SAMPLE_REPORTS: Report[] = [
  {
    id: 'rep-1',
    targetType: 'listing',
    targetId: 'lst-phone',
    targetTitle: '128GB smartphone, battery health 86%',
    reason: 'too-cheap',
    details: 'Price changed twice in one day.',
    status: 'open',
    reporterName: 'Favour Ekeh',
    createdAt: at(0),
  },
  {
    id: 'rep-2',
    targetType: 'user',
    targetId: 'user-emeka',
    targetTitle: 'Emeka Dike',
    reason: 'upfront-payment',
    details: 'Asked me to send ₦2,000 for transport before meeting.',
    status: 'reviewing',
    reporterName: 'Chinedu Okoro',
    createdAt: at(1),
  },
  {
    id: 'rep-3',
    targetType: 'apartment',
    targetId: 'apt-single-room',
    targetTitle: 'Single room in a quiet lodge',
    reason: 'already-taken',
    details: '',
    status: 'open',
    reporterName: 'Esther Ojo',
    createdAt: at(2),
  },
];

export const SAMPLE_VERIFICATIONS: VerificationRequest[] = [
  {
    id: 'ver-1',
    userId: 'user-kelechi',
    fullName: 'Kelechi Obi',
    email: 'kelechi@example.com',
    idType: 'nin',
    idNumberLast4: '4821',
    idPhotoUrl: '',
    selfieUrls: [],
    warning: null,
    submittedAt: at(0),
    status: 'pending',
  },
  {
    id: 'ver-2',
    userId: 'user-emeka',
    fullName: 'Emeka Dike',
    email: 'emeka@example.com',
    idType: 'voters-card',
    idNumberLast4: '7730',
    idPhotoUrl: '',
    selfieUrls: [],
    warning: 'ID matches a banned account',
    submittedAt: at(1),
    status: 'pending',
  },
];
