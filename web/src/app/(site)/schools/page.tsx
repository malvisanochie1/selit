import { SCHOOLS } from '@selit/shared';
import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/PageHeader';
import { SchoolDirectory } from '@/features/schools/components/SchoolDirectory';

export const metadata: Metadata = {
  title: 'Schools',
  description:
    'Universities, polytechnics and colleges of education across all 36 states and the FCT.',
};

export default function SchoolsPage() {
  return (
    <div className="container-page">
      <PageHeader
        eyebrow="Schools"
        title="Find your campus"
        description={`${SCHOOLS.length} universities, polytechnics and colleges of education across all 36 states and the FCT. Delta State is live now.`}
        crumbs={[{ href: '/', label: 'Home' }]}
      />
      <SchoolDirectory />
    </div>
  );
}
