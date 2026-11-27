'use client';

import { messageOf } from '@selit/shared';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Clock,
  IdCard,
  ImageUp,
  Lock,
  ScanFace,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { EASE_OUT } from '@/components/motion/motion.constants';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { SelectField } from '@/components/ui/SelectField';
import { Skeleton } from '@/components/ui/Skeleton';
import { TextField } from '@/components/ui/TextField';

import { useSubmitVerification, useVerificationStatus } from '../hooks/use-verification';
import { ID_TYPES, type IdType } from '../verification.api';
import { CameraCapture } from './CameraCapture';
import { VerificationBanner } from './VerificationBanner';

const STEPS = ['Before you start', 'Your ID', 'Photo of your ID', 'Live selfie', 'Check and send'];

const SELFIE_PROMPTS = [
  'Look straight at the camera',
  'Turn your head slightly to the left',
  'Now give us a big smile',
];

function useObjectUrl(file: File | null) {
  return useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
}

function Thumb({ file, label }: { file: File; label: string }) {
  const url = useObjectUrl(file);
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-canvas">
      <Image
        src={url}
        alt={label}
        width={640}
        height={480}
        unoptimized
        className="aspect-[4/3] w-full object-cover"
      />
      <figcaption className="px-3 py-2 text-xs font-semibold text-ink-600">{label}</figcaption>
    </figure>
  );
}

