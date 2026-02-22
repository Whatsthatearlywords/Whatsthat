import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Switch, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/app-context';
import { usePurchases } from '@/lib/purchases';
import { VoiceStyle } from '@/lib/types';
import { useTranslation, SUPPORTED_LANGUAGES, LanguageCode, getCategoryName, getLanguageStrings } from '@/lib/i18n';
import { categoriesSeed } from '@/lib/categories-seed';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, customCategories } = useApp();
  const { restorePurchases, packages } = usePurchases();
  const { t, strings } = useTranslation(settings.language);

  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showVoiceLanguagePicker, setShowVoiceLanguagePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const webTopInset = Platform.OS === 'web' ? 40 : 0;
  const webBottomInset = Platform.OS === 'web' ? 20 : 0;

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === settings.language) || SUPPORTED_LANGUAGES[0];
  const currentVoiceLang = SUPPORTED_LANGUAGES.find(l => l.code === settings.voiceLanguage) || SUPPORTED_LANGUAGES[0];

  const toggleSound = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const setVoiceStyle = (style: VoiceStyle) => {
    if (settings.kioskModeEnabled) return;
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    updateSettings({ voiceStyle: style });
  };

  const toggleKiosk = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    updateSettings({ kioskModeEnabled: !settings.kioskModeEnabled, kioskCategoryId: undefined });
  };

  const [isRestoring, setIsRestoring] = useState(false);
  const hasRealProducts = packages.length > 0;

  const handleRestorePurchases = async () => {
    if (hasRealProducts) {
      setIsRestoring(true);
      try {
        const success = await restorePurchases();
        if (success) {
          updateSettings({ premiumUnlocked: true });
          Alert.alert(t('ui.restorePurchases'), 'Your purchases have been restored successfully!');
        } else {
          Alert.alert(t('ui.restorePurchases'), 'No previous purchases found.');
        }
      } catch (e) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      } finally {
        setIsRestoring(false);
      }
    } else {
      Alert.alert(t('ui.restorePurchases'), 'In a production app, this would restore your purchases from the App Store or Google Play.');
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    const disabled = settings.disabledCategories || [];
    const isDisabled = disabled.includes(categoryId);
    const next = isDisabled
      ? disabled.filter(id => id !== categoryId)
      : [...disabled, categoryId];
    updateSettings({ disabledCategories: next });
  };

  const selectLanguage = (code: LanguageCode) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (lang && !lang.isFree && !settings.premiumUnlocked) return;
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    updateSettings({ language: code });
    setShowLanguagePicker(false);
  };

  const selectVoiceLanguage = (code: LanguageCode) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (lang && !lang.isFree && !settings.premiumUnlocked) return;
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    updateSettings({ voiceLanguage: code });
    setShowVoiceLanguagePicker(false);
  };

  const renderLanguageList = (selectedCode: LanguageCode, onSelect: (code: LanguageCode) => void) => (
    <View style={styles.languageList}>
      {SUPPORTED_LANGUAGES.map(lang => {
        const isSelected = lang.code === selectedCode;
        const isLocked = !lang.isFree && !settings.premiumUnlocked;
        return (
          <Pressable
            key={lang.code}
            style={[styles.languageItem, isSelected && styles.languageItemActive]}
            onPress={() => onSelect(lang.code)}
          >
            <View style={styles.languageItemLeft}>
              <Text style={[styles.languageNativeName, isSelected && styles.languageNativeNameActive]}>
                {lang.nativeName}
              </Text>
              <Text style={[styles.languageEnglishName, isSelected && styles.languageEnglishNameActive]}>
                {lang.name}
              </Text>
            </View>
            <View style={styles.languageItemRight}>
              {isLocked && (
                <View style={styles.premiumBadge}>
                  <MaterialCommunityIcons name="lock" size={10} color={Colors.white} />
                  <Text style={styles.premiumBadgeText}>{t('ui.premium')}</Text>
                </View>
              )}
              {isSelected && (
                <MaterialCommunityIcons name="check" size={20} color={Colors.primary} />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top || webTopInset }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>{t('ui.settings')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: (insets.bottom || webBottomInset) + 20 }]}
        showsVerticalScrollIndicator={false}
        horizontal={false}
      >
        <View style={styles.columns}>
          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('ui.languageSettings')}</Text>
              <Pressable
                style={styles.settingRow}
                onPress={() => {
                  setShowLanguagePicker(!showLanguagePicker);
                  setShowVoiceLanguagePicker(false);
                }}
              >
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="translate" size={22} color={Colors.secondary} />
                  <View>
                    <Text style={styles.settingLabel}>{t('ui.textLanguage')}</Text>
                    <Text style={styles.settingDesc}>{currentLang.nativeName}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons
                  name={showLanguagePicker ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.textMuted}
                />
              </Pressable>
              {showLanguagePicker && renderLanguageList(settings.language, selectLanguage)}

              <Pressable
                style={styles.settingRow}
                onPress={() => {
                  setShowVoiceLanguagePicker(!showVoiceLanguagePicker);
                  setShowLanguagePicker(false);
                }}
              >
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="microphone" size={22} color={Colors.primary} />
                  <View>
                    <Text style={styles.settingLabel}>{t('ui.voiceLanguage')}</Text>
                    <Text style={styles.settingDesc}>{currentVoiceLang.nativeName}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons
                  name={showVoiceLanguagePicker ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.textMuted}
                />
              </Pressable>
              {showVoiceLanguagePicker && renderLanguageList(settings.voiceLanguage, selectVoiceLanguage)}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('ui.playback')}</Text>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="volume-high" size={22} color={Colors.secondary} />
                  <Text style={styles.settingLabel}>{t('ui.sound')}</Text>
                </View>
                <Switch
                  value={settings.soundEnabled}
                  onValueChange={toggleSound}
                  trackColor={{ false: Colors.textMuted, true: Colors.secondaryLight }}
                  thumbColor={settings.soundEnabled ? Colors.secondary : '#f4f3f4'}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="account-voice" size={22} color={Colors.primary} />
                  <View>
                    <Text style={styles.settingLabel}>{t('ui.voiceStyle')}</Text>
                    {settings.kioskModeEnabled && (
                      <Text style={styles.settingDesc}>{t('ui.lockedInKiosk')}</Text>
                    )}
                  </View>
                </View>
              </View>
              <View
                style={[styles.voiceOptions, settings.kioskModeEnabled && styles.voiceOptionsDisabled]}
                pointerEvents={settings.kioskModeEnabled ? 'none' : 'auto'}
              >
                <Pressable
                  style={[
                    styles.voiceOption,
                    settings.voiceStyle === 'female' && styles.voiceOptionActive,
                  ]}
                  onPress={() => setVoiceStyle('female')}
                  disabled={settings.kioskModeEnabled}
                >
                  <MaterialCommunityIcons
                    name="face-woman"
                    size={20}
                    color={settings.voiceStyle === 'female' ? Colors.white : Colors.primary}
                  />
                  <Text style={[
                    styles.voiceOptionText,
                    settings.voiceStyle === 'female' && styles.voiceOptionTextActive,
                  ]}>
                    {t('ui.femaleSoftWarm')}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.voiceOption,
                    settings.voiceStyle === 'male' && styles.voiceOptionActive,
                  ]}
                  onPress={() => setVoiceStyle('male')}
                  disabled={settings.kioskModeEnabled}
                >
                  <MaterialCommunityIcons
                    name="face-man"
                    size={20}
                    color={settings.voiceStyle === 'male' ? Colors.white : Colors.blue}
                  />
                  <Text style={[
                    styles.voiceOptionText,
                    settings.voiceStyle === 'male' && styles.voiceOptionTextActive,
                  ]}>
                    {t('ui.maleGentleCalm')}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('ui.childSafety')}</Text>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="lock-outline" size={22} color={Colors.lock} />
                  <View>
                    <Text style={styles.settingLabel}>{t('ui.kioskMode')}</Text>
                    <Text style={styles.settingDesc}>{t('ui.kioskDesc')}</Text>
                  </View>
                </View>
                <Switch
                  value={settings.kioskModeEnabled}
                  onValueChange={toggleKiosk}
                  trackColor={{ false: Colors.textMuted, true: Colors.purpleLight }}
                  thumbColor={settings.kioskModeEnabled ? Colors.lock : '#f4f3f4'}
                />
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('ui.premium')}</Text>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons
                    name={settings.premiumUnlocked ? 'crown' : 'crown-outline'}
                    size={22}
                    color={Colors.accent}
                  />
                  <Text style={styles.settingLabel}>
                    {settings.premiumUnlocked ? t('ui.premiumActive') : t('ui.freePlan')}
                  </Text>
                </View>
                {!settings.premiumUnlocked && (
                  <Pressable
                    style={styles.upgradeChip}
                    onPress={() => router.push('/upgrade')}
                  >
                    <Text style={styles.upgradeChipText}>{t('ui.upgrade')}</Text>
                  </Pressable>
                )}
              </View>
              <Pressable style={styles.settingRow} onPress={handleRestorePurchases}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="restore" size={22} color={Colors.blue} />
                  <Text style={styles.settingLabel}>{t('ui.restorePurchases')}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('ui.content')}</Text>
              <Pressable style={styles.settingRow} onPress={() => router.push('/custom-categories')}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="folder-heart" size={22} color={Colors.pink} />
                  <Text style={styles.settingLabel}>{t('ui.myCustomCategories')}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
              </Pressable>
              <Pressable style={styles.settingRow} onPress={() => router.push('/info')}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons name="lightbulb-on-outline" size={22} color={Colors.accent} />
                  <Text style={styles.settingLabel}>{t('ui.theScience')}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
              </Pressable>
            </View>

            {settings.premiumUnlocked && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('ui.categories')}</Text>
                <Pressable
                  style={styles.settingRow}
                  onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                >
                  <View style={styles.settingInfo}>
                    <MaterialCommunityIcons name="tune" size={22} color={Colors.secondary} />
                    <View>
                      <Text style={styles.settingLabel}>Show/Hide</Text>
                      <Text style={styles.settingDesc}>
                        {categoriesSeed.length + customCategories.length - (settings.disabledCategories || []).length} active
                      </Text>
                    </View>
                  </View>
                  <MaterialCommunityIcons
                    name={showCategoryPicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={Colors.textMuted}
                  />
                </Pressable>
                {showCategoryPicker && (
                  <View style={styles.categoryToggleList}>
                    {categoriesSeed.map(cat => {
                      const isDisabled = (settings.disabledCategories || []).includes(cat.id);
                      return (
                        <Pressable
                          key={cat.id}
                          style={styles.categoryToggleRow}
                          onPress={() => toggleCategory(cat.id)}
                        >
                          <View style={styles.categoryToggleInfo}>
                            <View style={[styles.categoryToggleIcon, { backgroundColor: cat.color + '20' }]}>
                              <MaterialCommunityIcons name={cat.icon as any} size={16} color={cat.color} />
                            </View>
                            <Text style={[styles.categoryToggleName, isDisabled && styles.categoryToggleNameDisabled]}>
                              {getCategoryName(strings, cat.id, cat.name)}
                            </Text>
                          </View>
                          <Switch
                            value={!isDisabled}
                            onValueChange={() => toggleCategory(cat.id)}
                            trackColor={{ false: Colors.textMuted, true: cat.color + '80' }}
                            thumbColor={!isDisabled ? cat.color : '#f4f3f4'}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                          />
                        </Pressable>
                      );
                    })}
                    {customCategories.length > 0 && (
                      <>
                        <View style={styles.categoryToggleDivider} />
                        {customCategories.map(cc => {
                          const isDisabled = (settings.disabledCategories || []).includes(cc.id);
                          return (
                            <Pressable
                              key={cc.id}
                              style={styles.categoryToggleRow}
                              onPress={() => toggleCategory(cc.id)}
                            >
                              <View style={styles.categoryToggleInfo}>
                                <View style={[styles.categoryToggleIcon, { backgroundColor: '#FF69B4' + '20' }]}>
                                  <MaterialCommunityIcons name="folder-heart" size={16} color="#FF69B4" />
                                </View>
                                <Text style={[styles.categoryToggleName, isDisabled && styles.categoryToggleNameDisabled]}>
                                  {cc.name}
                                </Text>
                              </View>
                              <Switch
                                value={!isDisabled}
                                onValueChange={() => toggleCategory(cc.id)}
                                trackColor={{ false: Colors.textMuted, true: '#FF69B4' + '80' }}
                                thumbColor={!isDisabled ? '#FF69B4' : '#f4f3f4'}
                                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                              />
                            </Pressable>
                          );
                        })}
                      </>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('ui.version')}</Text>
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
  title: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  columns: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
    gap: 12,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.text,
  },
  settingDesc: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textLight,
    marginTop: 2,
  },
  upgradeChip: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  upgradeChipText: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    color: Colors.white,
  },
  voiceOptions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 2,
  },
  voiceOptionsDisabled: {
    opacity: 0.45,
  },
  voiceOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  voiceOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  voiceOptionText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.text,
  },
  voiceOptionTextActive: {
    color: Colors.white,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textMuted,
  },
  languageList: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginVertical: 2,
  },
  languageItemActive: {
    backgroundColor: Colors.background,
  },
  languageItemLeft: {
    flex: 1,
    gap: 2,
  },
  languageItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageNativeName: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.text,
  },
  languageNativeNameActive: {
    color: Colors.primary,
  },
  languageEnglishName: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textMuted,
  },
  languageEnglishNameActive: {
    color: Colors.primary,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  premiumBadgeText: {
    fontSize: 9,
    fontFamily: 'Nunito_700Bold',
    color: Colors.white,
  },
  categoryToggleList: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  categoryToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  categoryToggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  categoryToggleIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryToggleName: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.text,
  },
  categoryToggleNameDisabled: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through' as const,
  },
  categoryToggleDivider: {
    height: 1,
    backgroundColor: Colors.background,
    marginVertical: 4,
    marginHorizontal: 8,
  },
});
