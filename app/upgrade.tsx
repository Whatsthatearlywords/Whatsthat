import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Platform, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/app-context';
import { usePurchases } from '@/lib/purchases';
import { useTranslation } from '@/lib/i18n';

const features = {
  free: [
    { text: 'Page 1 of every category', included: true },
    { text: 'Up to 3 custom items', included: true },
    { text: 'Text-to-speech audio', included: true },
    { text: 'All pages unlocked', included: false },
    { text: 'Unlimited custom categories', included: false },
  ],
  premium: [
    { text: 'Page 1 of every category', included: true },
    { text: 'All pages unlocked', included: true },
    { text: 'Text-to-speech audio', included: true },
    { text: 'Unlimited custom categories', included: true },
    { text: 'All future content', included: true },
  ],
};

export default function UpgradeScreen() {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings } = useApp();
  const { packages, purchasePackage, restorePurchases, isPremium } = usePurchases();
  const { t } = useTranslation(settings.language);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const webTopInset = Platform.OS === 'web' ? 40 : 0;

  const hasRealProducts = packages.length > 0;

  const handlePurchase = async () => {
    if (hasRealProducts) {
      setIsPurchasing(true);
      try {
        const pkg = packages[0];
        const success = await purchasePackage(pkg);
        if (success) {
          try {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          } catch {}
          setJustUnlocked(true);
          updateSettings({ premiumUnlocked: true });
        }
      } catch (e) {
        Alert.alert('Purchase Error', 'Something went wrong. Please try again.');
      } finally {
        setIsPurchasing(false);
      }
    } else {
      try {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch {}
      setJustUnlocked(true);
      updateSettings({ premiumUnlocked: true });
    }
  };

  const handleRestore = async () => {
    if (hasRealProducts) {
      setIsRestoring(true);
      try {
        const success = await restorePurchases();
        if (success) {
          try {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          } catch {}
          setJustUnlocked(true);
          updateSettings({ premiumUnlocked: true });
        } else {
          Alert.alert('No Purchases Found', 'We could not find any previous purchases to restore.');
        }
      } catch (e) {
        Alert.alert('Restore Error', 'Something went wrong. Please try again.');
      } finally {
        setIsRestoring(false);
      }
    } else {
      Alert.alert(t('ui.restorePurchases'), 'In a production app, this would restore your purchases from the App Store or Google Play.');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleDeactivate = () => {
    updateSettings({ premiumUnlocked: false });
    setJustUnlocked(false);
  };

  const showActive = settings.premiumUnlocked || justUnlocked || isPremium;

  const priceText = hasRealProducts
    ? packages[0].product.priceString
    : 'One-time';

  if (showActive) {
    return (
      <View style={[styles.container, { paddingTop: insets.top || webTopInset }]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>{t('ui.premium')}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.activeContainer}>
          <View style={styles.successCircle}>
            <MaterialCommunityIcons name="crown" size={48} color={Colors.accent} />
          </View>
          <Text style={styles.activeTitle}>
            {justUnlocked ? 'All Unlocked!' : t('ui.premiumActive')}
          </Text>
          <Text style={styles.activeSubtitle}>
            {justUnlocked
              ? 'Your child now has access to every word and category. Enjoy learning!'
              : 'You have access to all content'}
          </Text>
          {justUnlocked && (
            <Pressable
              style={({ pressed }) => [styles.doneButton, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
              onPress={handleGoBack}
            >
              <LinearGradient
                colors={[Colors.secondary, Colors.secondaryLight]}
                style={styles.doneGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons name="check" size={22} color={Colors.white} />
                <Text style={styles.doneText}>Start Exploring</Text>
              </LinearGradient>
            </Pressable>
          )}
          {!hasRealProducts && (
            <Pressable style={styles.deactivateButton} onPress={handleDeactivate}>
              <Text style={styles.deactivateText}>Deactivate (Demo)</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top || webTopInset }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('ui.upgrade')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.landscapeContent}>
        <View style={styles.heroSide}>
          <MaterialCommunityIcons name="star-circle" size={48} color={Colors.accent} />
          <Text style={styles.heroTitle}>{t('ui.unlockPremium')}</Text>
          <Text style={styles.heroSubtitle}>
            {t('ui.unlockPremiumDesc')}
          </Text>
          <Pressable
            style={({ pressed }) => [styles.unlockButton, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
            onPress={handlePurchase}
            disabled={isPurchasing}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              style={styles.unlockGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isPurchasing ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="lock-open" size={20} color={Colors.white} />
                  <Text style={styles.unlockText}>
                    {hasRealProducts ? `${t('ui.upgrade')} - ${priceText}` : t('ui.upgrade')}
                  </Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
          <Pressable
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={isRestoring}
          >
            {isRestoring ? (
              <ActivityIndicator color={Colors.textMuted} size="small" />
            ) : (
              <Text style={styles.restoreText}>{t('ui.restorePurchases')}</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.plansSide}>
          <View style={styles.planCard}>
            <Text style={styles.planName}>{t('ui.free')}</Text>
            <Text style={styles.planPrice}>$0</Text>
            <View style={styles.planFeatures}>
              {features.free.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <MaterialCommunityIcons
                    name={f.included ? 'check-circle' : 'close-circle'}
                    size={15}
                    color={f.included ? Colors.success : Colors.textMuted}
                  />
                  <Text style={[styles.featureText, !f.included && styles.featureDisabled]}>
                    {f.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.planCard, styles.premiumCard]}>
            <View style={styles.popularBadge}>
              <MaterialCommunityIcons name="crown" size={10} color={Colors.white} />
              <Text style={styles.popularText}>Best Value</Text>
            </View>
            <Text style={[styles.planName, { color: Colors.primary }]}>{t('ui.premium')}</Text>
            <Text style={styles.planPrice}>{priceText}</Text>
            <View style={styles.planFeatures}>
              {features.premium.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <MaterialCommunityIcons name="check-circle" size={15} color={Colors.success} />
                  <Text style={styles.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
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
  landscapeContent: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 20,
  },
  heroSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_800ExtraBold',
    color: Colors.text,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  unlockButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    width: '100%',
    maxWidth: 280,
    marginTop: 8,
  },
  unlockGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  unlockText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: Colors.white,
  },
  restoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  restoreText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
  plansSide: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  planCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  premiumCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 9,
    fontFamily: 'Nunito_700Bold',
    color: Colors.white,
  },
  planName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
    marginBottom: 2,
  },
  planPrice: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textLight,
    marginBottom: 10,
  },
  planFeatures: {
    gap: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    color: Colors.text,
    flex: 1,
  },
  featureDisabled: {
    color: Colors.textMuted,
  },
  activeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
    marginTop: 16,
  },
  activeSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textLight,
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
  },
  doneButton: {
    marginTop: 20,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  doneGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 36,
  },
  doneText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: Colors.white,
  },
  deactivateButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  deactivateText: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textMuted,
  },
});
