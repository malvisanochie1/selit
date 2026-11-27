import { CATEGORIES, SITE } from '@selit/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Clock,
  Flag,
  Handshake,
  MapPinned,
  MessageCircle,
  Search,
  ShieldCheck,
  Tag,
  Users,
} from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Logo } from '@/components/layout/Logo';
import { Screen } from '@/components/layout/Screen';
import { Appear } from '@/components/motion/Appear';
import { PressableScale } from '@/components/motion/PressableScale';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { Heading, Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { ApartmentCard } from '@/features/apartments/components/ApartmentCard';
import { useApartments } from '@/features/apartments/hooks';
import { useSession } from '@/features/auth/session-store';
import { CATEGORY_ICONS, CATEGORY_TONES } from '@/features/listings/category-style';
import { ListingGrid, ListingGridSkeleton } from '@/features/listings/components/ListingGrid';
import { useListings } from '@/features/listings/hooks';
import { SchoolPicker } from '@/features/schools/components/SchoolPicker';
import { isSampleMode } from '@/config/env';
import { useColumns } from '@/lib/hooks/use-columns';
import { cn } from '@/lib/cn';
import { COLORS, SHADOW } from '@/theme';

const STEPS = [
  {
    icon: Search,
    title: 'Find it near you',
    text: 'Search by school, category and budget. Every listing shows the price, condition and a public meet-up spot.',
  },
  {
    icon: MessageCircle,
    title: 'Chat on WhatsApp',
    text: 'Sign in and tap WhatsApp or Call to reach the seller or agent directly. No middlemen adding their own price.',
  },
  {
    icon: Handshake,
    title: 'Meet, inspect, then pay',
    text: 'Meet in a busy public place, check the item or the room, and only pay when you are happy.',
  },
];

const SAFETY = [
  { icon: BadgeCheck, title: 'Verified identities', text: 'Sellers and agents confirm their ID with a live selfie.' },
  { icon: MapPinned, title: 'Public meet-up spots', text: 'Sales happen at busy public places, never private addresses.' },
  { icon: Flag, title: 'Report in two taps', text: 'Suspicious listing? Report it and our team acts fast.' },
];

const APARTMENT_POINTS = [
  { icon: ShieldCheck, text: 'Only ID-verified agents can list a home' },
  { icon: Clock, text: 'Listings expire unless the agent confirms they are still free' },
];

function HomeHeader() {
  const { user } = useSession();
  return (
    <View className="flex-row items-center justify-between py-3">
      <Logo />
      <View className="flex-row items-center gap-2">
        {user ? (
          <PressableScale onPress={() => router.push('/account')} accessibilityLabel="Your account">
            <Avatar name={user.fullName} src={user.profileImageUrl} size="sm" />
          </PressableScale>
        ) : (
          <Button variant="ghost" size="sm" onPress={() => router.push('/sign-in')}>
            Sign in
          </Button>
        )}
      </View>
    </View>
  );
}

function Hero() {
  const [query, setQuery] = useState('');
  const [school, setSchool] = useState('');
  const search = () => router.push({ pathname: '/browse', params: { q: query.trim(), school } });

  return (
    <Appear>
      <View className="mt-2 self-start flex-row items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5">
        <View className="size-2 rounded-full bg-brand-500" />
        <Text className="font-body-semibold text-xs text-brand-800">Now live in Ogwashi-Uku, Delta State</Text>
      </View>
      <Heading className="mt-5 text-[40px] leading-[44px]">
        Buy, sell and find a room <Heading className="text-[40px] leading-[44px] text-brand-600">near your campus.</Heading>
      </Heading>
      <Text className="mt-4 text-base leading-6 text-ink-500">
        Pick up a mattress from a graduating student, sell your old phone, or find a self-contain without walking
        from agent to agent.
      </Text>
      <View style={SHADOW.card} className="mt-6 gap-3 rounded-3xl bg-surface p-3">
        <TextField
          value={query}
          onChangeText={setQuery}
          placeholder="Mattress, laptop, gas…"
          returnKeyType="search"
          onSubmitEditing={search}
          leadingIcon={<Search size={18} color={COLORS.ink[400]} />}
        />
        <SchoolPicker value={school} onChange={setSchool} allowAll compact />
        <Button size="lg" onPress={search} trailingIcon={<ArrowRight size={18} color="#fff" />}>
          Search
        </Button>
      </View>
    </Appear>
  );
}

function Categories() {
  return (
    <View className="mt-12">
      <SectionHeading eyebrow="Categories" title="What do you need?" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: '-5.5%' }}>
        <View className="flex-row gap-3 px-[5%]">
          {CATEGORIES.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.icon];
            const tone = CATEGORY_TONES[category.tone];
            return (
              <Appear key={category.slug} index={index} enabled={index < 4}>
                <PressableScale
                  onPress={() => router.push(`/category/${category.slug}`)}
                  accessibilityRole="link"
                  accessibilityLabel={category.name}
                  innerStyle={{ width: 148 }}
                  className="h-40 justify-between rounded-3xl border border-line bg-surface p-4"
                >
                  <View className={cn('size-12 items-center justify-center rounded-2xl', tone.box)}>
                    <Icon size={22} color={tone.color} strokeWidth={1.8} />
                  </View>
                  <View>
                    <Text className="font-display text-base text-ink-900">{category.name}</Text>
                    <Text numberOfLines={2} className="mt-0.5 text-xs leading-4 text-ink-500">
                      {category.blurb}
                    </Text>
                  </View>
                </PressableScale>
              </Appear>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function FreshListings() {
  const columns = useColumns();
  const { data, isPending } = useListings({ sort: 'newest', limit: columns * 4 });
  return (
    <View className="mt-12">
      <SectionHeading
        eyebrow="Just listed"
        title="Fresh near campus"
        action={
          <Link href="/browse" className="font-body-semibold text-sm text-brand-700">
            See all
          </Link>
        }
      />
      {isPending ? <ListingGridSkeleton count={columns * 2} /> : <ListingGrid listings={data?.items ?? []} />}
    </View>
  );
}

function ApartmentsTeaser() {
  const { data, isPending } = useApartments({ sort: 'newest', limit: 2 });
  return (
    <View className="mt-12 overflow-hidden rounded-[32px]">
      <LinearGradient colors={[COLORS.ink[950], COLORS.ink[800]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View className="p-6">
          <Text className="mb-2 font-body-bold text-xs uppercase tracking-widest text-glow">Apartments</Text>
          <Heading className="text-3xl leading-9 text-white">Find a room without the agent runaround.</Heading>
          <Text className="mt-3 leading-6 text-ink-300">
            Every vacant self-contain and flat near your school, with the rent upfront.
          </Text>
          <View className="mt-5 gap-3">
            {APARTMENT_POINTS.map((point) => (
              <View key={point.text} className="flex-row items-start gap-3">
                <point.icon size={18} color={COLORS.glow} />
                <Text className="flex-1 text-sm text-ink-200">{point.text}</Text>
              </View>
            ))}
          </View>
          <View className="mt-6 gap-4">
            {isPending ? (
              <Skeleton height={260} />
            ) : (
              (data?.items ?? []).map((apartment) => <ApartmentCard key={apartment.id} apartment={apartment} />)
            )}
          </View>
          <Button className="mt-6" size="lg" onPress={() => router.push('/apartments')} trailingIcon={<ArrowRight size={18} color="#fff" />}>
            Browse apartments
          </Button>
        </View>
      </LinearGradient>
    </View>
  );
}

function HowItWorks() {
  return (
    <View className="mt-12">
      <SectionHeading eyebrow="How it works" title="Simple, local and safe" />
      <View className="gap-3">
        {STEPS.map((step, index) => (
          <View key={step.title} className="flex-row gap-4 rounded-3xl border border-line bg-surface p-5">
            <View className="size-11 items-center justify-center rounded-2xl bg-brand-50">
              <step.icon size={20} color={COLORS.brand[700]} />
            </View>
            <View className="flex-1">
              <Text className="font-body-bold text-xs text-ink-400">STEP {index + 1}</Text>
              <Text className="mt-0.5 font-display text-lg text-ink-900">{step.title}</Text>
              <Text className="mt-1 text-sm leading-5 text-ink-500">{step.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function SafetyBand() {
  return (
    <View className="mt-12 rounded-[32px] bg-brand-50 p-6">
      <Text className="mb-2 font-body-bold text-xs uppercase tracking-widest text-brand-700">Safety first</Text>
      <Heading className="text-2xl">Built to keep scammers out</Heading>
      <View className="mt-5 gap-4">
        {SAFETY.map((item) => (
          <View key={item.title} className="flex-row gap-3">
            <View className="size-10 items-center justify-center rounded-2xl bg-surface">
              <item.icon size={18} color={COLORS.brand[700]} />
            </View>
            <View className="flex-1">
              <Text className="font-body-semibold text-ink-900">{item.title}</Text>
              <Text className="text-sm leading-5 text-ink-600">{item.text}</Text>
            </View>
          </View>
        ))}
      </View>
      <Button variant="secondary" className="mt-6" onPress={() => router.push('/safety')}>
        Read the safety guide
      </Button>
    </View>
  );
}

function SellCta() {
  return (
    <View className="mt-12 overflow-hidden rounded-[32px] bg-brand-700 p-6">
      <Heading className="text-3xl leading-9 text-white">Graduating? Turn your hostel things into cash.</Heading>
      <Text className="mt-3 leading-6 text-brand-100">
        Listing is free and takes about two minutes. The next set of freshers is already looking.
      </Text>
      <View className="mt-5 flex-row flex-wrap gap-2">
        {[
          { icon: Camera, text: 'Snap a few photos' },
          { icon: Tag, text: 'Set a fair price' },
          { icon: Users, text: 'Students reach out' },
        ].map((item) => (
          <View key={item.text} className="flex-row items-center gap-1.5 rounded-full bg-white/10 px-3 py-2">
            <item.icon size={14} color={COLORS.glow} />
            <Text className="font-body-medium text-xs text-white">{item.text}</Text>
          </View>
        ))}
      </View>
      <Button variant="dark" size="lg" className="mt-6" onPress={() => router.push('/sell')}>
        Start selling
      </Button>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <Screen header={null}>
      <HomeHeader />
      {isSampleMode ? (
        <View className="mt-1 self-start rounded-full bg-amber-100 px-3 py-1">
          <Text className="font-body-semibold text-xs text-amber-700">Demo mode · sample data</Text>
        </View>
      ) : null}
      <Hero />
      <Categories />
      <FreshListings />
      <ApartmentsTeaser />
      <HowItWorks />
      <SafetyBand />
      <SellCta />
      <Text className="mt-10 text-center text-xs text-ink-400">
        {SITE.name} · {SITE.tagline}
      </Text>
    </Screen>
  );
}
