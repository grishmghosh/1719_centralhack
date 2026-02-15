import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MoreHorizontal } from 'lucide-react-native';
import { router } from 'expo-router';
import { BrandColors, Typography } from '@/constants/Typography';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface HealthPageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  rightElement?: React.ReactNode;
  gradientColors?: [string, string, ...string[]];
}

export const HealthPageHeader: React.FC<HealthPageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  showMenuButton = false,
  onBackPress,
  onMenuPress,
  rightElement,
  gradientColors = [BrandColors.deepTeal, BrandColors.primaryGreen]
}) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}>
      <Animated.View 
        entering={FadeInDown.delay(100).springify()}
        style={styles.content}>
        
        {/* Left Side - Back Button */}
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}>
            <ArrowLeft size={24} color="white" strokeWidth={2} />
          </TouchableOpacity>
        )}

        {/* Center - Title & Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>

        {/* Right Side - Menu or Custom Element */}
        <View style={styles.rightContainer}>
          {rightElement}
          {showMenuButton && (
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={onMenuPress}>
              <MoreHorizontal size={24} color="white" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50, // Status bar padding
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    ...Typography.heading.medium,
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  rightContainer: {
    width: 44,
    alignItems: 'center',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});