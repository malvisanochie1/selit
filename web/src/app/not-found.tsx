import { StatusScreen } from '@/components/layout/StatusScreen';
import { ButtonLink } from '@/components/ui/ButtonLink';

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title="This page has moved out"
      description="The link may be old, or the listing was taken down. Let's get you back to something useful."
      actions={
        <>
          <ButtonLink href="/">Go home</ButtonLink>
          <ButtonLink href="/search" variant="secondary">
            Browse items
          </ButtonLink>
        </>
      }
    />
  );
}
