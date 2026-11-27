import { formatDate, LEGAL_DOCUMENTS } from '@selit/shared';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Chip } from '@/components/ui/Chip';
import { Heading, Text } from '@/components/ui/Text';

export default function LegalScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const document = LEGAL_DOCUMENTS.find((item) => item.slug === slug) ?? LEGAL_DOCUMENTS[0];

  return (
    <Screen header={<ScreenHeader />} maxWidth={760}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          {LEGAL_DOCUMENTS.map((item) => (
            <Chip
              key={item.slug}
              label={item.title}
              isActive={item.slug === document.slug}
              onPress={() => router.setParams({ slug: item.slug })}
            />
          ))}
        </View>
      </ScrollView>
      <PageTitle
        title={document.title}
        description={`${document.summary} Updated ${formatDate(document.updatedAt)}.`}
      />
      <View className="gap-7">
        {document.sections.map((section) => (
          <View key={section.heading} className="gap-2">
            <Heading className="text-lg">{section.heading}</Heading>
            {section.paragraphs.map((paragraph) => (
              <Text key={paragraph} className="leading-6 text-ink-700">
                {paragraph}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Screen>
  );
}
