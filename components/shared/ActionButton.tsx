import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';
import { BrandColors, Typography } from '@/constants/Typography';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  gradientColors?: [string, string];
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  gradientColors
}) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      duration: 100,
      dampingRatio: 0.8,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      duration: 150,
      dampingRatio: 0.7,
    });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  const getButtonColors = (): [string, string] => {
    if (gradientColors) return gradientColors;
    
    switch (variant) {
      case 'primary':
        return [BrandColors.primaryGreen, BrandColors.deepTeal];
      case 'secondary':
        return [BrandColors.mintGreen, BrandColors.softMint];
      case 'danger':
        return [BrandColors.critical, '#C0392B'];
      case 'success':
        return [BrandColors.completed, BrandColors.primaryGreen];
      default:
        return [BrandColors.primaryGreen, BrandColors.deepTeal];
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline':
        return BrandColors.primaryGreen;
      case 'secondary':
        return BrandColors.textPrimary;
      default:
        return 'white';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 20;
      case 'large': return 24;
      default: return 20;
    }
  };

  const containerStyle = [
    styles.container,
    styles[`container_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
  ];

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getTextColor()} 
          style={styles.loading}
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon 
              size={getIconSize()} 
              color={getTextColor()} 
              strokeWidth={2}
              style={styles.iconLeft}
            />
          )}
          <Text style={[
            styles.text,
            styles[`text_${size}`],
            { color: getTextColor() },
            disabled && styles.disabledText
          ]}>
            {title}
          </Text>
          {Icon && iconPosition === 'right' && (
            <Icon 
              size={getIconSize()} 
              color={getTextColor()} 
              strokeWidth={2}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </>
  );

  if (variant === 'outline') {
    return (
      <AnimatedTouchableOpacity
        style={[containerStyle, styles.outlineContainer, animatedStyle]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}>
        {buttonContent}
      </AnimatedTouchableOpacity>
    );
  }

  return (
    <AnimatedTouchableOpacity
      style={[containerStyle, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}>
      <LinearGradient
        colors={getButtonColors()}
        style={styles.gradient}>
        {buttonContent}
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  container_small: {
    borderRadius: 8,
  },
  container_medium: {
    borderRadius: 12,
  },
  container_large: {
    borderRadius: 16,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  outlineContainer: {
    borderWidth: 2,
    borderColor: BrandColors.primaryGreen,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Outfit-SemiBold',
    textAlign: 'center',
  },
  text_small: {
    fontSize: 14,
    lineHeight: 16,
  },
  text_medium: {
    fontSize: 16,
    lineHeight: 18,
  },
  text_large: {
    fontSize: 18,
    lineHeight: 20,
  },
  disabledText: {
    opacity: 0.7,
  },
  loading: {
    marginHorizontal: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});