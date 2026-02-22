import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, Pressable,
  Platform, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { categoriesSeed } from '@/lib/categories-seed';
import { useApp } from '@/lib/app-context';
import { ItemCard } from '@/components/ItemCard';
import { ParentLockModal } from '@/components/ParentLockModal';
import { Page } from '@/lib/types';
import { useTranslation, getLanguageStrings, getCategoryName, getItemLabel } from '@/lib/i18n';

type SlideType = 'items' | 'unlock';

interface Slide {
  key: string;
  type: SlideType;
  categoryId?: string;
  categoryName?: string;
  categoryColor?: string;
  categoryIcon?: string;
  pageIndex?: number;
  totalPages?: number;
  items?: Page['items'];
  isCustomCategory?: boolean;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { settings, customCategories } = useApp();
  const { t, strings } = useTranslation(settings.language);
  const voiceStrings = useMemo(() => getLanguageStrings(settings.voiceLanguage), [settings.voiceLanguage]);
  const [showParentLock, setShowParentLock] = useState(false);
  const [unlockDestination, setUnlockDestination] = useState<'settings' | 'upgrade'>('settings');
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const webTopInset = Platform.OS === 'web' ? 40 : 0;
  const webBottomInset = Platform.OS === 'web' ? 20 : 0;
  const topPad = insets.top || webTopInset;
  const bottomPad = insets.bottom || webBottomInset;

  const isCompact = SCREEN_HEIGHT < 500;
  const isVeryCompact = SCREEN_HEIGHT < 400;

  const headerHeight = isVeryCompact ? 28 : isCompact ? 32 : 44;
  const navHeight = isVeryCompact ? 24 : isCompact ? 28 : 36;
  const contentHeight = SCREEN_HEIGHT - topPad - bottomPad - headerHeight - navHeight;

  const badgeIconSize = isCompact ? 16 : 22;
  const badgeFontSize = isCompact ? 13 : 18;
  const dotSize = isCompact ? 20 : 24;
  const dotActiveSize = isCompact ? 26 : 32;
  const dotIconSize = isCompact ? 10 : 12;

