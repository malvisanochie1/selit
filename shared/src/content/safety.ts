export const ITEM_SAFETY_TIPS = [
  'Meet in a busy public place like the school gate, in daylight.',
  'Inspect the item fully before you pay. Never pay in advance.',
  'Never follow a seller to a second location, even if they say the item is "just nearby".',
  'Tell a friend where you are going. Use “Share my meet-up”.',
] as const;

export const APARTMENT_SAFETY_TIPS = [
  'Never pay an inspection fee, deposit or rent before you see the room in person.',
  'Inspect during the day, and go with a friend.',
  'Confirm the agent’s name matches their verified profile on Selit.',
  'Pay rent only after you meet the landlord or get a written agreement.',
] as const;

/** The message a buyer can send a friend before heading out to meet someone. */
export function meetupShareMessage(details: {
  itemTitle: string;
  sellerName: string;
  spot: string;
  time: string;
  link: string;
}) {
  return [
    `I'm meeting ${details.sellerName} from Selit to see "${details.itemTitle}".`,
    `Where: ${details.spot}`,
    `When: ${details.time}`,
    `Listing: ${details.link}`,
    "If you don't hear from me within an hour, please call me.",
  ].join('\n');
}

/** The four rules on the safety guide, in order. Apps pair each with an icon. */
export const SAFETY_RULES = [
  {
    title: 'Meet in public, in daylight',
    text: 'Use busy places: school gates, campus security posts, banks or busy junctions. Never a private house, hotel or lonely road.',
  },
  {
    title: 'Never go to a second location',
    text: 'If a seller says the item is "just nearby" and asks you to follow them somewhere else, say no and leave. This is the most common trap.',
  },
  {
    title: 'Inspect first, pay last',
    text: 'Check the item works before money changes hands. Never pay a deposit, transport fee or "holding fee" in advance.',
  },
  {
    title: 'Bring a friend, tell a friend',
    text: 'Go with someone if you can. Tap “Share my meet-up” on any listing to send a friend who, where and when.',
  },
] as const;

/** What Selit does on its side, shown on the safety guide. */
export const SAFETY_PROTECTIONS = [
  {
    title: 'Verified identities',
    text: 'Sellers and agents confirm their ID with a live selfie that our team checks against their ID photo.',
  },
  {
    title: 'Too-good-to-be-true checks',
    text: 'Listings priced far below normal are held for review before anyone sees them.',
  },
  {
    title: 'Apartments stay fresh',
    text: 'Agents must confirm a room is still free every two weeks, and students can flag rooms that are taken.',
  },
  {
    title: 'Fast reporting',
    text: 'Every listing and profile has a Report button. Several reports take a listing off the feed straight away.',
  },
] as const;
