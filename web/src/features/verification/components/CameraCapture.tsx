'use client';

import { Camera, CameraOff, RefreshCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

type CameraCaptureProps = {
  facing: 'user' | 'environment';
  frame: 'face' | 'card';
  captureLabel: string;
  onCapture: (file: File) => void;
  disabled?: boolean;
};

type CameraState = 'starting' | 'ready' | 'denied' | 'unsupported';

/** A live camera view. Photos come straight from the camera, so they can't be old or edited. */
export function CameraCapture({
  facing,
  frame,
  captureLabel,
  onCapture,
  disabled = false,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>('starting');
  const [flash, setFlash] = useState(false);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState('unsupported');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setState('ready');
    } catch {
      setState('denied');
    }
  }, [facing]);

  useEffect(() => {
    // Deferred so the "starting" view paints before the browser's permission prompt.
    const timer = window.setTimeout(() => void start(), 0);
    return () => {
      window.clearTimeout(timer);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [start]);

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    if (facing === 'user') {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setFlash(true);
        setTimeout(() => setFlash(false), 220);
        onCapture(new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.9,
    );
  }

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-ink-950 sm:aspect-[4/3]">
        <video
          ref={videoRef}
          playsInline
          muted
          className={cn(
            'absolute inset-0 size-full object-cover',
            facing === 'user' && '-scale-x-100',
          )}
        />
        {state === 'ready' ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className={cn(
                'border-2 border-white/90 shadow-[0_0_0_9999px_rgb(8_18_42/0.45)]',
                frame === 'face'
                  ? 'aspect-[3/4] w-[58%] rounded-[50%] sm:w-[38%]'
                  : 'aspect-[1.58] w-[84%] rounded-2xl',
              )}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white">
            {state === 'starting' ? (
              <>
                <Camera className="size-8 animate-pulse text-ink-300" />
                <p className="text-sm text-ink-300">Starting your camera…</p>
              </>
            ) : (
              <>
                <CameraOff className="size-8 text-ink-300" />
                <p className="max-w-xs text-sm text-ink-200">
                  {state === 'denied'
                    ? 'We need your camera for this step. Allow camera access in your browser settings, then try again.'
                    : 'This browser cannot open the camera. Try Chrome on your phone.'}
                </p>
                {state === 'denied' ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setState('starting');
                      void start();
                    }}
                  >
                    <RefreshCcw /> Try again
                  </Button>
                ) : null}
              </>
            )}
          </div>
        )}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 bg-white transition-opacity duration-200',
            flash ? 'opacity-70' : 'opacity-0',
          )}
        />
      </div>
      <Button
        size="lg"
        fullWidth
        className="mt-4"
        onClick={capture}
        disabled={state !== 'ready' || disabled}
      >
        <Camera /> {captureLabel}
      </Button>
    </div>
  );
}
