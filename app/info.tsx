import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/app-context';
import { useTranslation } from '@/lib/i18n';

const sections = [
  {
    icon: 'brain' as const,
    color: '#A29BFE',
    title: 'Why What\'s That!? Works',
    body: 'Your child\'s brain is building connections at an incredible rate during the first three years. Every word they hear and every image they see helps strengthen those connections.',
  },
  {
    icon: 'chart-line' as const,
    color: '#FF6B6B',
    title: 'More Words = Faster Growth',
    body: 'Children exposed to more words develop stronger language skills. Repeated exposure to a growing vocabulary helps — right when it matters most.',
    citation: 'Hart & Risley (1995). Meaningful Differences in the Everyday Experience of Young American Children.',
  },
  {
    icon: 'image-text' as const,
    color: '#4ECDC4',
    title: 'Word + Image = Faster Learning',
    body: 'Toddlers process and learn new words more quickly when they see a clear image paired with a spoken label.',
    citation: 'Weisleder & Fernald (2013). Talking to Children Matters. Psychological Science.',
  },
  {
    icon: 'book-open-variant' as const,
    color: '#FFE66D',
    title: 'Variety = Stronger Vocabulary',
    body: 'Exposure to a wide range of vocabulary leads to stronger language development. With eight categories, we introduce rich, varied language naturally.',
    citation: 'Rowe (2012). Role of Quantity and Quality of Child-Directed Speech. Child Development.',
  },
];

export default function InfoScreen() {
  const insets = useSafeAreaInsets();
  const { settings } = useApp();
  const { t } = useTranslation(settings.language);
  const webTopInset = Platform.OS === 'web' ? 40 : 0;
  const webBottomInset = Platform.OS === 'web' ? 20 : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top || webTopInset }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('ui.theScience')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: (insets.bottom || webBottomInset) + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.landscapeGrid}>
          {sections.map((section, index) => (
            <View key={index} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: section.color + '18' }]}>
                  <MaterialCommunityIcons name={section.icon} size={22} color={section.color} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Text style={styles.sectionBody}>{section.body}</Text>
              {section.citation && (
                <View style={styles.citationBox}>
                  <MaterialCommunityIcons name="format-quote-open" size={12} color={Colors.textMuted} />
                  <Text style={styles.citationText}>{section.citation}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <MaterialCommunityIcons name="heart" size={16} color={Colors.primary} />
          <Text style={styles.footerText}>Built with love for curious little minds</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  landscapeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
    flex: 1,
  },
  sectionBody: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textLight,
    lineHeight: 18,
  },
  citationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  citationText: {
    fontSize: 10,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textMuted,
    flex: 1,
    lineHeight: 14,
    fontStyle: 'italic' as const,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textMuted,
  },
});
