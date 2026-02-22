import React from 'react';
import { StyleSheet, Text, Pressable, View, Platform, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Item } from '@/lib/types';
import { VoiceStyle } from '@/lib/types';
import { getItemImage } from '@/lib/image-map';
import { speakWord } from '@/lib/voice';
import { getItemLabel, getLanguageStrings, LanguageCode } from '@/lib/i18n';

let useAudioPlayerHook: (source: any) => any;
try {
  const audioMod = require('expo-audio');
  useAudioPlayerHook = audioMod.useAudioPlayer;
} catch (e) {
  useAudioPlayerHook = (_source: any) => null;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  item: Item;
  soundEnabled: boolean;
  voiceStyle?: VoiceStyle;
  languageCode?: LanguageCode;
  voiceLanguage?: LanguageCode;
}

export function ItemCard({ item, soundEnabled, voiceStyle = 'female', languageCode = 'en', voiceLanguage = 'en' }: Props) {
  const scale = useSharedValue(1);
  const imageSource = item.customImageUri ? undefined : getItemImage(item.id);
  const { height: screenH } = useWindowDimensions();

  const audioPlayer = useAudioPlayerHook(item.customAudioUri ? { uri: item.customAudioUri } : null);

  const isCompact = screenH < 500;
  const isVeryCompact = screenH < 400;
  const labelSize = isVeryCompact ? 14 : isCompact ? 18 : 28;
  const cardPad = isVeryCompact ? 3 : isCompact ? 4 : 6;
  const cardRadius = isCompact ? 12 : 18;
  const iconSize = isVeryCompact ? 36 : isCompact ? 48 : 72;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.15, { damping: 6, stiffness: 350 }),
      withSpring(1, { damping: 8, stiffness: 250 })
    );

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (soundEnabled) {
      if (item.customAudioUri && audioPlayer) {
        try {
          audioPlayer.seekTo(0);
          audioPlayer.play();
        } catch {
          const spokenLabel = item.isCustom ? item.label : getItemLabel(getLanguageStrings(voiceLanguage), item.id, item.label);
          speakWord(spokenLabel, voiceStyle, voiceLanguage);
        }
      } else {
        const spokenLabel = item.isCustom ? item.label : getItemLabel(getLanguageStrings(voiceLanguage), item.id, item.label);
        speakWord(spokenLabel, voiceStyle, voiceLanguage);
      }
    }
  };

  const hasCustomImage = !!item.customImageUri;

  return (
    <AnimatedPressable
      style={[styles.card, animatedStyle, { borderRadius: cardRadius, padding: cardPad }]}
      onPress={handlePress}
    >
      {hasCustomImage ? (
        <View style={[styles.imageWrap, { borderRadius: cardRadius - 2 }]}>
          <Image
            source={{ uri: item.customImageUri }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        </View>
      ) : imageSource ? (
        <View style={[styles.imageWrap, { borderRadius: cardRadius - 2 }]}>
          <Image
            source={imageSource}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
        </View>
      ) : (
        <View style={[styles.iconWrap, { backgroundColor: item.color + '18', borderRadius: cardRadius }]}>
          <MaterialCommunityIcons
            name={item.icon as any}
            size={iconSize}
            color={item.color}
          />
        </View>
      )}
      <Text
        style={[styles.label, { fontSize: labelSize, marginTop: isCompact ? 1 : 2 }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {item.isCustom ? item.label : getItemLabel(getLanguageStrings(languageCode), item.id, item.label)}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    flex: 1,
    margin: 3,
  },
  imageWrap: {
    flex: 1,
    width: '92%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconWrap: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Nunito_800ExtraBold',
    color: Colors.text,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
});
