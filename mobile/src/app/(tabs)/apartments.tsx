import { APARTMENT_TYPES, messageOf, type Apartment, type ApartmentFilters } from '@selit/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Building2, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageTitle } from '@/components/layout/PageTitle';
import { Appear } from '@/components/motion/Appear';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { TextField } from '@/components/ui/TextField';
import { ApartmentCard } from '@/features/apartments/components/ApartmentCard';
import { SchoolPicker } from '@/features/schools/components/SchoolPicker';
import { getApi } from '@/lib/api';
import { useColumns } from '@/lib/hooks/use-columns';
import { COLORS, MAX_CONTENT_WIDTH } from '@/theme';

const BUDGETS = [100000, 200000, 400000];
const GAP = 16;

export default function ApartmentsScreen() {
  const columns = useColumns(1);
  const [filters, setFilters] = useState<ApartmentFilters>({ sort: 'newest' });
  const [draft, setDraft] = useState('');
  const applied = useMemo(() => ({ ...filters, limit: 9 }), [filters]);
  const update = (changes: Partial<ApartmentFilters>) =>
    setFilters((current) => ({ ...current, ...changes }));

  const query = useInfiniteQuery({
    queryKey: ['apartments', 'browse', applied],
    queryFn: ({ pageParam }) => getApi().apartments.list({ ...applied, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.pages ? last.pagination.page + 1 : undefined,
  });
  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  const header = (
    <View
      style={{
        width: '100%',
        maxWidth: MAX_CONTENT_WIDTH,
        alignSelf: 'center',
        paddingHorizontal: '5%',
      }}
    >
      <PageTitle
        title="Apartments"
        description="Vacant rooms near your school, from ID-verified agents. Rent shown upfront."
      />
      <View className="gap-3">
        <TextField
          value={draft}
          onChangeText={setDraft}
          placeholder="Area or street"
          returnKeyType="search"
          onSubmitEditing={() => update({ search: draft.trim() || undefined })}
          leadingIcon={<Search size={18} color={COLORS.ink[400]} />}
        />
        <SchoolPicker
          value={filters.school ?? ''}
          onChange={(school) => update({ school: school || undefined })}
          allowAll
          compact
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        style={{ marginHorizontal: '-5.5%' }}
      >
        <View className="flex-row gap-2 px-[5%]">
          <Chip
            label="Any type"
            isActive={!filters.type}
            onPress={() => update({ type: undefined })}
          />
          {APARTMENT_TYPES.map((type) => (
            <Chip
              key={type.value}
              label={type.label}
              isActive={filters.type === type.value}
              onPress={() => update({ type: type.value })}
            />
          ))}
        </View>
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-5 mt-2"
        style={{ marginHorizontal: '-5.5%' }}
      >
        <View className="flex-row gap-2 px-[5%]">
          <Chip
            label="Any budget"
            isActive={!filters.priceMax}
            onPress={() => update({ priceMax: undefined })}
          />
          {BUDGETS.map((budget) => (
            <Chip
              key={budget}
              label={`Under ₦${budget / 1000}k`}
              isActive={filters.priceMax === budget}
              onPress={() => update({ priceMax: budget })}
            />
          ))}
        </View>
      </ScrollView>
      {query.isPending ? (
        <View className="gap-4">
          <Skeleton height={300} />
          <Skeleton height={300} />
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-canvas">
      <FlatList
        key={columns}
        data={query.isPending ? [] : items}
        numColumns={columns}
        keyExtractor={(apartment: Apartment) => apartment.id}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingBottom: 140 }}
        columnWrapperStyle={
          columns > 1
            ? {
                width: '100%',
                maxWidth: MAX_CONTENT_WIDTH,
                alignSelf: 'center',
                paddingHorizontal: '5%',
                gap: GAP,
              }
            : undefined
        }
        renderItem={({ item, index }) => (
          <View
            style={
              columns > 1
                ? { flex: 1 / columns, marginBottom: GAP }
                : {
                    width: '100%',
                    maxWidth: MAX_CONTENT_WIDTH,
                    alignSelf: 'center',
                    paddingHorizontal: '5%',
                    marginBottom: GAP,
                  }
            }
          >
            <Appear index={index} enabled={index < 3}>
              <ApartmentCard apartment={item} />
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
                icon={<Building2 size={26} color={COLORS.brand[700]} />}
                title={query.isError ? "Couldn't load apartments" : 'No rooms match yet'}
                description={
                  query.isError
                    ? messageOf(query.error)
                    : 'New rooms appear as verified agents list them. Try another school or budget.'
                }
                action={
                  <Button variant="secondary" onPress={() => router.push('/sell/apartment')}>
                    I&apos;m an agent or landlord
                  </Button>
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
    </SafeAreaView>
  );
}
