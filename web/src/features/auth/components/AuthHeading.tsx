import { Reveal } from '@/components/motion/Reveal';

export function AuthHeading({ title, description }: { title: string; description: string }) {
  return (
    <Reveal className="mb-8">
      <h1 className="text-4xl font-semibold text-ink-900">{title}</h1>
      <p className="mt-2 text-ink-500">{description}</p>
    </Reveal>
  );
}
