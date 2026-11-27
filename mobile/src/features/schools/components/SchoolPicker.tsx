import { displayName, findSchoolByName, searchSchools } from '@selit/shared';
import { Check, GraduationCap, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { PressableScale } from '@/components/motion/PressableScale';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { cn } from '@/lib/cn';
import { COLORS } from '@/theme';

type SchoolPickerProps = {
  value: string;
  onChange: (schoolName: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  allowAll?: boolean;
  compact?: boolean;
};

/** Search 385 Nigerian schools by name, short name or town. */
export function SchoolPicker({
  value,
  onChange,
  label,
  placeholder = 'Choose your school',
  error,
  allowAll = false,
  compact = false,
}: SchoolPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchSchools(query, 30), [query]);
  const selected = findSchoolByName(value);

  function choose(name: string) {
    onChange(name);
    setOpen(false);
    setQuery('');
  }

  return (
    <View className="gap-2">
      {label ? <Text className="font-body-semibold text-sm text-ink-800">{label}</Text> : null}
      <PressableScale
        onPress={() => setOpen(true)}
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        className={cn(
          'flex-row items-center gap-3 rounded-2xl border bg-surface px-4',
          compact ? 'h-12' : 'h-14',
          error ? 'border-danger-500' : 'border-line-strong',
        )}
      >
        <GraduationCap size={18} color={COLORS.ink[400]} />
        <Text numberOfLines={1} className={cn('flex-1', value ? 'text-ink-900' : 'text-ink-400')}>
          {selected ? displayName(selected) : value || (allowAll ? 'All schools' : placeholder)}
        </Text>
      </PressableScale>
      {error ? <Text className="font-body-medium text-sm text-danger-600">{error}</Text> : null}

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Choose a school"
        description="Universities, polytechnics and colleges across Nigeria."
      >
        <TextField
          autoFocus
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, e.g. DSPG or Abraka"
          leadingIcon={<Search size={18} color={COLORS.ink[400]} />}
          returnKeyType="search"
          autoCorrect={false}
        />
        <View className="mt-3">
          {allowAll ? (
            <Pressable
              onPress={() => choose('')}
              className="flex-row items-center gap-3 border-b border-line py-3.5"
            >
              <Text className="flex-1 font-body-semibold text-ink-900">All schools</Text>
              {!value ? <Check size={18} color={COLORS.brand[600]} /> : null}
            </Pressable>
          ) : null}
          {results.map((school) => (
            <Pressable
              key={school.slug}
              onPress={() => choose(school.name)}
              accessibilityRole="button"
              className="flex-row items-center gap-3 border-b border-line py-3.5"
            >
              <View className="flex-1">
                <Text className="font-body-semibold text-ink-900">
                  {school.shortName || school.name}
                </Text>
                <Text numberOfLines={1} className="text-sm text-ink-500">
                  {school.shortName ? school.name : `${school.city}, ${school.state}`}
                </Text>
              </View>
              {value === school.name ? <Check size={18} color={COLORS.brand[600]} /> : null}
            </Pressable>
          ))}
          {results.length === 0 ? (
            <Text className="py-6 text-center text-ink-500">No school matches “{query}”.</Text>
          ) : null}
        </View>
      </Sheet>
    </View>
  );
}
