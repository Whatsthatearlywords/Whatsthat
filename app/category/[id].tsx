import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, Pressable,
  Platform, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { categoriesSeed } from '@/lib/categories-seed';
import { useApp } from '@/lib/app-context';
import { ItemCard } from '@/components/ItemCard';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Page } from '@/lib/types';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { settings } = useApp();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const webTopInset = Platform.OS === 'web' ? 40 : 0;
  const webBottomInset = Platform.OS === 'web' ? 20 : 0;

  const category = categoriesSeed.find(c => c.id === id);
  if (!category) return null;

  const isCompact = SCREEN_HEIGHT < 500;
  const isVeryCompact = SCREEN_HEIGHT < 400;

  interface FlatPage {
    pageIndex: number;
    items: Page['items'];
    isLocked: boolean;
  }

  const pages: FlatPage[] = category.pages.map((page, pi) => ({
    pageIndex: pi,
    items: page.items,
    isLocked: pi > 0 && !settings.premiumUnlocked,
  }));

  const topPad = insets.top || webTopInset;
  const bottomPad = insets.bottom || webBottomInset;
  const headerHeight = isVeryCompact ? 28 : isCompact ? 32 : 44;
  const navHeight = isVeryCompact ? 24 : isCompact ? 28 : 36;
  const contentHeight = SCREEN_HEIGHT - topPad - bottomPad - headerHeight - navHeight;

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / SCREEN_WIDTH);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < pages.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, SCREEN_WIDTH, pages.length]);

  const renderPage = ({ item }: { item: FlatPage }) => {
    if (item.isLocked) {
      return (
        <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
          <View style={styles.lockedOverlay}>
            <MaterialCommunityIcons name="lock" size={isCompact ? 40 : 64} color={Colors.lock} />
            <Text style={[styles.lockedText, { fontSize: isCompact ? 18 : 24 }]}>Unlock Premium</Text>
            <Pressable style={styles.unlockBtn} onPress={() => setShowUpgrade(true)}>
              <Text style={[styles.unlockBtnText, { fontSize: isCompact ? 14 : 18 }]}>Upgrade</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
        <View style={[styles.grid, { height: contentHeight }]}>
          {item.items.map((itm) => (
            <View key={itm.id} style={[styles.itemWrap, { padding: isCompact ? 2 : 4 }]}>
              <ItemCard item={itm} soundEnabled={settings.soundEnabled} voiceStyle={settings.voiceStyle} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const badgeIconSize = isCompact ? 16 : 22;
  const badgeFontSize = isCompact ? 13 : 18;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={[styles.header, { height: headerHeight }]}>
        <Pressable style={[styles.backButton, {
          width: isCompact ? 28 : 36,
          height: isCompact ? 28 : 36,
          borderRadius: isCompact ? 14 : 18,
        }]} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={isCompact ? 22 : 28} color={Colors.text} />
        </Pressable>
        <View style={[styles.categoryBadge, {
          backgroundColor: category.color + '20',
          paddingHorizontal: isCompact ? 8 : 14,
          paddingVertical: isCompact ? 3 : 6,
          borderRadius: isCompact ? 10 : 14,
        }]}>
          <MaterialCommunityIcons name={category.icon as any} size={badgeIconSize} color={category.color} />
          <Text style={[styles.categoryName, { color: category.color, fontSize: badgeFontSize }]}>
            {category.name}
          </Text>
        </View>
        <View style={[styles.pageInfo, { marginLeft: 'auto' }]}>
          <Text style={[styles.pageText, { fontSize: isCompact ? 10 : 13 }]}>
            {currentIndex + 1}/{pages.length}
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={pages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderPage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        bounces={false}
      />

      <View style={[styles.navigation, { paddingBottom: bottomPad + 1, height: navHeight }]}>
        {pages.map((p, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex && styles.dotActive,
              i === currentIndex && { backgroundColor: category.color },
              p.isLocked && styles.dotLocked,
            ]}
          />
        ))}
      </View>

      <UpgradeModal
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={() => {
          setShowUpgrade(false);
          router.push('/upgrade');
        }}
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
    paddingHorizontal: 10,
    gap: 6,
  },
  backButton: {
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
    gap: 4,
  },
  categoryName: {
    fontFamily: 'Nunito_700Bold',
  },
  pageInfo: {
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pageText: {
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textLight,
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
  },
  itemWrap: {
    width: '33.33%',
    height: '50%',
  },
  lockedOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  lockedText: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.lock,
  },
  unlockBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 8,
  },
  unlockBtnText: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.white,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 2,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  dotActive: {
    width: 20,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  dotLocked: {
    backgroundColor: Colors.lock + '60',
  },
});
