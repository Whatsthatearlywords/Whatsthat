import * as Speech from 'expo-speech';
import { VoiceStyle } from './types';
import { LanguageCode, getLanguageMeta } from './i18n';

interface VoiceConfig {
  pitch: number;
  rate: number;
}

const voiceConfigs: Record<VoiceStyle, VoiceConfig> = {
  female: {
    pitch: 1.15,
    rate: 0.7,
  },
  male: {
    pitch: 0.85,
    rate: 0.72,
  },
};

export function speakWord(word: string, voiceStyle: VoiceStyle, languageCode: LanguageCode = 'en') {
  Speech.stop();
  const config = voiceConfigs[voiceStyle];
  const meta = getLanguageMeta(languageCode);
  Speech.speak(word, {
    language: meta.ttsCode,
    pitch: config.pitch,
    rate: config.rate,
  });
}
