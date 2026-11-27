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
