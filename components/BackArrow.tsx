import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

interface BackArrowProps {
  onPress?: () => void;
  color?: string;
  size?: number;
}

export default function BackArrow({ 
  onPress = () => router.back(), 
  color = '#555555', 
  size = 24 
}: BackArrowProps) {
  return (
    <TouchableOpacity 
      style={styles.backButton}
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <ArrowLeft 
        size={size} 
        color={color} 
        strokeWidth={2}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});