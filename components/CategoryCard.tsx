import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { Category } from '@/lib/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  category: Category;
  onPress: () => void;
  isPremium: boolean;
  hasExtraPages: boolean;
}

export function CategoryCard({ category, onPress, isPremium, hasExtraPages }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      style={[styles.card, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
        <MaterialCommunityIcons
          name={category.icon as any}
          size={48}
          color={category.color}
        />
      </View>
      <Text style={styles.name} numberOfLines={1}>{category.name}</Text>
      {hasExtraPages && isPremium && (
        <View style={styles.badge}>
          <MaterialCommunityIcons name="plus" size={10} color={Colors.white} />
          <Text style={styles.badgeText}>more</Text>
        </View>
      )}
      {hasExtraPages && !isPremium && (
        <View style={[styles.badge, { backgroundColor: Colors.lock }]}>
          <MaterialCommunityIcons name="lock" size={10} color={Colors.white} />
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 140,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.white,
  },
});
