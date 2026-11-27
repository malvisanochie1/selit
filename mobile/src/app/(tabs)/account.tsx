import { router, type Href } from 'expo-router';
import {
  BadgeCheck,
  Building2,
  ChevronRight,
  FileText,
  Heart,
  LifeBuoy,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  Star,
  UserRound,
  type LucideIcon,
} from 'lucide-react-native';
import { View } from 'react-native';

import { Logo } from '@/components/layout/Logo';
import { Screen } from '@/components/layout/Screen';
import { Appear } from '@/components/motion/Appear';
import { PressableScale } from '@/components/motion/PressableScale';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui/Text';
import { useSession } from '@/features/auth/session-store';
import { useSignOut } from '@/features/auth/use-auth';
import { cn } from '@/lib/cn';
import { COLORS, SHADOW } from '@/theme';

type MenuItem = { href: Href; label: string; icon: LucideIcon };

const SELLING: MenuItem[] = [
  { href: '/my/listings', label: 'My listings', icon: Package },
  { href: '/my/apartments', label: 'My apartments', icon: Building2 },
  { href: '/my/reviews', label: 'Reviews about me', icon: Star },
];

const ACCOUNT: MenuItem[] = [
  { href: '/saved', label: 'Saved items', icon: Heart },
  { href: '/verification', label: 'Verification', icon: BadgeCheck },
  { href: '/profile', label: 'Edit profile', icon: UserRound },
  { href: '/settings', label: 'Settings and security', icon: Settings },
];

const SUPPORT: MenuItem[] = [
  { href: '/safety', label: 'Safety guide', icon: ShieldCheck },
  { href: '/help', label: 'Help and questions', icon: LifeBuoy },
  { href: '/legal/terms', label: 'Terms and privacy', icon: FileText },
];

function MenuGroup({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <View className="mt-6">
      <Text className="mb-2 px-1 font-body-bold text-xs uppercase tracking-widest text-ink-400">
        {title}
      </Text>
      <View style={SHADOW.card} className="overflow-hidden rounded-3xl bg-surface">
        {items.map((item, index) => (
          <PressableScale
            key={item.label}
            onPress={() => router.push(item.href)}
            accessibilityRole="link"
            scaleTo={0.98}
            className={cn(
              'flex-row items-center gap-3 px-4 py-4',
              index > 0 && 'border-t border-line',
            )}
          >
            <View className="size-9 items-center justify-center rounded-xl bg-canvas">
              <item.icon size={18} color={COLORS.ink[700]} />
            </View>
            <Text className="flex-1 font-body-medium text-ink-900">{item.label}</Text>
            <ChevronRight size={18} color={COLORS.ink[300]} />
          </PressableScale>
        ))}
      </View>
    </View>
  );
}

export default function AccountScreen() {
  const { user, isLoading } = useSession();
  const signOut = useSignOut();

  if (!user) {
    return (
      <Screen>
        <View className="mt-6 items-center rounded-[32px] bg-surface p-8" style={SHADOW.card}>
          <Logo size={40} />
          <Heading className="mt-6 text-center text-2xl">Your campus marketplace</Heading>
          <Text className="mt-2 text-center leading-6 text-ink-500">
            Sign in to contact sellers, list your things and save items for later.
          </Text>
          <View className="mt-6 w-full gap-3">
            <Button size="lg" isLoading={isLoading} onPress={() => router.push('/sign-in')}>
              Sign in
            </Button>
            <Button size="lg" variant="secondary" onPress={() => router.push('/sign-up')}>
              Create an account
            </Button>
          </View>
        </View>
        <MenuGroup
          title="Explore"
          items={[{ href: '/saved', label: 'Saved items', icon: Heart }, ...SUPPORT]}
        />
      </Screen>
    );
  }

  const isVerified = user.verificationStatus === 'verified';
  return (
    <Screen>
      <Appear>
        <View
          style={SHADOW.card}
          className="mt-4 flex-row items-center gap-4 rounded-[28px] bg-surface p-5"
        >
          <Avatar name={user.fullName} src={user.profileImageUrl} size="lg" />
          <View className="flex-1">
            <Heading numberOfLines={1} className="text-xl">
              {user.fullName}
            </Heading>
            <Text numberOfLines={1} className="text-sm text-ink-500">
              {user.email}
            </Text>
            <View className="mt-2 flex-row gap-1.5">
              {isVerified ? (
                <Badge tone="brand" icon={<BadgeCheck size={12} color={COLORS.brand[700]} />}>
                  Verified
                </Badge>
              ) : (
                <Badge tone="amber">
                  {user.verificationStatus === 'pending' ? 'Verification in review' : 'Unverified'}
                </Badge>
              )}
              {user.role === 'admin' ? <Badge tone="info">Admin</Badge> : null}
            </View>
          </View>
        </View>
      </Appear>

      {!isVerified && user.verificationStatus !== 'pending' ? (
        <PressableScale
          onPress={() => router.push('/verification')}
          className="mt-4 flex-row items-center gap-3 rounded-3xl bg-ink-900 p-4"
          scaleTo={0.98}
        >
          <ShieldCheck size={22} color={COLORS.glow} />
          <View className="flex-1">
            <Text className="font-body-semibold text-white">Get your verified badge</Text>
            <Text className="text-xs text-ink-300">
              Buyers reply faster to verified sellers. Takes 2 minutes.
            </Text>
          </View>
          <ChevronRight size={18} color={COLORS.ink[300]} />
        </PressableScale>
      ) : null}

      {user.role === 'admin' ? (
        <MenuGroup
          title="Admin"
          items={[{ href: '/admin', label: 'Admin dashboard', icon: ShieldCheck }]}
        />
      ) : null}
      <MenuGroup title="Selling" items={SELLING} />
      <MenuGroup title="Account" items={ACCOUNT} />
      <MenuGroup title="Support" items={SUPPORT} />

      <Button
        className="mt-8"
        variant="ghost"
        icon={<LogOut size={18} color={COLORS.danger[600]} />}
        isLoading={signOut.isPending}
        onPress={() => signOut.mutate()}
      >
        <Text className="font-body-semibold text-danger-600">Sign out</Text>
      </Button>
    </Screen>
  );
}
