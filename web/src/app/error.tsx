'use client';

import { StatusScreen } from '@/components/layout/StatusScreen';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusScreen
      code="Oops"
      title="Something went wrong"
      description="It's not you. Try again, and if it keeps happening, come back in a few minutes."
      actions={
        <>
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="secondary">
            Go home
          </ButtonLink>
        </>
      }
    />
  );
}
