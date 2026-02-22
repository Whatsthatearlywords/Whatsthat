import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function UpgradeModal({ visible, onClose, onUpgrade }: Props) {
  const handleUpgrade = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {}
    onUpgrade();
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="star-circle" size={56} color={Colors.accent} />
        </View>
        <Text style={styles.title}>Unlock More Words!</Text>
        <Text style={styles.subtitle}>
          Get access to all pages with more words and pictures for your little one to learn.
        </Text>

        <View style={styles.features}>
          {[
            'All pages in every category',
            'More animals, food, vehicles & more',
            'Unlimited custom categories',
          ].map((feat, i) => (
            <View key={i} style={styles.featureRow}>
              <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={styles.featureText}>{feat}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.upgradeButton} onPress={handleUpgrade}>
          <MaterialCommunityIcons name="crown" size={20} color={Colors.white} />
          <Text style={styles.upgradeText}>Unlock All Content</Text>
        </Pressable>

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Maybe Later</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    alignItems: 'center',
    paddingBottom: 40,
  },
  iconWrap: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  features: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.text,
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeText: {
    fontSize: 17,
    fontFamily: 'Nunito_700Bold',
    color: Colors.white,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 10,
  },
  closeText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textMuted,
  },
});
