import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings, UserCustomCategory } from './types';
import { usePurchases } from './purchases';

const SETTINGS_KEY = '@whatsthat_settings';
const CUSTOM_CATEGORIES_KEY = '@whatsthat_custom_categories';

interface AppContextValue {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  customCategories: UserCustomCategory[];
  addCustomCategory: (cat: UserCustomCategory) => void;
  removeCustomCategory: (id: string) => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const defaultSettings: UserSettings = {
  kioskModeEnabled: false,
  premiumUnlocked: false,
  soundEnabled: true,
  voiceStyle: 'female',
  language: 'en',
  voiceLanguage: 'en',
  disabledCategories: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [customCategories, setCustomCategories] = useState<UserCustomCategory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isPremium } = usePurchases();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isPremium && !settings.premiumUnlocked) {
      updateSettings({ premiumUnlocked: true });
    }
  }, [isPremium]);

  const loadData = async () => {
    try {
      const [settingsData, categoriesData] = await Promise.all([
        AsyncStorage.getItem(SETTINGS_KEY),
        AsyncStorage.getItem(CUSTOM_CATEGORIES_KEY),
      ]);
      if (settingsData) setSettings({ ...defaultSettings, ...JSON.parse(settingsData) });
      if (categoriesData) setCustomCategories(JSON.parse(categoriesData));
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addCustomCategory = (cat: UserCustomCategory) => {
    setCustomCategories(prev => {
      const existing = prev.findIndex(c => c.id === cat.id);
      let next: UserCustomCategory[];
      if (existing >= 0) {
        next = [...prev];
        next[existing] = cat;
      } else {
        next = [...prev, cat];
      }
      AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeCustomCategory = (id: string) => {
    setCustomCategories(prev => {
      const next = prev.filter(c => c.id !== id);
      AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(() => ({
    settings,
    updateSettings,
    customCategories,
    addCustomCategory,
    removeCustomCategory,
    isLoaded,
  }), [settings, customCategories, isLoaded]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
