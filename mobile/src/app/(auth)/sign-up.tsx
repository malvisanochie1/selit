import { ApiError, fieldErrorsOf, messageOf, signUpSchema } from '@selit/shared';
import { Link, router } from 'expo-router';
import { Check, Mail, UserRound } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { PasswordField } from '@/features/auth/components/PasswordField';
import { PasswordStrength } from '@/features/auth/components/PasswordStrength';
import { useSignUp } from '@/features/auth/use-auth';
import { cn } from '@/lib/cn';
import { COLORS } from '@/theme';

type Intent = 'buyer' | 'seller';

export default function SignUpScreen() {
  const signUp = useSignUp();
  const [intent, setIntent] = useState<Intent>('buyer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasAgreed, setHasAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const parsed = signUpSchema.safeParse({ fullName, email, password, accountType: intent });
    if (!parsed.success) return setErrors(fieldErrorsOf(parsed.error));
    if (!hasAgreed) return setErrors({ terms: 'Please accept the terms to continue.' });
    setErrors({});
    signUp.mutate(parsed.data, {
      onSuccess: (result) => {
        if (result.needsEmailConfirmation) {
          router.replace({ pathname: '/check-email', params: { email: parsed.data.email } });
          return;
        }
        router.replace(intent === 'seller' ? '/sell' : '/');
      },
      onError: (error) => {
        if (error instanceof ApiError) setErrors(error.fieldErrors);
      },
    });
  }

  return (
    <AuthShell
      title="Create your account"
      description="Free for students, agents and landlords. Takes a minute."
    >
      <View className="gap-5">
        <SegmentedTabs
          value={intent}
          onChange={setIntent}
          options={[
            { value: 'buyer', label: 'I want to buy' },
            { value: 'seller', label: 'I want to sell' },
          ]}
        />
        {signUp.isError ? <Notice tone="danger">{messageOf(signUp.error)}</Notice> : null}
        <TextField
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="As it appears on your ID"
          autoComplete="name"
          textContentType="name"
          error={errors.fullName}
          leadingIcon={<UserRound size={18} color={COLORS.ink[400]} />}
        />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          error={errors.email}
          leadingIcon={<Mail size={18} color={COLORS.ink[400]} />}
        />
        <View className="gap-2">
          <PasswordField
            label="Password"
            value={password}
            onChangeText={setPassword}
            autoComplete="new-password"
            textContentType="newPassword"
            error={errors.password}
          />
          <PasswordStrength password={password} />
        </View>
        <Pressable
          onPress={() => setHasAgreed((agreed) => !agreed)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: hasAgreed }}
          className="flex-row items-start gap-3"
        >
          <View
            className={cn(
              'mt-0.5 size-5 items-center justify-center rounded-md border-2',
              hasAgreed ? 'border-brand-600 bg-brand-600' : 'border-ink-300',
            )}
          >
            {hasAgreed ? <Check size={14} color="#fff" strokeWidth={3} /> : null}
          </View>
          <Text className="flex-1 text-sm leading-5 text-ink-600">
            I agree to the{' '}
            <Link href="/legal/terms" className="font-body-semibold text-brand-700">
              terms
            </Link>{' '}
            and{' '}
            <Link href="/legal/community-guidelines" className="font-body-semibold text-brand-700">
              community guidelines
            </Link>
            , and I&apos;ll meet buyers and sellers in public places.
          </Text>
        </Pressable>
        {errors.terms ? (
          <Text className="-mt-3 text-sm text-danger-600">{errors.terms}</Text>
        ) : null}
        <Button size="lg" onPress={submit} isLoading={signUp.isPending}>
          Create account
        </Button>
        <Text className="text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link href="/sign-in" replace className="font-body-semibold text-brand-700">
            Sign in
          </Link>
        </Text>
      </View>
    </AuthShell>
  );
}