  const slides = useMemo(() => {
    const result: Slide[] = [];
    const disabledSet = new Set(settings.disabledCategories);

    categoriesSeed.forEach(cat => {
      if (disabledSet.has(cat.id)) return;
      cat.pages.forEach((page, pi) => {
        const isLocked = pi > 0 && !settings.premiumUnlocked;
        if (!isLocked) {
          result.push({
            key: `${cat.id}-${pi}`,
            type: 'items',
            categoryId: cat.id,
            categoryName: cat.name,
            categoryColor: cat.color,
            categoryIcon: cat.icon,
            pageIndex: pi,
            totalPages: cat.pages.length,
            items: page.items,
            isCustomCategory: false,
          });
        }
      });
    });

    if (settings.premiumUnlocked) {
      customCategories.forEach(cc => {
        if (disabledSet.has(cc.id)) return;
        const pages: Page['items'][] = [];
        for (let i = 0; i < cc.items.length; i += 6) {
          pages.push(cc.items.slice(i, i + 6));
        }
        if (pages.length === 0) return;
        pages.forEach((pageItems, pi) => {
          result.push({
            key: `custom-${cc.id}-${pi}`,
            type: 'items',
            categoryId: cc.id,
            categoryName: cc.name,
            categoryColor: '#FF69B4',
            categoryIcon: 'folder-heart',
            pageIndex: pi,
            totalPages: pages.length,
            items: pageItems,
            isCustomCategory: true,
          });
        });
      });
    }

    if (!settings.premiumUnlocked) {
      result.push({
        key: 'unlock-slide',
        type: 'unlock',
      });
    }

    return result;
  }, [settings.premiumUnlocked, settings.disabledCategories, customCategories]);

  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length]);

  const currentSlide = slides[currentIndex] || slides[0];

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / SCREEN_WIDTH);
    if (newIndex >= 0 && newIndex < slides.length && newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, SCREEN_WIDTH, slides.length]);

  const handleParentSuccess = () => {
    setShowParentLock(false);
    if (unlockDestination === 'upgrade') {
      router.push('/upgrade');
    } else {
      router.push('/settings');
    }
  };

  const handleUnlockPress = () => {
    setUnlockDestination('upgrade');
    setShowParentLock(true);
  };

  const lockedCategories = categoriesSeed.filter(c =>
    c.pages.length > 1 && !settings.premiumUnlocked
  );

  const renderSlide = ({ item }: { item: Slide }) => {
    if (item.type === 'unlock') {
      const lockIconSize = isCompact ? 32 : 48;
      const titleSize = isCompact ? 20 : 28;
      const subtitleSize = isCompact ? 12 : 15;
      const catIconSize = isCompact ? 20 : 28;
      const catBoxSize = isCompact ? 36 : 48;

      return (
        <View style={[styles.slideContainer, { width: SCREEN_WIDTH }]}>
          <View style={[styles.unlockSlide, { gap: isCompact ? 6 : 10 }]}>
            <View style={[styles.unlockIconRow, { gap: isCompact ? 4 : 8 }]}>
              {lockedCategories.slice(0, 6).map(cat => (
                <View
                  key={cat.id}
                  style={[styles.lockedCatIcon, {
                    backgroundColor: cat.color + '20',
                    width: catBoxSize,
                    height: catBoxSize,
                    borderRadius: isCompact ? 10 : 14,
                  }]}
                >
                  <MaterialCommunityIcons name={cat.icon as any} size={catIconSize} color={cat.color + '80'} />
                </View>
              ))}
            </View>
            <MaterialCommunityIcons name="lock" size={lockIconSize} color={Colors.lock} />
            <Text style={[styles.unlockTitle, { fontSize: titleSize }]}>Unlock more words!</Text>
            <Text style={[styles.unlockSubtitle, { fontSize: subtitleSize }]}>
              {lockedCategories.length} categories have extra pages with more words to discover
            </Text>
            <Pressable style={styles.unlockButton} onPress={handleUnlockPress}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryLight]}
                style={[styles.unlockGradient, {
                  paddingVertical: isCompact ? 10 : 16,
                  paddingHorizontal: isCompact ? 20 : 32,
                }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons name="lock-open" size={isCompact ? 16 : 20} color={Colors.white} />
                <Text style={[styles.unlockButtonText, { fontSize: isCompact ? 14 : 17 }]}>
                  Ask a grown-up to unlock
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.slideContainer, { width: SCREEN_WIDTH }]}>
        <View style={[styles.grid, { height: contentHeight }]}>
          {item.items?.map((itm) => (
            <View key={itm.id} style={[styles.itemWrap, { padding: isCompact ? 2 : 4 }]}>
              <ItemCard item={itm} soundEnabled={settings.soundEnabled} voiceStyle={settings.voiceStyle} languageCode={settings.language} voiceLanguage={settings.voiceLanguage} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const categoryDots = useMemo(() => {
    const dots: { key: string; color: string; isUnlock: boolean; startIndex: number; icon: string }[] = [];
    let idx = 0;
    const disabledSet = new Set(settings.disabledCategories);
    
    categoriesSeed.forEach(cat => {
      if (disabledSet.has(cat.id)) return;
      const unlockedPages = settings.premiumUnlocked ? cat.pages.length : 1;
      dots.push({
        key: cat.id,
        color: cat.color,
        isUnlock: false,
        startIndex: idx,
        icon: cat.icon,
      });
      idx += unlockedPages;
    });
    
    if (settings.premiumUnlocked) {
      customCategories.forEach(cc => {
        if (disabledSet.has(cc.id)) return;
        const pageCount = Math.max(1, Math.ceil(cc.items.length / 6));
        dots.push({
          key: cc.id,
          color: '#FF69B4',
          isUnlock: false,
          startIndex: idx,
          icon: 'folder-heart',
        });
        idx += pageCount;
      });
    }
    
    if (!settings.premiumUnlocked) {
      dots.push({
        key: 'unlock',
        color: Colors.lock,
        isUnlock: true,
        startIndex: idx,
        icon: 'lock',
      });
    }
    return dots;
  }, [settings.premiumUnlocked, settings.disabledCategories, customCategories]);

  const currentCategoryKey = currentSlide?.type === 'unlock'
    ? 'unlock'
    : currentSlide?.categoryId;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={[styles.header, { height: headerHeight }]}>
        {currentSlide?.type === 'items' && (
          <View style={[styles.categoryBadge, {
            backgroundColor: (currentSlide.categoryColor || '') + '20',
            paddingHorizontal: isCompact ? 8 : 14,
            paddingVertical: isCompact ? 3 : 6,
            borderRadius: isCompact ? 10 : 14,
          }]}>
            <MaterialCommunityIcons
              name={(currentSlide.categoryIcon || 'shape') as any}
              size={badgeIconSize}
              color={currentSlide.categoryColor || Colors.primary}
            />
            <Text style={[styles.categoryName, {
              fontSize: badgeFontSize,
              color: currentSlide.categoryColor || Colors.primary,
            }]}>
              {getCategoryName(strings, currentSlide.categoryId || '', currentSlide.categoryName || '')}
            </Text>
          </View>
        )}

        {currentSlide?.type === 'items' && currentSlide.totalPages && currentSlide.totalPages > 1 && (
          <View style={styles.pageInfo}>
            <Text style={[styles.pageText, { fontSize: isCompact ? 10 : 13 }]}>
              {(currentSlide.pageIndex ?? 0) + 1}/{settings.premiumUnlocked ? currentSlide.totalPages : 1}
            </Text>
          </View>
        )}

        <View style={{ flex: 1 }} />

        <Pressable
          style={styles.parentIcon}
          onLongPress={() => { setUnlockDestination('settings'); setShowParentLock(true); }}
          delayLongPress={2000}
        >
          <MaterialCommunityIcons name="shield-lock-outline" size={isCompact ? 12 : 16} color={Colors.textMuted + '50'} />
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={item => item.key}
        renderItem={renderSlide}
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

      <View style={[styles.navigation, {
        paddingBottom: bottomPad + 1,
        height: navHeight,
        gap: isCompact ? 4 : 6,
      }]}>
        {categoryDots.map(dot => {
          const isActive = dot.key === currentCategoryKey;
          return (
            <Pressable
              key={dot.key}
              style={[
                styles.catDot,
                {
                  width: isActive ? dotActiveSize : dotSize,
                  height: isActive ? dotActiveSize : dotSize,
                  borderRadius: (isActive ? dotActiveSize : dotSize) / 2,
                  backgroundColor: isActive ? dot.color : dot.color + '40',
                },
              ]}
              onPress={() => {
                if (dot.startIndex < slides.length) {
                  flatListRef.current?.scrollToIndex({ index: dot.startIndex, animated: true });
                  setCurrentIndex(dot.startIndex);
                }
              }}
            >
              {dot.isUnlock ? (
                <MaterialCommunityIcons name="lock" size={dotIconSize} color={isActive ? Colors.white : Colors.lock} />
              ) : (
                <MaterialCommunityIcons
                  name={(dot.icon || 'shape') as any}
                  size={dotIconSize}
                  color={isActive ? Colors.white : dot.color}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      <ParentLockModal
        visible={showParentLock}
        onSuccess={handleParentSuccess}
        onCancel={() => setShowParentLock(false)}
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
  parentIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideContainer: {
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
  unlockSlide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  unlockIconRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  lockedCatIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    color: Colors.text,
    textAlign: 'center',
  },
  unlockSubtitle: {
    fontFamily: 'Nunito_400Regular',
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  unlockButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 4,
  },
  unlockGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  unlockButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.white,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 2,
  },
  catDot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
