import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/app-context';
import { ItemCard } from '@/components/ItemCard';

export default function CustomCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { customCategories, settings } = useApp();
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

  const webTopInset = Platform.OS === 'web' ? 40 : 0;
  const webBottomInset = Platform.OS === 'web' ? 20 : 0;

  const category = customCategories.find(c => c.id === id);
  if (!category) {
    return (
      <View style={[styles.container, { paddingTop: insets.top || webTopInset }]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.text} />
          </Pressable>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Category not found</Text>
        </View>
      </View>
    );
  }

  const topPad = insets.top || webTopInset;
  const bottomPad = insets.bottom || webBottomInset;
  const contentHeight = SCREEN_HEIGHT - topPad - bottomPad - 50;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.text} />
        </Pressable>
        <View style={[styles.categoryBadge, { backgroundColor: Colors.pink + '18' }]}>
          <MaterialCommunityIcons name="folder-heart" size={22} color={Colors.pink} />
          <Text style={[styles.categoryName, { color: Colors.pink }]}>{category.name}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {category.items.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="image-plus" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No items yet</Text>
        </View>
      ) : (
        <View style={[styles.grid, { height: contentHeight }]}>
          {category.items.map(item => (
            <View key={item.id} style={styles.itemWrap}>
              <ItemCard item={item} soundEnabled={settings.soundEnabled} voiceStyle={settings.voiceStyle} />
            </View>
          ))}
        </View>
      )}
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 10,
  },
  itemWrap: {
    width: '33.33%',
    height: '50%',
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textMuted,
    marginTop: 12,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textMuted,
  },
});
