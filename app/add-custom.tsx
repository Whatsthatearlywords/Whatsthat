import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, Pressable, TextInput,
  Platform, Alert, useWindowDimensions, FlatList, Keyboard,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
let useAudioRecorderHook: any;
let useAudioPlayerHook: any;
let RecordingPresetsVal: any = {};
let AudioModuleVal: any = {};
let setAudioModeAsyncFn: any = async () => {};

try {
  const audioMod = require('expo-audio');
  useAudioRecorderHook = audioMod.useAudioRecorder;
  useAudioPlayerHook = audioMod.useAudioPlayer;
  RecordingPresetsVal = audioMod.RecordingPresets || {};
  AudioModuleVal = audioMod.AudioModule || {};
  setAudioModeAsyncFn = audioMod.setAudioModeAsync || (async () => {});
} catch (e) {
  useAudioRecorderHook = (_preset: any) => ({ prepareToRecordAsync: async () => {}, record: () => {}, stop: async () => {}, uri: null });
  useAudioPlayerHook = (_source: any) => null;
}
import * as Haptics from 'expo-haptics';
import * as Crypto from 'expo-crypto';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/app-context';
import { useTranslation } from '@/lib/i18n';
import { Item } from '@/lib/types';

type Step = 'name' | 'item-name' | 'item-photo' | 'item-record';

interface PendingItem {
  label: string;
  imageUri?: string;
  audioUri?: string;
  iconIndex: number;
}

const ICON_COLORS = ['#FF6B6B', '#FFD700', '#74B9FF', '#FF69B4', '#228B22', '#FF8C00', '#A29BFE', '#0984E3', '#DEB887', '#6C5CE7'];

