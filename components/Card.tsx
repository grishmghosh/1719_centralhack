import React from 'react';
import { View, ViewStyle, Platform, Pressable, PixelRatio } from 'react-native';
import { Shadows, BorderRadius } from '@/constants/Typography';

// Platform-aware font scaling
const normalize = (size: number) => {
  const scale = PixelRatio.getFontScale();
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize * 0.95));
  }
};

export type CardVariant = 'elevated' | 'outlined' | 'flat' | 'glass';
export type CardSize = 'small' | 'medium' | 'large';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  backgroundColor?: string;
}

const getCardShadow = (variant: CardVariant): ViewStyle => {
  switch (variant) {
    case 'elevated':
      return Platform.select({
        ios: Shadows.medium,
        android: {
          elevation: 6,
        },
      }) as ViewStyle;
    
    case 'outlined':
      return {
        borderWidth: 1,
        borderColor: Platform.select({
          ios: 'rgba(0, 0, 0, 0.08)',
          android: 'rgba(0, 0, 0, 0.12)',
        }),
        shadowOpacity: 0,
        elevation: 0,
      };
    
    case 'glass':
      return {
        ...Shadows.small,
        backgroundColor: Platform.select({
          ios: 'rgba(255, 255, 255, 0.9)',
          android: 'rgba(255, 255, 255, 0.95)',
        }),
      } as ViewStyle;
    
    case 'flat':
    default:
      return {
        shadowOpacity: 0,
        elevation: 0,
      };
  }
};

const getCardPadding = (size: CardSize): ViewStyle => {
  switch (size) {
    case 'small':
      return {
        padding: normalize(12),
      };
    case 'large':
      return {
        padding: normalize(20),
      };
    case 'medium':
    default:
      return {
        padding: normalize(16),
      };
  }
};

export default function Card({
  children,
  variant = 'elevated',
  size = 'medium',
  onPress,
  style,
  disabled = false,
  backgroundColor = '#FFFFFF',
}: CardProps) {
  const cardStyle: ViewStyle = {
    backgroundColor,
    borderRadius: BorderRadius.md,
    ...getCardShadow(variant),
    ...getCardPadding(size),
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          cardStyle,
          {
            transform: [
              {
                scale: pressed ? 0.98 : 1,
              },
            ],
            opacity: pressed ? 0.9 : (disabled ? 0.6 : 1),
          },
        ]}
        android_ripple={{
          color: 'rgba(0, 0, 0, 0.1)',
          borderless: false,
        }}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

// Pre-configured card variants for common use cases
export const CardVariants = {
  medical: {
    variant: 'elevated' as CardVariant,
    backgroundColor: '#F8FAFC',
    style: {
      borderLeftWidth: 4,
      borderLeftColor: '#14A085',
    },
  },
  
  warning: {
    variant: 'elevated' as CardVariant,
    backgroundColor: '#FEF3C7',
    style: {
      borderLeftWidth: 4,
      borderLeftColor: '#F59E0B',
    },
  },
  
  critical: {
    variant: 'elevated' as CardVariant,
    backgroundColor: '#FEF2F2',
    style: {
      borderLeftWidth: 4,
      borderLeftColor: '#EF4444',
    },
  },
  
  success: {
    variant: 'elevated' as CardVariant,
    backgroundColor: '#F0FDF4',
    style: {
      borderLeftWidth: 4,
      borderLeftColor: '#10B981',
    },
  },
  
  info: {
    variant: 'glass' as CardVariant,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    style: {
      borderLeftWidth: 4,
      borderLeftColor: '#3B82F6',
    },
  },
};