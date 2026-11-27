export type FaqItem = { question: string; answer: string };

/** Answers to the questions students ask most, shared by the website and the app. */
export function helpQuestions(supportEmail: string): FaqItem[] {
  return [
    {
      question: 'Does Selit handle payments?',
      answer:
        'No. Selit connects you with the seller or agent. You chat on WhatsApp or call, meet in a public place, inspect, and then pay them directly. Never pay before you inspect.',
    },
    { question: 'Is it free to list an item?', answer: 'Yes. Listing items on Selit is free.' },
    {
      question: 'Why do I need to sign in to see a phone number?',
      answer:
        'It stops scammers and bots from collecting sellers’ numbers. Signing in takes a minute and keeps everyone’s contact details safe.',
    },
    {
      question: 'How does verification work?',
      answer:
        'You enter your ID number, take a photo of your ID and a short live selfie. Our team checks that the face and the name match, then deletes the photos. Verified members get a green badge.',
    },
    {
      question: 'Why was my listing held for review?',
      answer:
        'New sellers and listings that look unusual, such as a price far below what similar items sell for, are checked by our team before they go live. Most are approved within a few hours.',
    },
    {
      question: 'My school isn’t listed. What do I do?',
      answer: `Email ${supportEmail} with your school’s full name and town, and we’ll add it.`,
    },
    {
      question: 'How do I delete my account?',
      answer: `Email ${supportEmail} from the address on your account and we will delete it and your listings within 7 days.`,
    },
  ];
}
