import { meetupShareMessage } from '@selit/shared';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy, Share2 } from 'lucide-react-native';
import { useState } from 'react';
import { Share, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { COLORS } from '@/theme';

type ShareMeetupSheetProps = {
  open: boolean;
  onClose: () => void;
  itemTitle: string;
  sellerName: string;
  spot: string;
  link: string;
};

/** Sends a friend who you're meeting, where and when, before you leave. */
export function ShareMeetupSheet({
  open,
  onClose,
  itemTitle,
  sellerName,
  spot,
  link,
}: ShareMeetupSheetProps) {
  const [time, setTime] = useState('Today, 4pm');
  const [meetSpot, setMeetSpot] = useState(spot);
  const [copied, setCopied] = useState(false);
  const message = meetupShareMessage({ itemTitle, sellerName, spot: meetSpot, time, link });

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Share my meet-up"
      description="Tell a friend who you're meeting, where and when."
      footer={
        <>
          <View className="flex-1">
            <Button
              variant="secondary"
              icon={
                copied ? (
                  <Check size={18} color={COLORS.brand[600]} />
                ) : (
                  <Copy size={18} color={COLORS.ink[900]} />
                )
              }
              onPress={async () => {
                await Clipboard.setStringAsync(message);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </View>
          <View className="flex-1">
            <Button
              icon={<Share2 size={18} color="#fff" />}
              onPress={() => void Share.share({ message })}
            >
              Share
            </Button>
          </View>
        </>
      }
    >
      <View className="gap-4">
        <TextField label="Where" value={meetSpot} onChangeText={setMeetSpot} />
        <TextField label="When" value={time} onChangeText={setTime} />
        <View className="rounded-2xl bg-canvas p-4">
          <Text className="text-sm leading-5 text-ink-700">{message}</Text>
        </View>
      </View>
    </Sheet>
  );
}