export default function AddCustomScreen() {
  const insets = useSafeAreaInsets();
  const { addCustomCategory, settings } = useApp();
  const { t } = useTranslation(settings.language);
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const [step, setStep] = useState<Step>('name');
  const [categoryName, setCategoryName] = useState('');
  const [savedItems, setSavedItems] = useState<PendingItem[]>([]);
  const [currentItemName, setCurrentItemName] = useState('');
  const [currentImageUri, setCurrentImageUri] = useState<string | undefined>();
  const [currentAudioUri, setCurrentAudioUri] = useState<string | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recorder = useAudioRecorderHook(RecordingPresetsVal.HIGH_QUALITY);
  const previewPlayer = useAudioPlayerHook(currentAudioUri ? { uri: currentAudioUri } : null);

  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const isCompact = SCREEN_HEIGHT < 500;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleNameNext = () => {
    Keyboard.dismiss();
    if (!categoryName.trim()) {
      Alert.alert('Missing Name', 'Please enter a category name.');
      return;
    }
    setStep('item-name');
  };

  const handleItemNameNext = () => {
    Keyboard.dismiss();
    if (!currentItemName.trim()) {
      Alert.alert('Missing Name', 'Please enter an item name.');
      return;
    }
    setStep('item-photo');
  };

  const handlePickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please allow access to your photos to add images.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]) {
        setCurrentImageUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Could not open photo library.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please allow camera access to take photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]) {
        setCurrentImageUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Could not open camera.');
    }
  };

  const handlePhotoNext = () => {
    setStep('item-record');
  };

  const startRecording = async () => {
    try {
      const permResult = await AudioModuleVal.requestRecordingPermissionsAsync();
      if (!permResult.granted) {
        Alert.alert('Permission Needed', 'Please allow microphone access to record audio.');
        return;
      }
      await setAudioModeAsyncFn({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (e) {
      console.log('Recording error:', e);
      Alert.alert('Error', 'Could not start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = async () => {
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRecording(false);
      await recorder.stop();
      await setAudioModeAsyncFn({
        allowsRecording: false,
        playsInSilentMode: true,
      });
      const uri = recorder.uri;
      if (uri) {
        setCurrentAudioUri(uri);
      }
    } catch {
      setIsRecording(false);
    }
  };

  const playPreview = () => {
    if (!previewPlayer || !currentAudioUri) return;
    try {
      previewPlayer.seekTo(0);
      previewPlayer.play();
    } catch {}
  };

  const handleRecordNext = () => {
    const newItem: PendingItem = {
      label: currentItemName.trim(),
      imageUri: currentImageUri,
      audioUri: currentAudioUri,
      iconIndex: savedItems.length % ICON_COLORS.length,
    };
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {}
    setSavedItems(prev => [...prev, newItem]);
    setCurrentItemName('');
    setCurrentImageUri(undefined);
    setCurrentAudioUri(undefined);
    setStep('item-name');
  };

  const handleRemoveItem = (index: number) => {
    setSavedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleFinish = () => {
    if (savedItems.length === 0) {
      Alert.alert('No Items', 'Please add at least one item.');
      return;
    }
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {}

    const categoryId = Crypto.randomUUID();
    const categoryItems: Item[] = savedItems.map((item) => ({
      id: Crypto.randomUUID(),
      label: item.label,
      icon: 'star',
      iconFamily: 'MaterialCommunityIcons' as const,
      color: ICON_COLORS[item.iconIndex],
      isCustom: true,
      customImageUri: item.imageUri,
      customAudioUri: item.audioUri,
    }));

    addCustomCategory({
      id: categoryId,
      name: categoryName.trim(),
      items: categoryItems,
      ownerUserId: 'local',
    });

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/custom-categories');
    }
  };

  const handleBack = () => {
    Keyboard.dismiss();
    if (step === 'item-record') {
      if (isRecording) stopRecording();
      setStep('item-photo');
    } else if (step === 'item-photo') {
      setStep('item-name');
    } else if (step === 'item-name') {
      if (savedItems.length > 0) {
        handleFinish();
      } else {
        setStep('name');
      }
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }
  };

  const stepTitle = step === 'name' ? t('ui.newCategory')
    : step === 'item-name' ? categoryName
    : step === 'item-photo' ? `${t('ui.photoForItem')} "${currentItemName}"`
    : `${t('ui.recordItem')} "${currentItemName}"`;

  return (
    <View style={[styles.container, { paddingTop: insets.top || webTopInset }]}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtn} onPress={handleBack}>
          <MaterialCommunityIcons
            name={step === 'name' ? 'close' : 'chevron-left'}
            size={24}
            color={Colors.text}
          />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{stepTitle}</Text>
        {step === 'item-name' && savedItems.length > 0 ? (
          <Pressable style={[styles.headerBtn, { backgroundColor: Colors.success }]} onPress={handleFinish}>
            <MaterialCommunityIcons name="check" size={24} color={Colors.white} />
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {step === 'name' && (
        <View style={styles.topInputStep}>
          <Text style={[styles.prompt, isCompact && styles.promptCompact]}>
            Name your category
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.topInput, isCompact && styles.topInputCompact]}
              placeholder={t('ui.categoryNamePlaceholder')}
              placeholderTextColor={Colors.textMuted}
              value={categoryName}
              onChangeText={setCategoryName}
              maxLength={30}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={handleNameNext}
            />
            <Pressable
              style={({ pressed }) => [styles.goButton, pressed && { opacity: 0.8 }]}
              onPress={handleNameNext}
            >
              <MaterialCommunityIcons name="arrow-right" size={22} color={Colors.white} />
            </Pressable>
          </View>
        </View>
      )}

      {step === 'item-name' && (
        <View style={styles.topInputStep}>
          <Text style={[styles.prompt, isCompact && styles.promptCompact]}>
            {savedItems.length === 0 ? t('ui.addFirstItem') : `${t('ui.addItemN')} ${savedItems.length + 1}`}
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.topInput, isCompact && styles.topInputCompact]}
              placeholder={t('ui.itemNamePlaceholder')}
              placeholderTextColor={Colors.textMuted}
              value={currentItemName}
              onChangeText={setCurrentItemName}
              maxLength={20}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={handleItemNameNext}
            />
            <Pressable
              style={({ pressed }) => [styles.goButton, pressed && { opacity: 0.8 }]}
              onPress={handleItemNameNext}
            >
              <MaterialCommunityIcons name="arrow-right" size={22} color={Colors.white} />
            </Pressable>
          </View>
          {savedItems.length > 0 && (
            <View style={styles.savedItemsBar}>
              <FlatList
                data={savedItems}
                keyExtractor={(_, i) => i.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.savedItemsContent}
                renderItem={({ item, index }) => (
                  <View style={styles.savedChip}>
                    {item.imageUri ? (
                      <Image source={{ uri: item.imageUri }} style={styles.chipImage} />
                    ) : (
                      <MaterialCommunityIcons name="star" size={14} color={ICON_COLORS[item.iconIndex]} />
                    )}
                    <Text style={styles.chipLabel} numberOfLines={1}>{item.label}</Text>
                    <Pressable onPress={() => handleRemoveItem(index)} hitSlop={6}>
                      <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
                    </Pressable>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      )}

      {step === 'item-photo' && (
        <View style={styles.mediaStep}>
          <View style={styles.mediaPreview}>
            {currentImageUri ? (
              <Image source={{ uri: currentImageUri }} style={styles.previewImage} contentFit="cover" />
            ) : (
              <View style={styles.noPhoto}>
                <MaterialCommunityIcons name="image-plus" size={isCompact ? 36 : 48} color={Colors.textMuted} />
                <Text style={styles.noPhotoText}>No photo yet</Text>
              </View>
            )}
          </View>
          <View style={styles.mediaActions}>
            <Pressable style={({ pressed }) => [styles.mediaButton, pressed && { opacity: 0.8 }]} onPress={handleTakePhoto}>
              <MaterialCommunityIcons name="camera" size={22} color={Colors.white} />
              <Text style={styles.mediaButtonText}>{t('ui.takePhoto')}</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.mediaButton, { backgroundColor: Colors.secondary }, pressed && { opacity: 0.8 }]} onPress={handlePickPhoto}>
              <MaterialCommunityIcons name="image" size={22} color={Colors.white} />
              <Text style={styles.mediaButtonText}>{t('ui.fromLibrary')}</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.skipButton, pressed && { opacity: 0.8 }]} onPress={handlePhotoNext}>
              <Text style={styles.skipButtonText}>{currentImageUri ? t('ui.next') : t('ui.skip')}</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color={currentImageUri ? Colors.primary : Colors.textMuted} />
            </Pressable>
          </View>
        </View>
      )}

      {step === 'item-record' && (
        <View style={styles.mediaStep}>
          <View style={styles.recordArea}>
            {isRecording ? (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordDot} />
                <Text style={styles.recordingTime}>{recordingDuration}s</Text>
              </View>
            ) : currentAudioUri ? (
              <View style={styles.audioPreview}>
                <MaterialCommunityIcons name="check-circle" size={32} color={Colors.success} />
                <Text style={styles.audioPreviewText}>Recording saved</Text>
                <Pressable style={styles.playPreviewBtn} onPress={playPreview}>
                  <MaterialCommunityIcons name="play" size={22} color={Colors.primary} />
                </Pressable>
              </View>
            ) : (
              <View style={styles.noRecording}>
                <MaterialCommunityIcons name="microphone" size={isCompact ? 36 : 48} color={Colors.textMuted} />
                <Text style={styles.noPhotoText}>{t('ui.tapToRecord')}</Text>
              </View>
            )}
          </View>
          <View style={styles.mediaActions}>
            {!isRecording ? (
              <>
                <Pressable style={({ pressed }) => [styles.mediaButton, { backgroundColor: Colors.error }, pressed && { opacity: 0.8 }]} onPress={startRecording}>
                  <MaterialCommunityIcons name="microphone" size={22} color={Colors.white} />
                  <Text style={styles.mediaButtonText}>{currentAudioUri ? 'Re-record' : t('ui.record')}</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.skipButton, pressed && { opacity: 0.8 }]} onPress={handleRecordNext}>
                  <Text style={[styles.skipButtonText, { color: Colors.success }]}>
                    {currentAudioUri ? t('ui.saveItem') : t('ui.skipAndSave')}
                  </Text>
                  <MaterialCommunityIcons name="check" size={18} color={Colors.success} />
                </Pressable>
              </>
            ) : (
              <Pressable style={({ pressed }) => [styles.mediaButton, { backgroundColor: Colors.text }, pressed && { opacity: 0.8 }]} onPress={stopRecording}>
                <MaterialCommunityIcons name="stop" size={22} color={Colors.white} />
                <Text style={styles.mediaButtonText}>{t('ui.stopRecording')}</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  topInputStep: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  prompt: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  promptCompact: {
    fontSize: 14,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  topInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  topInputCompact: {
    paddingVertical: 8,
    fontSize: 16,
  },
  goButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedItemsBar: {
    marginTop: 10,
  },
  savedItemsContent: {
    gap: 8,
  },
  savedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  chipImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  chipLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.text,
    maxWidth: 80,
  },
  mediaStep: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 16,
  },
  mediaPreview: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  noPhoto: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  noPhotoText: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textMuted,
  },
  mediaActions: {
    justifyContent: 'center',
    gap: 10,
    width: 160,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  mediaButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: Colors.white,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textMuted,
  },
  recordArea: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recordDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.error,
  },
  recordingTime: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
  },
  audioPreview: {
    alignItems: 'center',
    gap: 6,
  },
  audioPreviewText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.text,
  },
  playPreviewBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRecording: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
