import { messageOf, profileSchema, toLocalNumber } from '@selit/shared';
import { router } from 'expo-router';
import { Camera, MessageCircle } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale } from '@/components/motion/PressableScale';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { useSession } from '@/features/auth/session-store';
import { useUpdateProfile } from '@/features/profiles/hooks';
import { SchoolPicker } from '@/features/schools/components/SchoolPicker';
import { pickPhotos, toPhotoUpload, type PickedPhoto } from '@/lib/photos';
import { COLORS } from '@/theme';

export default function ProfileScreen() {
  const { user } = useSession();
  const update = useUpdateProfile();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [campusLocation, setCampusLocation] = useState(user?.campusLocation ?? '');
  const [department, setDepartment] = useState(user?.department ?? '');
  const [whatsApp, setWhatsApp] = useState(toLocalNumber(user?.whatsApp ?? ''));
  const [bio, setBio] = useState(user?.bio ?? '');
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreparing, setIsPreparing] = useState(false);

  if (!user) return null;

  async function save() {
    const parsed = profileSchema.safeParse({ fullName, campusLocation, department, whatsApp, bio });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      return setErrors(next);
    }
    setErrors({});
    setIsPreparing(true);
    try {
      await update.mutateAsync({
        ...parsed.data,
        image: photo ? await toPhotoUpload(photo, 800) : undefined,
      });
      router.back();
    } catch {
      // Shown from the mutation state.
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <Screen header={<ScreenHeader />} maxWidth={640}>
      <PageTitle
        title="Edit profile"
        description="Buyers see your name, photo, school and bio. Your number is only shown to members."
      />
      <View className="items-center">
        <PressableScale
          onPress={async () => {
            const [picked] = await pickPhotos('library', 1);
            if (picked) setPhoto(picked);
          }}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
        >
          <Avatar
            name={fullName || user.fullName}
            src={photo?.uri ?? user.profileImageUrl}
            size="xl"
          />
          <View className="absolute bottom-0 right-0 size-9 items-center justify-center rounded-full border-2 border-canvas bg-ink-900">
            <Camera size={16} color="#fff" />
          </View>
        </PressableScale>
      </View>
      <View className="mt-6 gap-5">
        {update.isError ? <Notice tone="danger">{messageOf(update.error)}</Notice> : null}
        <TextField
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          maxLength={80}
          error={errors.fullName}
        />
        <TextField
          label="WhatsApp number"
          value={whatsApp}
          onChangeText={setWhatsApp}
          keyboardType="phone-pad"
          placeholder="0803 123 4567"
          leadingIcon={<MessageCircle size={18} color={COLORS.ink[400]} />}
          hint="Buyers message you here. Only signed-in members can see it."
          error={errors.whatsApp}
        />
        <SchoolPicker label="School" value={campusLocation} onChange={setCampusLocation} />
        <TextField
          label="Department"
          optional
          value={department}
          onChangeText={setDepartment}
          maxLength={80}
          error={errors.department}
        />
        <TextField
          label="Bio"
          optional
          multiline
          value={bio}
          onChangeText={setBio}
          maxLength={300}
          placeholder="A line about you and what you sell"
          error={errors.bio}
        />
        <Text className="-mt-3 text-right text-xs text-ink-400">{bio.length}/300</Text>
        <Button size="lg" onPress={() => void save()} isLoading={isPreparing || update.isPending}>
          Save profile
        </Button>
      </View>
    </Screen>
  );
}
