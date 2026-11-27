import {
  CATEGORIES,
  CONDITIONS,
  messageOf,
  type Listing,
  type ListingFilters,
  type ListingSort,
} from '@selit/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PackageSearch, Search, SlidersHorizontal } from 'lucide-react-native';
import { useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, View } from 'react-native';

import { Appear } from '@/components/motion/Appear';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { SchoolPicker } from '@/features/schools/components/SchoolPicker';
import { getApi } from '@/lib/api';
import { useColumns } from '@/lib/hooks/use-columns';
import { COLORS, MAX_CONTENT_WIDTH } from '@/theme';

import { ListingCard } from './ListingCard';
import { ListingGridSkeleton } from './ListingGrid';

const SORTS: { value: ListingSort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Cheapest' },
  { value: 'price_desc', label: 'Highest price' },
];

const BUDGETS = [5000, 20000, 50000, 150000];
const PAGE_SIZE = 12;
const GAP = 12;

type ListingBrowserProps = {
  initial?: ListingFilters;
  /** Filters this view always applies, e.g. a category page. */
  fixed?: ListingFilters;
  header?: ReactNode;
};

/** Search, filter and scroll through listings, loading more as you reach the end. */
export function ListingBrowser({ initial = {}, fixed = {}, header }: ListingBrowserProps) {
  const columns = useColumns();
  const [filters, setFilters] = useState<ListingFilters>({ sort: 'newest', ...initial });
  const [draftSearch, setDraftSearch] = useState(initial.search ?? '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const applied = useMemo(() => ({ ...filters, ...fixed, limit: PAGE_SIZE }), [filters, fixed]);

  const query = useInfiniteQuery({
    queryKey: ['listings', 'browse', applied],
    queryFn: ({ pageParam }) => getApi().listings.list({ ...applied, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.pages ? last.pagination.page + 1 : undefined,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const total = query.data?.pages[0]?.pagination.total ?? 0;
  const update = (changes: Partial<ListingFilters>) =>
    setFilters((current) => ({ ...current, ...changes }));
  const activeCount = [
    filters.school,
    filters.condition,
    filters.priceMax,
    !fixed.category && filters.category,
  ].filter(Boolean).length;

  const listHeader = (
    <View
      style={{
        width: '100%',
        maxWidth: MAX_CONTENT_WIDTH,
        alignSelf: 'center',
        paddingHorizontal: '5%',
      }}
    >
      {header}
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <TextField
            value={draftSearch}
            onChangeText={setDraftSearch}
            placeholder="Search items"
            returnKeyType="search"
            onSubmitEditing={() => update({ search: draftSearch.trim() || undefined })}
            leadingIcon={<Search size={18} color={COLORS.ink[400]} />}
          />
        </View>
        <View>
          <IconButton
            accessibilityLabel="Filters"
            className="size-14 rounded-2xl"
            icon={<SlidersHorizontal size={20} color={COLORS.ink[900]} />}
            onPress={() => setIsFilterOpen(true)}
          />
          {activeCount ? (
            <View className="absolute -right-1 -top-1 size-5 items-center justify-center rounded-full bg-brand-600">
              <Text className="font-body-bold text-[10px] text-white">{activeCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
      {!fixed.category ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          style={{ marginHorizontal: '-5.5%' }}
        >
          <View className="flex-row gap-2 px-[5%]">
            <Chip
              label="All"
              isActive={!filters.category}
              onPress={() => update({ category: undefined })}
            />
            {CATEGORIES.map((category) => (
              <Chip
                key={category.slug}
                label={category.name}
                isActive={filters.category === category.slug}
                onPress={() => update({ category: category.slug })}
              />
            ))}
          </View>
        </ScrollView>
      ) : null}
      <Text className="mb-3 mt-5 text-sm text-ink-500">
        {query.isPending
          ? 'Looking…'
          : `${total.toLocaleString('en-NG')} ${total === 1 ? 'item' : 'items'}`}
      </Text>
      {query.isPending ? <ListingGridSkeleton count={columns * 2} /> : null}
    </View>
  );

  return (
    <>
      <FlatList
        key={columns}
        data={query.isPending ? [] : items}
        numColumns={columns}
        keyExtractor={(listing: Listing) => listing.id}
        ListHeaderComponent={listHeader}
        initialNumToRender={8}
        contentContainerStyle={{ paddingBottom: 140 }}
        columnWrapperStyle={{
          width: '100%',
          maxWidth: MAX_CONTENT_WIDTH,
          alignSelf: 'center',
          paddingHorizontal: '5%',
          gap: GAP,
        }}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1 / columns, marginBottom: GAP }}>
            <Appear index={index} enabled={index < columns * 3}>
              <ListingCard listing={item} />
            </Appear>
          </View>
        )}
        onEndReachedThreshold={0.6}
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
        }}
        refreshControl={
          <RefreshControl
            refreshing={query.isRefetching && !query.isFetchingNextPage}
            onRefresh={() => void query.refetch()}
            tintColor={COLORS.brand[600]}
            colors={[COLORS.brand[600]]}
          />
        }
        ListEmptyComponent={
          query.isPending ? undefined : (
            <View style={{ paddingHorizontal: '5%' }}>
              <EmptyState
                icon={<PackageSearch size={26} color={COLORS.brand[700]} />}
                title={query.isError ? "Couldn't load items" : 'Nothing here yet'}
                description={
                  query.isError
                    ? messageOf(query.error)
                    : 'Try another search or clear a filter to see more.'
                }
                action={
                  query.isError ? (
                    <Button variant="secondary" onPress={() => void query.refetch()}>
                      Try again
                    </Button>
                  ) : undefined
                }
              />
            </View>
          )
        }
        ListFooterComponent={
          query.isFetchingNextPage ? (
            <ActivityIndicator className="mt-4" color={COLORS.brand[600]} />
          ) : undefined
        }
      />

      <Sheet
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filters"
        footer={
          <>
            <View className="flex-1">
              <Button
                variant="secondary"
                onPress={() => {
                  setFilters({ sort: 'newest', search: filters.search });
                  setIsFilterOpen(false);
                }}
              >
                Clear
              </Button>
            </View>
            <View className="flex-1">
              <Button onPress={() => setIsFilterOpen(false)}>Show items</Button>
            </View>
          </>
        }
      >
        <View className="gap-6">
          <SchoolPicker
            label="School"
            value={filters.school ?? ''}
            onChange={(school) => update({ school: school || undefined })}
            allowAll
          />
          <View className="gap-2">
            <Text className="font-body-semibold text-sm text-ink-800">Sort by</Text>
            <View className="flex-row flex-wrap gap-2">
              {SORTS.map((sort) => (
                <Chip
                  key={sort.value}
                  label={sort.label}
                  isActive={filters.sort === sort.value}
                  onPress={() => update({ sort: sort.value })}
                />
              ))}
            </View>
          </View>
          <View className="gap-2">
            <Text className="font-body-semibold text-sm text-ink-800">Condition</Text>
            <View className="flex-row flex-wrap gap-2">
              <Chip
                label="Any"
                isActive={!filters.condition}
                onPress={() => update({ condition: undefined })}
              />
              {CONDITIONS.map((condition) => (
                <Chip
                  key={condition.value}
                  label={condition.label}
                  isActive={filters.condition === condition.value}
                  onPress={() => update({ condition: condition.value })}
                />
              ))}
            </View>
          </View>
          <View className="gap-2">
            <Text className="font-body-semibold text-sm text-ink-800">Budget</Text>
            <View className="flex-row flex-wrap gap-2">
              <Chip
                label="Any"
                isActive={!filters.priceMax}
                onPress={() => update({ priceMax: undefined })}
              />
              {BUDGETS.map((budget) => (
                <Chip
                  key={budget}
                  label={`Under ₦${budget.toLocaleString('en-NG')}`}
                  isActive={filters.priceMax === budget}
                  onPress={() => update({ priceMax: budget })}
                />
              ))}
            </View>
          </View>
        </View>
      </Sheet>
    </>
  );
}
