import { useMemo } from 'react';

export type LanguageCode =
  | 'en' | 'es' | 'zh' | 'hi' | 'ar'
  | 'fr' | 'pt' | 'bn' | 'ru' | 'ja'
  | 'de' | 'ko' | 'it' | 'tr' | 'vi';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  rtl: boolean;
  ttsCode: string;
  isFree: boolean;
}

export interface LanguageStrings {
  meta: LanguageMeta;
  ui: Record<string, string>;
  categories: Record<string, string>;
  items: Record<string, string>;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false, ttsCode: 'en-US', isFree: true },
  { code: 'es', name: 'Spanish', nativeName: 'Espanol', rtl: false, ttsCode: 'es-ES', isFree: false },
  { code: 'zh', name: 'Mandarin Chinese', nativeName: '\u4e2d\u6587', rtl: false, ttsCode: 'zh-CN', isFree: false },
  { code: 'hi', name: 'Hindi', nativeName: '\u0939\u093f\u0928\u094d\u0926\u0940', rtl: false, ttsCode: 'hi-IN', isFree: false },
  { code: 'ar', name: 'Arabic', nativeName: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', rtl: true, ttsCode: 'ar-SA', isFree: false },
  { code: 'fr', name: 'French', nativeName: 'Francais', rtl: false, ttsCode: 'fr-FR', isFree: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Portugues', rtl: false, ttsCode: 'pt-BR', isFree: false },
  { code: 'bn', name: 'Bengali', nativeName: '\u09ac\u09be\u0982\u09b2\u09be', rtl: false, ttsCode: 'bn-IN', isFree: false },
  { code: 'ru', name: 'Russian', nativeName: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439', rtl: false, ttsCode: 'ru-RU', isFree: false },
  { code: 'ja', name: 'Japanese', nativeName: '\u65e5\u672c\u8a9e', rtl: false, ttsCode: 'ja-JP', isFree: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false, ttsCode: 'de-DE', isFree: false },
  { code: 'ko', name: 'Korean', nativeName: '\ud55c\uad6d\uc5b4', rtl: false, ttsCode: 'ko-KR', isFree: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false, ttsCode: 'it-IT', isFree: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Turkce', rtl: false, ttsCode: 'tr-TR', isFree: false },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tieng Viet', rtl: false, ttsCode: 'vi-VN', isFree: false },
];

import en from '@/assets/languages/en.json';
import es from '@/assets/languages/es.json';
import zh from '@/assets/languages/zh.json';
import hi from '@/assets/languages/hi.json';
import ar from '@/assets/languages/ar.json';
import fr from '@/assets/languages/fr.json';
import pt from '@/assets/languages/pt.json';
import bn from '@/assets/languages/bn.json';
import ru from '@/assets/languages/ru.json';
import ja from '@/assets/languages/ja.json';
import de from '@/assets/languages/de.json';
import ko from '@/assets/languages/ko.json';
import it from '@/assets/languages/it.json';
import tr from '@/assets/languages/tr.json';
import vi from '@/assets/languages/vi.json';

const languageFiles: Record<LanguageCode, LanguageStrings> = {
  en: en as LanguageStrings,
  es: es as LanguageStrings,
  zh: zh as LanguageStrings,
  hi: hi as LanguageStrings,
  ar: ar as LanguageStrings,
  fr: fr as LanguageStrings,
  pt: pt as LanguageStrings,
  bn: bn as LanguageStrings,
  ru: ru as LanguageStrings,
  ja: ja as LanguageStrings,
  de: de as LanguageStrings,
  ko: ko as LanguageStrings,
  it: it as LanguageStrings,
  tr: tr as LanguageStrings,
  vi: vi as LanguageStrings,
};

export function getLanguageStrings(code: LanguageCode): LanguageStrings {
  return languageFiles[code] || languageFiles.en;
}

export function getLanguageMeta(code: LanguageCode): LanguageMeta {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
}

export function t(strings: LanguageStrings, key: string): string {
  const parts = key.split('.');
  if (parts.length === 2) {
    const section = parts[0] as 'ui' | 'categories' | 'items';
    const id = parts[1];
    return strings[section]?.[id] || getLanguageStrings('en')[section]?.[id] || key;
  }
  return strings.ui?.[key] || getLanguageStrings('en').ui?.[key] || key;
}

export function useTranslation(languageCode: LanguageCode) {
  const strings = useMemo(() => getLanguageStrings(languageCode), [languageCode]);

  const translate = useMemo(() => {
    return (key: string) => t(strings, key);
  }, [strings]);

  return { t: translate, strings, meta: getLanguageMeta(languageCode) };
}

export function getItemLabel(strings: LanguageStrings, itemId: string, fallback: string): string {
  return strings.items?.[itemId] || fallback;
}

export function getCategoryName(strings: LanguageStrings, categoryId: string, fallback: string): string {
  return strings.categories?.[categoryId] || fallback;
}
