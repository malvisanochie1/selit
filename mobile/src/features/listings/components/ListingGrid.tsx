import type { Listing } from '@selit/shared';
import { View } from 'react-native';

import { Appear } from '@/components/motion/Appear';
import { Skeleton } from '@/components/ui/Skeleton';
import { useColumns } from '@/lib/hooks/use-columns';

import { ListingCard } from './ListingCard';

const GAP = 12;

/** A responsive grid for short lists inside a scrolling screen. */
export function ListingGrid({
  listings,
  animate = true,
}: {
  listings: Listing[];
  animate?: boolean;
}) {
  const columns = useColumns();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -GAP / 2 }}>
      {listings.map((listing, index) => (
        <View key={listing.id} style={{ width: `${100 / columns}%`, padding: GAP / 2 }}>
          <Appear index={index} enabled={animate && index < columns * 3}>
            <ListingCard listing={listing} />
          </Appear>
        </View>
      ))}
    </View>
  );
}

export function ListingGridSkeleton({ count = 4 }: { count?: number }) {
  const columns = useColumns();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -GAP / 2 }}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={{ width: `${100 / columns}%`, padding: GAP / 2 }}>
          <Skeleton height={250} />
        </View>
      ))}
    </View>
  );
}
