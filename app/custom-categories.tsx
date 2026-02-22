import React from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/app-context';
import { useTranslation } from '@/lib/i18n';

export default function CustomCategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { customCategories, removeCustomCategory, settings } = useApp();
  const { t } = useTranslation(settings.language);

  const webTopInset = Platform.OS === 'web' ? 40 : 0;
  const webBottomInset = Platform.OS === 'web' ? 20 : 0;

  const handleDelete = (id: string, name: string) => {
    Alert.alert(t('ui.deleteCategory'), `Are you sure you want to delete "${name}"?`, [
      { text: t('ui.cancel'), style: 'cancel' },
      {
        text: t('ui.delete'),
        style: 'destructive',
        onPress: () => {
          if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          removeCustomCategory(id);
        },
      },
    ]);
  };

  const canAddMore = settings.premiumUnlocked || customCategories.length < 3;

  return (
    <View style={[styles.container, { paddingTop: insets.top || webTopInset }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('ui.myCategories')}</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => {
            if (!canAddMore) {
              router.push('/upgrade');
            } else {
              router.push('/add-custom');
            }
          }}
        >
          <MaterialCommunityIcons name="plus" size={24} color={Colors.secondary} />
        </Pressable>
      </View>

      {!settings.premiumUnlocked && (
        <View style={styles.limitBanner}>
          <MaterialCommunityIcons name="information" size={18} color={Colors.blue} />
          <Text style={styles.limitText}>
            Free plan: {customCategories.length}/3 categories used
          </Text>
        </View>
      )}

      <FlatList
        data={customCategories}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: (insets.bottom || webBottomInset) + 16 },
          customCategories.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryIcon}>
                <MaterialCommunityIcons name="folder-heart" size={28} color={Colors.pink} />
              </View>
              <View style={styles.categoryActions}>
                <Pressable
                  style={styles.viewButton}
                  onPress={() => router.push({ pathname: '/custom-category/[id]', params: { id: item.id } })}
                >
                  <MaterialCommunityIcons name="eye" size={18} color={Colors.secondary} />
                </Pressable>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id, item.name)}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={18} color={Colors.error} />
                </Pressable>
              </View>
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryCount}>{item.items.length} {t('ui.items')}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="folder-plus" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>{t('ui.noCustomCategories')}</Text>
            <Text style={styles.emptySubtitle}>
              {t('ui.createFirst')}
            </Text>
            <Pressable
              style={styles.createButton}
              onPress={() => router.push('/add-custom')}
            >
              <MaterialCommunityIcons name="plus" size={18} color={Colors.white} />
              <Text style={styles.createButtonText}>{t('ui.addNew')}</Text>
            </Pressable>
          </View>
        }
      />
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
  addButton: {
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
  limitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.blueLight + '40',
    borderRadius: 12,
    marginBottom: 8,
  },
  limitText: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textLight,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.pink + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textLight,
    marginTop: 2,
  },
  viewButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 16,
  },
  createButtonText: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    color: Colors.white,
  },
});
