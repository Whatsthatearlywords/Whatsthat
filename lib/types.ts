import { LanguageCode } from './i18n';

export type Item = {
  id: string;
  label: string;
  icon: string;
  iconFamily: 'MaterialCommunityIcons' | 'Ionicons' | 'MaterialIcons' | 'FontAwesome' | 'Feather';
  color: string;
  isCustom?: boolean;
  customImageUri?: string;
  customAudioUri?: string;
};

export type Page = {
  id: string;
  items: Item[];
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  iconFamily: 'MaterialCommunityIcons' | 'Ionicons' | 'MaterialIcons' | 'FontAwesome' | 'Feather';
  color: string;
  pages: Page[];
  isPremium?: boolean;
};

export type UserCustomCategory = {
  id: string;
  name: string;
  items: Item[];
  ownerUserId: string;
};

export type VoiceStyle = 'female' | 'male';

export type UserSettings = {
  kioskModeEnabled: boolean;
  premiumUnlocked: boolean;
  soundEnabled: boolean;
  voiceStyle: VoiceStyle;
  kioskCategoryId?: string;
  language: LanguageCode;
  voiceLanguage: LanguageCode;
  disabledCategories: string[];
};
