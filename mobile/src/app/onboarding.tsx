import { router } from 'expo-router';
import { Handshake, MessageCircle, ShieldCheck, type LucideIcon } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, useWindowDimensions, View, type ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui/Text';
import { useOnboardingStore } from '@/features/onboarding/onboarding-store';
import { cn } from '@/lib/cn';
import { COLORS } from '@/theme';

type Slide = { icon: LucideIcon; tint: string; color: string; title: string; text: string };

const SLIDES: Slide[] = [
  {
    icon: MessageCircle,
    tint: 'bg-brand-50',
    color: COLORS.brand[600],
    title: 'Buy and sell around your campus',
    text: 'Mattresses, phones, textbooks and more from students near you. Chat on WhatsApp, no middlemen.',
  },
  {
    icon: Handshake,
    tint: 'bg-amber-50',
    color: COLORS.amber[600],
    title: 'Find a room without the runaround',
    text: 'Vacant self-contains and flats near your school, from ID-verified agents, with the rent upfront.',
  },
  {
    icon: ShieldCheck,
    tint: 'bg-info-50',
    color: COLORS.info[500],
    title: 'Built to keep scammers out',
    text: 'Verified badges, public meet-up spots and two-tap reports. Meet, inspect, then pay.',
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const finish = useOnboardingStore((state) => state.finish);
  const scroller = useRef<ScrollViewInstance>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  useEffect(() => {
    scroller.current?.scrollTo({ x: index * width, animated: true });
  }, [index, width]);

  function start(path: '/' | '/sign-up') {
    finish();
    router.replace(path);
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View
        style={{ paddingHorizontal: '6%' }}
        className="h-16 flex-row items-center justify-between"
      >
        <Logo />
        {!isLast ? (
          <Button variant="ghost" size="sm" onPress={() => start('/')}>
            Skip
          </Button>
        ) : null}
      </View>
      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) =>
          setIndex(Math.round(event.nativeEvent.contentOffset.x / width))
        }
        className="flex-1"
      >
        {SLIDES.map((slide) => (
          <View
            key={slide.title}
            style={{ width, paddingHorizontal: '8%' }}
            className="flex-1 justify-center"
          >
            <View style={{ maxWidth: 480, alignSelf: 'center', width: '100%' }}>
              <View
                className={cn('size-28 items-center justify-center rounded-[36px]', slide.tint)}
              >
                <slide.icon size={52} color={slide.color} strokeWidth={1.6} />
              </View>
              <Heading className="mt-10 text-[34px] leading-[40px]">{slide.title}</Heading>
              <Text className="mt-4 text-lg leading-7 text-ink-500">{slide.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View
        style={{ paddingHorizontal: '6%', maxWidth: 560, width: '100%', alignSelf: 'center' }}
        className="gap-5 pb-6"
      >
        <View className="flex-row justify-center gap-2">
          {SLIDES.map((slide, dot) => (
            <View
              key={slide.title}
              className={cn(
                'h-2 rounded-full',
                dot === index ? 'w-6 bg-brand-600' : 'w-2 bg-ink-200',
              )}
            />
          ))}
        </View>
        {isLast ? (
          <View className="gap-3">
            <Button size="lg" onPress={() => start('/sign-up')}>
              Get started
            </Button>
            <Button size="lg" variant="ghost" onPress={() => start('/')}>
              Browse first
            </Button>
          </View>
        ) : (
          <Button size="lg" onPress={() => setIndex((current) => current + 1)}>
            Next
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}
