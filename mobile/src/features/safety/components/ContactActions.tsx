import { callLink, whatsAppLink } from '@selit/shared';
import { router } from 'expo-router';
import { LockKeyhole, MessageCircle, Phone } from 'lucide-react-native';
import { Linking, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { COLORS } from '@/theme';

type ContactActionsProps = {
  phone: string;
  message: string;
  isSignedIn: boolean;
  isOwn?: boolean;
};

/** WhatsApp and Call buttons. Numbers are only ever sent to signed-in members. */
export function ContactActions({ phone, message, isSignedIn, isOwn = false }: ContactActionsProps) {
  if (isOwn) return null;

  if (!isSignedIn) {
    return (
      <View className="gap-2">
        <Button size="lg" icon={<LockKeyhole size={18} color="#fff" />} onPress={() => router.push('/sign-in')}>
          Sign in to contact
        </Button>
        <Text className="text-center text-xs text-ink-500">Phone numbers are only shown to members, to stop scrapers.</Text>
      </View>
    );
  }

  const whatsApp = whatsAppLink(phone, message);
  const call = callLink(phone);
  if (!whatsApp || !call) {
    return <Text className="text-center text-sm text-ink-500">This member hasn&apos;t added a phone number yet.</Text>;
  }

  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Button size="lg" icon={<MessageCircle size={18} color="#fff" />} onPress={() => void Linking.openURL(whatsApp)}>
          WhatsApp
        </Button>
      </View>
      <View className="flex-1">
        <Button size="lg" variant="secondary" icon={<Phone size={18} color={COLORS.ink[900]} />} onPress={() => void Linking.openURL(call)}>
          Call
        </Button>
      </View>
    </View>
  );
}
