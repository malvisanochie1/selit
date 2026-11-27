import type { PublicProfile, SessionUser } from '../types';

const DSPG = 'Delta State Polytechnic, Ogwashi-Uku';

export const SAMPLE_SELLERS: readonly PublicProfile[] = [
  {
    id: 'user-ada',
    fullName: 'Ada Okafor',
    campusLocation: DSPG,
    department: 'Computer Science',
    bio: 'Final-year student clearing out my hostel before NYSC. Everything is clean and works well.',
    whatsApp: '08031234567',
    profileImageUrl: '',
    role: 'seller',
    averageRating: 4.8,
    reviewCount: 12,
    verificationStatus: 'verified',
    createdAt: '2026-02-10T09:00:00.000Z',
  },
  {
    id: 'user-tobi',
    fullName: 'Tobi Eze',
    campusLocation: DSPG,
    department: 'Electrical Engineering',
    bio: 'I fix and sell fairly used electronics. Test before you pay, always.',
    whatsApp: '08062345678',
    profileImageUrl: '',
    role: 'seller',
    averageRating: 4.6,
    reviewCount: 9,
    verificationStatus: 'verified',
    createdAt: '2025-10-02T09:00:00.000Z',
  },
  {
    id: 'user-ifeoma',
    fullName: 'Ifeoma Nwachukwu',
    campusLocation: 'Delta State University, Abraka',
    department: 'Mass Communication',
    bio: 'Graduating soon. Kitchen things, books and room décor.',
    whatsApp: '08093456789',
    profileImageUrl: '',
    role: 'seller',
    averageRating: 4.9,
    reviewCount: 17,
    verificationStatus: 'verified',
    createdAt: '2025-08-14T09:00:00.000Z',
  },
  {
    id: 'user-kelechi',
    fullName: 'Kelechi Obi',
    campusLocation: 'Federal University of Petroleum Resources, Effurun',
    department: 'Petroleum Engineering',
    bio: 'Textbooks and gadgets. I reply fast on WhatsApp.',
    whatsApp: '07014567890',
    profileImageUrl: '',
    role: 'seller',
    averageRating: 4.4,
    reviewCount: 5,
    verificationStatus: 'pending',
    createdAt: '2026-09-21T09:00:00.000Z',
  },
  {
    id: 'user-blessing',
    fullName: 'Blessing Omoregie',
    campusLocation: 'Dennis Osadebay University, Asaba',
    department: 'Accounting',
    bio: 'Fashion and room bits. Meet-ups at the main gate only.',
    whatsApp: '08125678901',
    profileImageUrl: '',
    role: 'seller',
    averageRating: 4.7,
    reviewCount: 8,
    verificationStatus: 'verified',
    createdAt: '2026-01-05T09:00:00.000Z',
  },
  {
    id: 'user-emeka',
    fullName: 'Emeka Dike',
    campusLocation: 'Delta State University of Science and Technology, Ozoro',
    department: 'Mechanical Engineering',
    bio: 'New here. Selling my first-year things.',
    whatsApp: '09036789012',
    profileImageUrl: '',
    role: 'seller',
    averageRating: 0,
    reviewCount: 0,
    verificationStatus: 'unverified',
    createdAt: '2026-11-18T09:00:00.000Z',
  },
];

export function findSampleSeller(id: string) {
  return SAMPLE_SELLERS.find((seller) => seller.id === id) ?? null;
}

export const SAMPLE_USERS: readonly SessionUser[] = [
  {
    id: 'user-ada',
    email: 'ada.okafor@example.com',
    fullName: 'Ada Okafor',
    role: 'seller',
    status: 'active',
    campusLocation: 'Delta State Polytechnic, Ogwashi-Uku',
    department: 'Computer Science',
    bio: 'Final-year student clearing out my hostel before NYSC. Everything is clean and works well.',
    whatsApp: '08031234567',
    profileImageUrl: '',
    verificationStatus: 'verified',
    createdAt: '2026-02-10T09:00:00.000Z',
  },
  {
    id: 'user-admin',
    email: 'admin@selit.ng',
    fullName: 'Selit Admin',
    role: 'admin',
    status: 'active',
    campusLocation: 'Delta State Polytechnic, Ogwashi-Uku',
    department: 'Operations',
    bio: '',
    whatsApp: '',
    profileImageUrl: '',
    verificationStatus: 'verified',
    createdAt: '2025-11-01T09:00:00.000Z',
  },
];

/** In sample mode any password works; emails starting with "admin" sign in as the admin. */
export function sampleUserForEmail(email: string) {
  return email.toLowerCase().startsWith('admin') ? SAMPLE_USERS[1] : SAMPLE_USERS[0];
}

export function findSampleUser(id: string) {
  return SAMPLE_USERS.find((user) => user.id === id) ?? null;
}
