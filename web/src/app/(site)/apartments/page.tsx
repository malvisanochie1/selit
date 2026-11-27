import { Plus } from 'lucide-react';
import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ApartmentBrowser } from '@/features/apartments/components/ApartmentBrowser';

export const metadata: Metadata = {
  title: 'Apartments near campus',
  description:
    'Self-contains, single rooms and flats near your school, listed by verified agents with the rent upfront.',
};

export default function ApartmentsPage() {
  return (
    <div className="container-page">
      <PageHeader
        eyebrow="Apartments"
        title="Rooms near your campus"
        description="Listed by ID-verified agents and landlords. Every listing is re-confirmed every two weeks."
        action={
          <ButtonLink href="/sell/apartment" variant="secondary">
            <Plus /> List a room
          </ButtonLink>
        }
      />
      <ApartmentBrowser />
    </div>
  );
}
