import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Typography, BrandColors, Spacing, Shadows, BorderRadius } from '@/constants/Typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface EnhancedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
  style?: any;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function EnhancedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  hapticFeedback = true,
  style,
}: EnhancedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const shadowOpacity = useSharedValue(0);

  // Enhanced animations
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    ...Shadows.medium,
    shadowOpacity: interpolate(shadowOpacity.value, [0, 1], [0, 0.15]),
  }));

  const handlePressIn = () => {
    if (disabled || loading) return;
    
    // Haptic feedback
    if (hapticFeedback) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        // Android vibration pattern
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }

    // Smooth press animation
    scale.value = withSpring(0.96, {
      duration: 150,
      dampingRatio: 0.8,
    });
    
    if (variant === 'primary') {
      shadowOpacity.value = withTiming(1, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (disabled || loading) return;

    scale.value = withSpring(1, {
      duration: 200,
      dampingRatio: 0.7,
    });
    
    shadowOpacity.value = withTiming(0, { duration: 200 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    
    // Additional haptic for successful press
    if (hapticFeedback && Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    onPress();
  };

  // Get size-specific styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.md,
          borderRadius: BorderRadius.sm,
          gap: Spacing.xs,
        };
      case 'large':
        return {
          paddingVertical: Spacing.lg,
          paddingHorizontal: Spacing.xl,
          borderRadius: BorderRadius.lg,
          gap: Spacing.sm,
        };
      default: // medium
        return {
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
          borderRadius: BorderRadius.md,
          gap: Spacing.sm,
        };
    }
  };

  // Get variant-specific styles
  const getVariantStyles = () => {
    const baseStyles: any = {
      ...getSizeStyles(),
      flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...(fullWidth && { width: '100%' }),
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: disabled ? BrandColors.neutral : BrandColors.primaryGreen,
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyles,
          backgroundColor: disabled ? BrandColors.neutral : BrandColors.error,
        };
      default: // primary
        return {
          ...baseStyles,
          backgroundColor: disabled ? BrandColors.neutral : 'transparent', // Will use gradient
        };
    }
  };

  // Get text styles
  const getTextStyles = () => {
    const baseTextStyle = size === 'small' ? Typography.ui.buttonSmall : Typography.ui.button;
    
    switch (variant) {
      case 'secondary':
        return {
          ...baseTextStyle,
          color: disabled ? BrandColors.textTertiary : BrandColors.primaryGreen,
        };
      case 'ghost':
        return {
          ...baseTextStyle,
          color: disabled ? BrandColors.textTertiary : BrandColors.primaryGreen,
        };
      case 'danger':
        return {
          ...baseTextStyle,
          color: disabled ? BrandColors.textTertiary : BrandColors.white,
        };
      default: // primary
        return {
          ...baseTextStyle,
          color: disabled ? BrandColors.textTertiary : BrandColors.white,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const textStyles = getTextStyles();

  const renderContent = () => (
    <View style={variantStyles}>
      {icon && iconPosition === 'left' && icon}
      <Text style={textStyles}>{title}</Text>
      {icon && iconPosition === 'right' && icon}
    </View>
  );

  // Primary variant uses gradient
  if (variant === 'primary' && !disabled) {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[animatedStyle, shadowStyle, style]}
        disabled={disabled || loading}
      >
        <LinearGradient
          colors={[BrandColors.primaryGreen, BrandColors.deepTeal]}
          style={variantStyles}
        >
          {icon && iconPosition === 'left' && icon}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  // Other variants use regular background
  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[animatedStyle, style]}
      disabled={disabled || loading}
    >
      {renderContent()}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  // Additional styles can be added here if needed
});