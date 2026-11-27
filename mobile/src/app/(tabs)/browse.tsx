import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageTitle } from '@/components/layout/PageTitle';
import { ListingBrowser } from '@/features/listings/components/ListingBrowser';

export default function BrowseScreen() {
  const params = useLocalSearchParams<{ q?: string; school?: string; category?: string }>();
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-canvas">
      <ListingBrowser
        key={`${params.q ?? ''}|${params.school ?? ''}|${params.category ?? ''}`}
        initial={{
          search: params.q || undefined,
          school: params.school || undefined,
          category: params.category || undefined,
        }}
        header={
          <PageTitle title="Browse" description="Used items from students near your campus." />
        }
      />
    </SafeAreaView>
  );
}
