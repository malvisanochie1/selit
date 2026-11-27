'use client';

import { Check, Copy, Share2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';

type ShareMeetupDialogProps = {
  open: boolean;
  onClose: () => void;
  sellerName: string;
  sellerPhone?: string;
  itemTitle: string;
  defaultPlace: string;
};

/** Lets a buyer send a friend who they are meeting, where and when, before they go. */
export function ShareMeetupDialog({
  open,
  onClose,
  sellerName,
  sellerPhone,
  itemTitle,
  defaultPlace,
}: ShareMeetupDialogProps) {
  const [place, setPlace] = useState(defaultPlace);
  const [time, setTime] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const message = [
    'Heads up, I am meeting a seller from Selit.',
    `Seller: ${sellerName}${sellerPhone ? ` (${sellerPhone})` : ''}`,
    `Item: ${itemTitle}`,
    `Place: ${place || 'not set yet'}`,
    `Time: ${time || 'not set yet'}`,
    'If you do not hear from me within an hour, please call me.',
  ].join('\n');

  const withLink = () => `${message}\nListing: ${window.location.href}`;

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: 'My Selit meet-up', text: withLink() }).catch(() => undefined);
      return;
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(withLink())}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  async function copy() {
    await navigator.clipboard.writeText(withLink()).catch(() => undefined);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Share my meet-up"
      description="Send a friend the details before you go. It takes ten seconds."
      footer={
        <>
          <Button variant="secondary" onClick={copy}>
            {isCopied ? <Check /> : <Copy />}
            {isCopied ? 'Copied' : 'Copy'}
          </Button>
          <Button onClick={share}>
            <Share2 />
            Send to a friend
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <TextField
          id="meetup-place"
          label="Where"
          value={place}
          onChange={(event) => setPlace(event.target.value)}
        />
        <TextField
          id="meetup-time"
          label="When"
          placeholder="e.g. Today, 4pm"
          value={time}
          onChange={(event) => setTime(event.target.value)}
        />
        <pre className="rounded-2xl bg-canvas p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap text-ink-700">
          {message}
        </pre>
      </div>
    </Dialog>
  );
}
