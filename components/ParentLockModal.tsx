import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { generateMathQuestion, MathQuestion } from '@/lib/math-questions';

interface Props {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ParentLockModal({ visible, onSuccess, onCancel }: Props) {
  const [question, setQuestion] = useState<MathQuestion>(generateMathQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  useEffect(() => {
    if (visible) {
      setQuestion(generateMathQuestion());
      setSelectedAnswer(null);
      setIsWrong(false);
    }
  }, [visible]);

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    if (answer === question.answer) {
      try {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch {}
      setTimeout(onSuccess, 300);
    } else {
      setIsWrong(true);
      try {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      } catch {}
      setTimeout(() => {
        setQuestion(generateMathQuestion());
        setSelectedAnswer(null);
        setIsWrong(false);
      }, 800);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="lock" size={32} color={Colors.lock} />
          <Text style={styles.title}>Parent Check</Text>
        </View>
        <Text style={styles.subtitle}>Answer to continue</Text>
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>
        <View style={styles.options}>
          {question.options.map((opt, i) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect = opt === question.answer;
            let bgColor = Colors.card;
            if (isSelected && isCorrect) bgColor = Colors.success;
            else if (isSelected && !isCorrect) bgColor = Colors.error;

            return (
              <Pressable
                key={i}
                style={[styles.optionButton, { backgroundColor: bgColor }]}
                onPress={() => handleAnswer(opt)}
                disabled={selectedAnswer !== null}
              >
                <Text style={[
                  styles.optionText,
                  isSelected && { color: Colors.white },
                ]}>
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {isWrong && (
          <Text style={styles.wrongText}>Try again!</Text>
        )}
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 1000,
  },
  container: {
    backgroundColor: Colors.background,
    borderRadius: 28,
    padding: 28,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textLight,
    marginBottom: 20,
  },
  questionBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  questionText: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  optionButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  optionText: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    color: Colors.text,
  },
  wrongText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.error,
    marginBottom: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textMuted,
  },
});