export function VerificationWizard() {
  const { status, isLoading } = useVerificationStatus();
  const submit = useSubmitVerification();
  const [[step, direction], setStep] = useState<[number, number]>([0, 1]);
  const [idType, setIdType] = useState<IdType>('nin');
  const [idNumber, setIdNumber] = useState('');
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [selfies, setSelfies] = useState<File[]>([]);
  const [hasConsented, setHasConsented] = useState(false);
  const [error, setError] = useState('');

  const idRule = ID_TYPES.find((type) => type.value === idType) ?? ID_TYPES[0];
  const idPhotoUrl = useObjectUrl(idPhoto);

  if (isLoading) return <Skeleton className="h-96 rounded-3xl" />;
  if (status === 'verified' || status === 'pending') {
    return (
      <>
        <AreaHeader title="Verification" />
        <VerificationBanner status={status} />
      </>
    );
  }

  const go = (next: number) => {
    setError('');
    setStep([next, next > step ? 1 : -1]);
  };

  function continueFromId() {
    if (!idRule.pattern.test(idNumber.trim()))
      return setError(`Enter a valid number (${idRule.hint}).`);
    go(2);
  }

  async function send() {
    if (!idPhoto || selfies.length < SELFIE_PROMPTS.length)
      return setError('Some photos are missing.');
    if (!hasConsented) return setError('Please agree so we can check your ID.');
    submit.mutate(
      { idType, idNumber, idPhoto, selfies },
      { onError: (submitError) => setError(messageOf(submitError)) },
    );
  }

  const stepContent = [
    <div key="intro" className="space-y-5">
      {status === 'rejected' ? <VerificationBanner status="rejected" /> : null}
      <ul className="space-y-4">
        {[
          {
            icon: IdCard,
            text: 'Your NIN slip or card, voter’s card, driver’s licence or passport',
          },
          { icon: ScanFace, text: 'A phone with a front camera, in good light' },
          { icon: Clock, text: 'About two minutes' },
        ].map((item) => (
          <li key={item.text} className="flex items-center gap-3 text-ink-700">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <item.icon className="size-5" />
            </span>
            {item.text}
          </li>
        ))}
      </ul>
      <Notice tone="info" title="Your ID stays private">
        Your ID photo and selfie are only used to confirm it is really you. They are never shown on
        your profile.
      </Notice>
      <Button size="lg" onClick={() => go(1)}>
        Start <ArrowRight />
      </Button>
    </div>,

    <div key="id" className="space-y-5">
      <SelectField
        id="id-type"
        label="ID type"
        value={idType}
        onChange={(event) => setIdType(event.target.value as IdType)}
        options={ID_TYPES.map((type) => ({ value: type.value, label: type.label }))}
      />
      <TextField
        id="id-number"
        label={`${idRule.label} number`}
        value={idNumber}
        inputMode={idType === 'nin' ? 'numeric' : 'text'}
        autoComplete="off"
        onChange={(event) => setIdNumber(event.target.value.replace(/\s/g, ''))}
        hint={idRule.hint}
        maxLength={20}
      />
      <p className="text-sm text-ink-500">
        The name on this ID must match the name on your Selit account.
      </p>
    </div>,

    <div key="id-photo" className="space-y-4">
      {idPhoto ? (
        <div className="space-y-3">
          <Image
            src={idPhotoUrl}
            alt="Your ID"
            width={1280}
            height={810}
            unoptimized
            className="w-full rounded-[1.75rem] border border-line object-cover"
          />
          <Button variant="secondary" onClick={() => setIdPhoto(null)}>
            Retake
          </Button>
        </div>
      ) : (
        <>
          <CameraCapture
            facing="environment"
            frame="card"
            captureLabel="Take photo of ID"
            onCapture={setIdPhoto}
          />
          <label className="flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold text-brand-700">
            <ImageUp className="size-4" /> Or upload a clear photo of your ID
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => event.target.files?.[0] && setIdPhoto(event.target.files[0])}
            />
          </label>
        </>
      )}
    </div>,

    <div key="selfie" className="space-y-4">
      {selfies.length < SELFIE_PROMPTS.length ? (
        <>
          <div className="flex items-center justify-between rounded-2xl bg-brand-50 px-4 py-3">
            <p className="font-semibold text-brand-800">{SELFIE_PROMPTS[selfies.length]}</p>
            <span className="text-sm font-semibold text-brand-700 tabular-nums">
              {selfies.length + 1} / {SELFIE_PROMPTS.length}
            </span>
          </div>
          <CameraCapture
            facing="user"
            frame="face"
            captureLabel="Capture"
            onCapture={(file) => setSelfies((current) => [...current, file])}
          />
          <p className="flex items-center gap-1.5 text-xs text-ink-500">
            <Lock className="size-3.5" /> Selfies must be taken live. Uploads aren&apos;t accepted
            for this step.
          </p>
        </>
      ) : (
        <div className="space-y-3">
          <Notice tone="success" title="Selfie captured" />
          <Button variant="secondary" onClick={() => setSelfies([])}>
            Retake selfie
          </Button>
        </div>
      )}
    </div>,

    <div key="review" className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {idPhoto ? <Thumb file={idPhoto} label="ID photo" /> : null}
        {selfies[0] ? <Thumb file={selfies[0]} label="Selfie" /> : null}
      </div>
      <p className="text-sm text-ink-600">
        {idRule.label}: <strong className="text-ink-900">{idNumber}</strong>
      </p>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-600">
        <input
          type="checkbox"
          checked={hasConsented}
          onChange={(event) => setHasConsented(event.target.checked)}
          className="mt-0.5 size-4.5 shrink-0 accent-brand-500"
        />
        I agree that Selit and its verification partner may check this ID against official records
        to confirm my identity.
      </label>
    </div>,
  ];

  const canGoNext =
    step === 1 ||
    (step === 2 && idPhoto) ||
    (step === 3 && selfies.length === SELFIE_PROMPTS.length);

  return (
    <>
      <AreaHeader
        title="Get verified"
        description="Verified sellers get a green badge and more replies."
      />
      <div className="max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-ink-900">{STEPS[step]}</span>
            <span className="text-ink-500">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
            <m.div
              className="h-full rounded-full bg-brand-500"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-line bg-surface p-5 sm:p-7">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <m.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              {stepContent[step]}
            </m.div>
          </AnimatePresence>

          {error ? (
            <Notice tone="danger" className="mt-5">
              {error}
            </Notice>
          ) : null}

          {step > 0 ? (
            <div className="mt-7 flex justify-between border-t border-line pt-5">
              <Button variant="ghost" onClick={() => go(step - 1)}>
                <ArrowLeft /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => (step === 1 ? continueFromId() : go(step + 1))}
                  disabled={!canGoNext}
                >
                  Continue <ArrowRight />
                </Button>
              ) : (
                <Button onClick={send} isLoading={submit.isPending}>
                  <BadgeCheck /> Send for review
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
