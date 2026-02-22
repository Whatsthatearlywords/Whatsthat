import React from 'react';
import {
  StyleSheet, Text, View, Pressable, Platform, useWindowDimensions, Alert, Linking,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, withSequence, Easing } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { categoriesSeed } from '@/lib/categories-seed';
import { useApp } from '@/lib/app-context';
import { ParentLockModal } from '@/components/ParentLockModal';
import { useTranslation } from '@/lib/i18n';

const previewImages = [
  require('../assets/images/items/s5.png'),
  require('../assets/images/items/a1.png'),
  require('../assets/images/items/f1.png'),
  require('../assets/images/items/v1.png'),
];

function FloatingImage({ source, size, style, delay }: { source: any; size: number; style: any; delay: number }) {
  const floatY = useSharedValue(0);

  React.useEffect(() => {
    floatY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
          withTiming(6, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <Animated.View style={[{ position: 'absolute', width: size, height: size }, style, animStyle]}>
      <Image source={source} style={{ width: size, height: size }} contentFit="contain" />
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { settings } = useApp();
  const { t } = useTranslation(settings.language);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const [showParentLock, setShowParentLock] = React.useState(false);
  const [lockDestination, setLockDestination] = React.useState<'settings' | 'upgrade'>('upgrade');

  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;
  const topPad = insets.top || webTopInset;
  const bottomPad = insets.bottom || webBottomInset;

  const isCompact = SCREEN_HEIGHT < 500;
  const imgSize = isCompact ? 44 : 68;

  const categoryCount = categoriesSeed.length;
  const totalWords = categoriesSeed.reduce((acc, cat) =>
    acc + cat.pages.reduce((pa, p) => pa + p.items.length, 0), 0
  );

  const handleUpgradePress = () => {
    setLockDestination('upgrade');
    setShowParentLock(true);
  };

  const handleSettingsPress = () => {
    setLockDestination('settings');
    setShowParentLock(true);
  };

  const handleRateApp = () => {
    const iosUrl = 'https://apps.apple.com/app/id0000000000';
    const androidUrl = 'https://play.google.com/store/apps/details?id=com.whatsthat.earlywords';

    if (Platform.OS === 'ios') {
      Linking.openURL(iosUrl).catch(() => {
        Alert.alert('Rate What\'s That?', 'Thank you! You can rate us once the app is live on the App Store.');
      });
    } else if (Platform.OS === 'android') {
      Linking.openURL(androidUrl).catch(() => {
        Alert.alert('Rate What\'s That?', 'Thank you! You can rate us once the app is live on Google Play.');
      });
    } else {
      Alert.alert('Rate What\'s That?', 'Thank you for your support! You can rate us on the App Store or Google Play once the app is published.');
    }
  };

  const handleParentSuccess = () => {
    setShowParentLock(false);
    if (lockDestination === 'settings') {
      router.push('/settings');
    } else {
      router.push('/upgrade');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
      <Pressable
        style={({ pressed }) => [styles.settingsButton, { top: topPad + 6, right: isCompact ? 10 : 18 }, pressed && { opacity: 0.6 }]}
        onPress={handleSettingsPress}
        testID="settings-button"
      >
        <MaterialCommunityIcons name="cog" size={isCompact ? 22 : 28} color={Colors.textLight} />
      </Pressable>

      <FloatingImage source={previewImages[0]} size={imgSize} style={{ top: '6%', left: '3%' }} delay={0} />
      <FloatingImage source={previewImages[1]} size={imgSize} style={{ top: '4%', left: '38%' }} delay={300} />
      <FloatingImage source={previewImages[2]} size={imgSize * 0.8} style={{ bottom: '10%', left: '6%' }} delay={150} />
      <FloatingImage source={previewImages[3]} size={imgSize * 0.8} style={{ bottom: '8%', left: '35%' }} delay={450} />

      <View style={[styles.content, { gap: isCompact ? 10 : 20, paddingHorizontal: isCompact ? 10 : 24 }]}>
        <View style={styles.leftPanel}>
          <View style={styles.leftInner}>
            <Text style={[styles.title, { fontSize: isCompact ? 26 : 40 }]}>{t('ui.appTitle')}</Text>
            <Text style={[styles.subtitle, { fontSize: isCompact ? 13 : 17 }]}>{t('ui.appSubtitle')}</Text>

            <View style={[styles.statsRow, { marginTop: isCompact ? 8 : 14, gap: isCompact ? 8 : 14 }]}>
              <View style={[styles.statBubble, { paddingHorizontal: isCompact ? 10 : 16, paddingVertical: isCompact ? 5 : 8 }]}>
                <Text style={[styles.statNumber, { fontSize: isCompact ? 16 : 22 }]}>{categoryCount}</Text>
                <Text style={[styles.statLabel, { fontSize: isCompact ? 9 : 11 }]}>{t('ui.categories')}</Text>
              </View>
              <View style={[styles.statBubble, { paddingHorizontal: isCompact ? 10 : 16, paddingVertical: isCompact ? 5 : 8 }]}>
                <Text style={[styles.statNumber, { fontSize: isCompact ? 16 : 22 }]}>{totalWords}</Text>
                <Text style={[styles.statLabel, { fontSize: isCompact ? 9 : 11 }]}>{t('ui.words')}</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.playButton, pressed && styles.playButtonPressed]}
              onPress={() => router.push('/learn')}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryLight]}
                style={[styles.playGradient, {
                  paddingVertical: isCompact ? 12 : 18,
                  paddingHorizontal: isCompact ? 28 : 44,
                  borderRadius: isCompact ? 22 : 30,
                }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="play" size={isCompact ? 24 : 32} color={Colors.white} />
                <Text style={[styles.playText, { fontSize: isCompact ? 18 : 24 }]}>{t('ui.letsLearn')}</Text>
              </LinearGradient>
            </Pressable>

            <View style={[styles.scienceNote, { marginTop: isCompact ? 8 : 14, paddingHorizontal: isCompact ? 10 : 14, paddingVertical: isCompact ? 6 : 10 }]}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={isCompact ? 14 : 18} color={Colors.accent} />
              <Text style={[styles.scienceText, { fontSize: isCompact ? 9 : 11 }]}>
                {t('ui.scienceNote')}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.rateButton, pressed && { opacity: 0.7 }]}
              onPress={handleRateApp}
            >
              <MaterialCommunityIcons name="star" size={isCompact ? 14 : 18} color={Colors.accent} />
              <Text style={[styles.rateText, { fontSize: isCompact ? 10 : 12 }]}>{t('ui.rateUs')}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.rightPanel}>
          {!settings.premiumUnlocked ? (
            <View style={[styles.upgradeCard, { borderRadius: isCompact ? 16 : 24, padding: isCompact ? 12 : 20 }]}>
              <LinearGradient
                colors={['#FFF0E0', '#FFF8F0']}
                style={[StyleSheet.absoluteFillObject, { borderRadius: isCompact ? 16 : 24 }]}
              />
              <View style={[styles.premiumBadge, { paddingHorizontal: isCompact ? 8 : 12, paddingVertical: isCompact ? 3 : 5 }]}>
                <MaterialCommunityIcons name="crown" size={isCompact ? 12 : 16} color={Colors.accent} />
                <Text style={[styles.premiumBadgeText, { fontSize: isCompact ? 10 : 12 }]}>{t('ui.premium')}</Text>
              </View>

              <Text style={[styles.upgradeTitle, { fontSize: isCompact ? 15 : 20, marginTop: isCompact ? 6 : 10 }]}>
                {t('ui.unlockFullExperience')}
              </Text>

              <View style={[styles.featureList, { gap: isCompact ? 6 : 10, marginTop: isCompact ? 8 : 14 }]}>
                <View style={styles.featureRow}>
                  <View style={[styles.featureIcon, { width: isCompact ? 28 : 36, height: isCompact ? 28 : 36, borderRadius: isCompact ? 8 : 10 }]}>
                    <MaterialCommunityIcons name="image-plus" size={isCompact ? 14 : 18} color={Colors.secondary} />
                  </View>
                  <View style={styles.featureTextWrap}>
                    <Text style={[styles.featureTitle, { fontSize: isCompact ? 12 : 14 }]}>{t('ui.yourOwnImages')}</Text>
                    <Text style={[styles.featureDesc, { fontSize: isCompact ? 9 : 11 }]}>{t('ui.yourOwnImagesDesc')}</Text>
                  </View>
                </View>

                <View style={styles.featureRow}>
                  <View style={[styles.featureIcon, { width: isCompact ? 28 : 36, height: isCompact ? 28 : 36, borderRadius: isCompact ? 8 : 10, backgroundColor: Colors.primaryLight + '20' }]}>
                    <MaterialCommunityIcons name="microphone" size={isCompact ? 14 : 18} color={Colors.primary} />
                  </View>
                  <View style={styles.featureTextWrap}>
                    <Text style={[styles.featureTitle, { fontSize: isCompact ? 12 : 14 }]}>{t('ui.recordYourVoice')}</Text>
                    <Text style={[styles.featureDesc, { fontSize: isCompact ? 9 : 11 }]}>{t('ui.recordYourVoiceDesc')}</Text>
                  </View>
                </View>

                <View style={styles.featureRow}>
                  <View style={[styles.featureIcon, { width: isCompact ? 28 : 36, height: isCompact ? 28 : 36, borderRadius: isCompact ? 8 : 10, backgroundColor: Colors.purpleLight + '30' }]}>
                    <MaterialCommunityIcons name="folder-star" size={isCompact ? 14 : 18} color={Colors.purple} />
                  </View>
                  <View style={styles.featureTextWrap}>
                    <Text style={[styles.featureTitle, { fontSize: isCompact ? 12 : 14 }]}>{t('ui.unlimitedCategories')}</Text>
                    <Text style={[styles.featureDesc, { fontSize: isCompact ? 9 : 11 }]}>{t('ui.unlimitedCategoriesDesc')}</Text>
                  </View>
                </View>

                <View style={styles.featureRow}>
                  <View style={[styles.featureIcon, { width: isCompact ? 28 : 36, height: isCompact ? 28 : 36, borderRadius: isCompact ? 8 : 10, backgroundColor: Colors.blueLight + '30' }]}>
                    <MaterialCommunityIcons name="lock-open-variant" size={isCompact ? 14 : 18} color={Colors.blue} />
                  </View>
                  <View style={styles.featureTextWrap}>
                    <Text style={[styles.featureTitle, { fontSize: isCompact ? 12 : 14 }]}>{t('ui.allWordPages')}</Text>
                    <Text style={[styles.featureDesc, { fontSize: isCompact ? 9 : 11 }]}>{t('ui.allWordPagesDesc')}</Text>
                  </View>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [styles.upgradeButton, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
                onPress={handleUpgradePress}
              >
                <LinearGradient
                  colors={[Colors.accent, Colors.accentDark]}
                  style={[styles.upgradeGradient, {
                    paddingVertical: isCompact ? 10 : 14,
                    borderRadius: isCompact ? 14 : 18,
                  }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <MaterialCommunityIcons name="crown" size={isCompact ? 16 : 20} color={Colors.text} />
                  <Text style={[styles.upgradeButtonText, { fontSize: isCompact ? 13 : 16 }]}>{t('ui.upgradeToPremium')}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          ) : (
            <View style={[styles.upgradeCard, { borderRadius: isCompact ? 16 : 24, padding: isCompact ? 12 : 20 }]}>
              <LinearGradient
                colors={['#E8FFF5', '#F0FFF8']}
                style={[StyleSheet.absoluteFillObject, { borderRadius: isCompact ? 16 : 24 }]}
              />
              <MaterialCommunityIcons name="crown" size={isCompact ? 28 : 40} color={Colors.accent} />
              <Text style={[styles.upgradeTitle, { fontSize: isCompact ? 16 : 22, marginTop: isCompact ? 6 : 10 }]}>
                {t('ui.premiumActive')}
              </Text>
              <Text style={[styles.featureDesc, { fontSize: isCompact ? 11 : 13, textAlign: 'center' as const, marginTop: 4 }]}>
                {t('ui.premiumActiveDesc')}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.categoryPreview, { gap: isCompact ? 5 : 8, paddingBottom: isCompact ? 4 : 8 }]}>
        {categoriesSeed.map(cat => (
          <View
            key={cat.id}
            style={[styles.catDot, {
              backgroundColor: cat.color + '30',
              width: isCompact ? 24 : 32,
              height: isCompact ? 24 : 32,
              borderRadius: isCompact ? 12 : 16,
            }]}
          >
            <MaterialCommunityIcons
              name={cat.icon as any}
              size={isCompact ? 12 : 16}
              color={cat.color}
            />
          </View>
        ))}
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
  settingsButton: {
    position: 'absolute',
    zIndex: 50,
    padding: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  leftInner: {
    alignItems: 'center',
  },
  rightPanel: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    color: Colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textLight,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBubble: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statNumber: {
    fontFamily: 'Nunito_800ExtraBold',
    color: Colors.text,
  },
  statLabel: {
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textMuted,
    marginTop: -2,
  },
  playButton: {
    marginTop: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  playButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  playGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playText: {
    fontFamily: 'Nunito_800ExtraBold',
    color: Colors.white,
  },
  scienceNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 12,
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  scienceText: {
    fontFamily: 'Nunito_400Regular',
    color: Colors.textLight,
    flex: 1,
    lineHeight: 15,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: Colors.accent + '18',
    borderRadius: 20,
  },
  rateText: {
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.accentDark,
  },
  upgradeCard: {
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accent + '30',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  premiumBadgeText: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.accentDark,
  },
  upgradeTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    color: Colors.text,
    alignSelf: 'flex-start',
  },
  featureList: {
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureIcon: {
    backgroundColor: Colors.secondaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
  },
  featureDesc: {
    fontFamily: 'Nunito_400Regular',
    color: Colors.textLight,
    marginTop: -1,
  },
  upgradeButton: {
    width: '100%',
    marginTop: 12,
    shadowColor: Colors.accentDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  upgradeButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
  },
  categoryPreview: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  catDot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
