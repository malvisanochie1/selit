export type LegalSection = { heading: string; paragraphs: string[] };

export type LegalDocument = {
  slug: string;
  title: string;
  summary: string;
  updatedAt: string;
  sections: LegalSection[];
};

const UPDATED = '2026-11-26';

export const LEGAL_DOCUMENTS: readonly LegalDocument[] = [
  {
    slug: 'terms',
    title: 'Terms of use',
    summary: 'The rules for using Selit, written in plain language.',
    updatedAt: UPDATED,
    sections: [
      {
        heading: 'What Selit is',
        paragraphs: [
          'Selit is a listing platform that connects people who want to buy, sell or rent with people near their campus. We do not own, inspect or sell the items or rooms listed, and we do not handle payments.',
          'Any deal you make is between you and the other person. You decide whether to buy, sell or rent, and on what terms.',
        ],
      },
      {
        heading: 'Your account',
        paragraphs: [
          'You must give accurate information and keep your password private. One person, one account. You are responsible for what happens on your account.',
          'We may suspend or close accounts that break these terms, put others at risk, or try to get around a ban.',
        ],
      },
      {
        heading: 'Listing items and rooms',
        paragraphs: [
          'Only list things you own or are authorised to rent out, describe them honestly, and use your own photos. Prices must be real.',
          'Item meet-ups must be at public places. You may not ask for payment before the buyer has seen the item or room.',
          'Listings that look unusual may be held for review, edited for category, or removed.',
        ],
      },
      {
        heading: 'Things you must not do',
        paragraphs: [
          'Do not post fake, stolen, illegal, dangerous or adult items; do not scam, harass or threaten anyone; do not scrape the site, spam, or collect other users’ contact details.',
        ],
      },
      {
        heading: 'Liability',
        paragraphs: [
          'Selit is provided as it is. We work hard to keep the platform safe, but we cannot guarantee any user, item or room. To the extent the law allows, we are not responsible for losses that come from deals between users.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: [
          'We may update these terms. If the change is important, we will tell you on the site before it applies.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy policy',
    summary:
      'What we collect, why, and the choices you have. Aligned with the Nigeria Data Protection Act 2023.',
    updatedAt: UPDATED,
    sections: [
      {
        heading: 'What we collect',
        paragraphs: [
          'Account details (name, email, school, department, phone number), the listings and reviews you post, and basic technical data such as device type and pages visited.',
          'If you verify your identity, we collect your NIN, a photo of your ID and a live selfie. These are used only to confirm who you are.',
        ],
      },
      {
        heading: 'How we use it',
        paragraphs: [
          'To run your account, show your listings, connect buyers with sellers, keep the platform safe, and prevent fraud. We never sell your personal data.',
          'Your phone number is shown only to signed-in users who open your listing.',
        ],
      },
      {
        heading: 'Identity checks',
        paragraphs: [
          'Identity checks may be done by a licensed verification provider. ID photos and selfies are stored privately, are not shown on your profile, and are deleted when they are no longer needed for safety or legal reasons.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          'You can view and update your profile at any time, ask for a copy of your data, or ask us to delete your account. Email us from the address on your account.',
        ],
      },
      {
        heading: 'Security',
        paragraphs: [
          'Sessions use secure, HttpOnly cookies, all traffic is encrypted, and access to personal data is restricted to the people who need it.',
        ],
      },
    ],
  },
  {
    slug: 'community-guidelines',
    title: 'Community rules',
    summary: 'How we keep Selit fair and safe for every student.',
    updatedAt: UPDATED,
    sections: [
      {
        heading: 'Be real',
        paragraphs: [
          'Use your real name, real photos and real prices. Say clearly if something is faulty or damaged.',
        ],
      },
      {
        heading: 'Be safe',
        paragraphs: [
          'Meet in public places in daylight. Never ask for, or send, money before an inspection. Never ask someone to follow you to a second location.',
        ],
      },
      {
        heading: 'Be fair',
        paragraphs: [
          'Do not relist other people’s items at a markup, spam the same listing, or leave fake reviews. Agents must keep rooms up to date and mark them as taken.',
        ],
      },
      {
        heading: 'Be respectful',
        paragraphs: [
          'No harassment, hate, threats or sexual content. Report anyone who makes you uncomfortable.',
        ],
      },
    ],
  },
];

export function findLegalDocument(slug: string) {
  return LEGAL_DOCUMENTS.find((document) => document.slug === slug) ?? null;
}
