import { findCategory } from '@selit/shared';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageTitle } from '@/components/layout/PageTitle';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ListingBrowser } from '@/features/listings/components/ListingBrowser';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const category = findCategory(slug);
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-canvas">
      <ScreenHeader />
      <ListingBrowser
        fixed={{ category: category?.slug ?? slug }}
        header={<PageTitle title={category?.name ?? 'Category'} description={category ? `${category.blurb}, from students near you.` : undefined} />}
      />
    </SafeAreaView>
  );
}
