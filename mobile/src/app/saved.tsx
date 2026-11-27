import { useQueries } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListingGrid, ListingGridSkeleton } from '@/features/listings/components/ListingGrid';
import { listingKeys } from '@/features/listings/hooks';
import { useSavedStore } from '@/features/saved/saved-store';
import { getApi } from '@/lib/api';
import { COLORS } from '@/theme';

export default function SavedScreen() {
  const ids = useSavedStore((state) => state.ids);
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: listingKeys.detail(id),
      queryFn: () => getApi().listings.get(id),
      retry: false,
    })),
  });
  const listings = results.flatMap((result) => (result.data ? [result.data] : []));
  const isLoading = results.some((result) => result.isPending);

  return (
    <Screen header={<ScreenHeader />}>
      <PageTitle title="Saved" description="Items you tapped the heart on. Kept on this phone." />
      {ids.length === 0 ? (
        <EmptyState
          icon={<Heart size={24} color={COLORS.brand[700]} />}
          title="Nothing saved yet"
          description="Tap the heart on any item to keep it here for later."
          action={<Button onPress={() => router.push('/browse')}>Browse items</Button>}
        />
      ) : isLoading && listings.length === 0 ? (
        <ListingGridSkeleton />
      ) : (
        <ListingGrid listings={listings} />
      )}
    </Screen>
  );
}
