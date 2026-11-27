import {
  formatDate,
  ID_TYPES,
  idTypeLabel,
  messageOf,
  normaliseIdNumber,
  type IdType,
} from '@selit/shared';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  BadgeCheck,
  Camera,
  Clock,
  IdCard,
  ImagePlus,
  ShieldCheck,
  XCircle,
} from 'lucide-react-native';
import { useState } from 'react';
import { Platform, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Appear } from '@/components/motion/Appear';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Notice } from '@/components/ui/Notice';
import { Skeleton } from '@/components/ui/Skeleton';
import { Heading, Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { SelfieCamera } from '@/features/verification/components/SelfieCamera';
import { useSubmitVerification, useVerificationStatus } from '@/features/verification/hooks';
import { pickPhotos, toPhotoUpload, toPhotoUploads, type PickedPhoto } from '@/lib/photos';
import { COLORS, SHADOW } from '@/theme';

type Step = 'intro' | 'id' | 'selfie' | 'review';

function StatusCard({
  icon,
  tone,
  title,
  text,
}: {
  icon: React.ReactNode;
  tone: string;
  title: string;
  text: string;
}) {
  return (
    <Appear>
      <View style={SHADOW.card} className="mt-4 items-center rounded-[28px] bg-surface p-6">
        <View className={`size-16 items-center justify-center rounded-3xl ${tone}`}>{icon}</View>
        <Heading className="mt-5 text-center text-2xl">{title}</Heading>
        <Text className="mt-2 text-center leading-6 text-ink-500">{text}</Text>
      </View>
    </Appear>
  );
}

export default function VerificationScreen() {
  const { status, record, isLoading } = useVerificationStatus();
  const submit = useSubmitVerification();
  const [step, setStep] = useState<Step>('intro');
  const [idType, setIdType] = useState<IdType>('nin');
  const [idNumber, setIdNumber] = useState('');
  const [idPhoto, setIdPhoto] = useState<PickedPhoto | null>(null);
  const [selfies, setSelfies] = useState<PickedPhoto[]>([]);
  const [error, setError] = useState('');
  const [isPreparing, setIsPreparing] = useState(false);
  const rule = ID_TYPES.find((option) => option.value === idType) ?? ID_TYPES[0];

  if (isLoading) {
    return (
      <Screen header={<ScreenHeader title="Verification" />}>
        <Skeleton height={260} />
      </Screen>
    );
  }

  if (status === 'verified') {
    return (
      <Screen header={<ScreenHeader title="Verification" />} maxWidth={560}>
        <StatusCard
          icon={<BadgeCheck size={30} color={COLORS.brand[600]} />}
          tone="bg-brand-50"
          title="You're verified"
          text="Your green badge shows on every listing and on your profile. Buyers reply faster to verified sellers."
        />
      </Screen>
    );
  }

  if (status === 'pending') {
    return (
      <Screen header={<ScreenHeader title="Verification" />} maxWidth={560}>
        <StatusCard
          icon={<Clock size={30} color={COLORS.amber[600]} />}
          tone="bg-amber-50"
          title="We're checking your ID"
          text={`Submitted ${record?.submittedAt ? formatDate(record.submittedAt) : 'recently'}. Most checks finish within a day. Your photos are deleted once we decide.`}
        />
      </Screen>
    );
  }

  async function chooseIdPhoto(source: 'camera' | 'library') {
    const [photo] = await pickPhotos(source, 1);
    if (photo) setIdPhoto(photo);
  }

  function continueFromId() {
    const number = normaliseIdNumber(idNumber);
    if (!rule.pattern.test(number))
      return setError(`Enter your ${rule.label} number (${rule.hint}).`);
    if (!idPhoto) return setError('Add a clear photo of your ID.');
    setError('');
    setStep('selfie');
  }

  async function send() {
    if (!idPhoto) return;
    setIsPreparing(true);
    try {
      await submit.mutateAsync({
        idType,
        idNumber: normaliseIdNumber(idNumber),
        idPhoto: await toPhotoUpload(idPhoto, 1600),
        selfies: await toPhotoUploads(selfies, 900),
      });
    } catch {
      // Shown from the mutation state below.
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <Screen header={<ScreenHeader title="Verification" />} maxWidth={560}>
      {status === 'rejected' && step === 'intro' ? (
        <Notice tone="danger" title="Your last check wasn't approved" className="mt-2">
          {record?.reviewNote ??
            'The face or the name did not match clearly. Try again in good light.'}
        </Notice>
      ) : null}

      {step === 'intro' ? (
        <Appear>
          <View className="mt-4 items-center">
            <View className="size-16 items-center justify-center rounded-3xl bg-brand-50">
              <ShieldCheck size={30} color={COLORS.brand[600]} />
            </View>
            <Heading className="mt-5 text-center text-3xl">Get your verified badge</Heading>
            <Text className="mt-2 text-center leading-6 text-ink-500">
              It takes about two minutes. Our team checks that your face matches your ID, then
              deletes the photos.
            </Text>
          </View>
          <View className="mt-8 gap-3">
            {[
              { icon: IdCard, text: 'Your ID number and a photo of the ID' },
              { icon: Camera, text: 'A live selfie, three quick photos' },
              { icon: BadgeCheck, text: 'A green badge on everything you list' },
            ].map((item) => (
              <View
                key={item.text}
                className="flex-row items-center gap-3 rounded-2xl bg-surface p-4"
              >
                <item.icon size={20} color={COLORS.brand[700]} />
                <Text className="flex-1 text-ink-800">{item.text}</Text>
              </View>
            ))}
          </View>
          <Text className="mt-4 text-center text-xs text-ink-400">
            We keep only the last four characters of your ID number. Photos are never shown to other
            members.
          </Text>
          <Button size="lg" className="mt-6" onPress={() => setStep('id')}>
            Start
          </Button>
        </Appear>
      ) : null}

      {step === 'id' ? (
        <Appear className="gap-5">
          <Heading className="text-2xl">Your ID</Heading>
          <View className="flex-row flex-wrap gap-2">
            {ID_TYPES.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                isActive={idType === option.value}
                onPress={() => setIdType(option.value)}
              />
            ))}
          </View>
          <TextField
            label={`${rule.label} number`}
            value={idNumber}
            onChangeText={setIdNumber}
            autoCapitalize="characters"
            keyboardType={idType === 'nin' ? 'number-pad' : 'default'}
            hint={rule.hint}
          />
          <View className="gap-3">
            <Text className="font-body-semibold text-sm text-ink-800">Photo of your ID</Text>
            {idPhoto ? (
              <Image
                source={{ uri: idPhoto.uri }}
                style={{ width: '100%', aspectRatio: 1.6, borderRadius: 20 }}
                contentFit="cover"
              />
            ) : null}
            <View className="flex-row gap-3">
              {Platform.OS !== 'web' ? (
                <View className="flex-1">
                  <Button
                    variant="secondary"
                    icon={<Camera size={16} color={COLORS.ink[900]} />}
                    onPress={() => void chooseIdPhoto('camera')}
                  >
                    {idPhoto ? 'Retake' : 'Take photo'}
                  </Button>
                </View>
              ) : null}
              <View className="flex-1">
                <Button
                  variant="secondary"
                  icon={<ImagePlus size={16} color={COLORS.ink[900]} />}
                  onPress={() => void chooseIdPhoto('library')}
                >
                  Gallery
                </Button>
              </View>
            </View>
          </View>
          {error ? <Notice tone="danger">{error}</Notice> : null}
          <Button size="lg" onPress={continueFromId}>
            Continue
          </Button>
        </Appear>
      ) : null}

      {step === 'selfie' ? (
        <Appear className="gap-4">
          <Heading className="text-2xl">Live selfie</Heading>
          <Text className="text-ink-500">
            Good light, no cap or glasses. Follow the prompt for each photo.
          </Text>
          <SelfieCamera
            onDone={(frames) => {
              setSelfies(frames);
              setStep('review');
            }}
          />
        </Appear>
      ) : null}

      {step === 'review' ? (
        <Appear className="gap-5">
          <Heading className="text-2xl">Check and send</Heading>
          <View style={SHADOW.card} className="gap-2 rounded-3xl bg-surface p-5">
            <Text className="text-sm text-ink-500">{idTypeLabel(idType)}</Text>
            <Text className="font-body-semibold text-ink-900">
              Ending {normaliseIdNumber(idNumber).slice(-4)}
            </Text>
            <View className="mt-2 flex-row gap-2">
              {idPhoto ? (
                <Image
                  source={{ uri: idPhoto.uri }}
                  style={{ width: 72, height: 72, borderRadius: 14 }}
                  contentFit="cover"
                />
              ) : null}
              {selfies.map((selfie) => (
                <Image
                  key={selfie.uri}
                  source={{ uri: selfie.uri }}
                  style={{ width: 72, height: 72, borderRadius: 14 }}
                  contentFit="cover"
                />
              ))}
            </View>
          </View>
          {submit.isError ? (
            <Notice tone="danger" title="That didn't go through">
              {messageOf(submit.error)}
            </Notice>
          ) : null}
          <Button size="lg" onPress={() => void send()} isLoading={isPreparing || submit.isPending}>
            Send for review
          </Button>
          <Button
            variant="ghost"
            icon={<XCircle size={16} color={COLORS.ink[600]} />}
            onPress={() => {
              setSelfies([]);
              setStep('selfie');
            }}
          >
            Retake the selfie
          </Button>
        </Appear>
      ) : null}

      {submit.isSuccess ? (
        <Button className="mt-4" variant="secondary" onPress={() => router.back()}>
          Done
        </Button>
      ) : null}
    </Screen>
  );
}
