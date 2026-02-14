/**
 * Swasthio Typography System
 * 
 * Strategic font usage:
 * - Outfit: Brand elements, headings, UI labels (personality)
 * - Inter: Body text, descriptions, long-form content (readability)
 * 
 * Platform-aware scaling for consistent experience across iOS and Android
 */

import { Platform, PixelRatio } from 'react-native';

// Platform-aware font scaling
const normalize = (size: number) => {
  const scale = PixelRatio.getFontScale();
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    // Android tends to scale fonts more aggressively, so we cap it
    return Math.round(PixelRatio.roundToNearestPixel(newSize * 0.95));
  }
};

// Platform-specific font families
const getFontFamily = (fontName: string) => {
  if (Platform.OS === 'android') {
    // Android font fallbacks
    const fontMap: { [key: string]: string } = {
      'Outfit-Bold': 'Outfit-Bold',
      'Outfit-SemiBold': 'Outfit-SemiBold', 
      'Outfit-Medium': 'Outfit-Medium',
      'Outfit-Regular': 'Outfit-Regular',
      'Inter-Regular': 'Inter-Regular',
      'Inter-Medium': 'Inter-Medium',
      'Inter-SemiBold': 'Inter-SemiBold',
    };
    return fontMap[fontName] || 'System';
  }
  return fontName;
};

export const Typography = {
  // Brand & Headings (Outfit - matches logo personality)
  brand: {
    fontFamily: getFontFamily('Outfit-Bold'),
    letterSpacing: Platform.OS === 'android' ? -0.3 : -0.5,
  },
  
  heading: {
    hero: {
      fontFamily: getFontFamily('Outfit-SemiBold'),
      fontSize: normalize(28),
      letterSpacing: Platform.OS === 'android' ? -0.2 : -0.4,
      lineHeight: normalize(32),
    },
    large: {
      fontFamily: getFontFamily('Outfit-SemiBold'),
      fontSize: normalize(24),
      letterSpacing: Platform.OS === 'android' ? -0.15 : -0.3,
      lineHeight: normalize(28),
    },
    medium: {
      fontFamily: getFontFamily('Outfit-SemiBold'), 
      fontSize: normalize(20),
      letterSpacing: Platform.OS === 'android' ? -0.1 : -0.2,
      lineHeight: normalize(24),
    },
    small: {
      fontFamily: getFontFamily('Outfit-SemiBold'),
      fontSize: normalize(18),
      letterSpacing: Platform.OS === 'android' ? 0 : -0.1,
      lineHeight: normalize(22),
    },
    tiny: {
      fontFamily: getFontFamily('Outfit-Medium'),
      fontSize: normalize(16),
      letterSpacing: 0,
      lineHeight: normalize(20),
    }
  },

  // UI Elements (Outfit - friendly, approachable)
  ui: {
    button: {
      fontFamily: getFontFamily('Outfit-SemiBold'),
      fontSize: normalize(16),
      letterSpacing: Platform.OS === 'android' ? 0.1 : 0.2,
    },
    buttonSmall: {
      fontFamily: getFontFamily('Outfit-SemiBold'),
      fontSize: normalize(14),
      letterSpacing: Platform.OS === 'android' ? 0.2 : 0.3,
    },
    label: {
      fontFamily: getFontFamily('Outfit-Medium'),
      fontSize: normalize(14),
      letterSpacing: Platform.OS === 'android' ? 0.05 : 0.1,
    },
    labelSmall: {
      fontFamily: getFontFamily('Outfit-Medium'),
      fontSize: normalize(12),
      letterSpacing: Platform.OS === 'android' ? 0.1 : 0.2,
    },
    caption: {
      fontFamily: getFontFamily('Outfit-Regular'),
      fontSize: normalize(12),
      letterSpacing: Platform.OS === 'android' ? 0.2 : 0.3,
    }
  },

  // Body Text (Inter - optimal readability)
  body: {
    large: {
      fontFamily: getFontFamily('Inter-Regular'),
      fontSize: normalize(16),
      lineHeight: normalize(24),
    },
    medium: {
      fontFamily: getFontFamily('Inter-Regular'),
      fontSize: normalize(14),
      lineHeight: normalize(20),
    },
    small: {
      fontFamily: getFontFamily('Inter-Regular'),
      fontSize: normalize(12),
      lineHeight: normalize(16),
    }
  },

  // Metrics & Data (Outfit for personality in numbers)
  metric: {
    large: {
      fontFamily: getFontFamily('Outfit-Bold'),
      fontSize: normalize(20),
      letterSpacing: Platform.OS === 'android' ? -0.1 : -0.2,
    },
    medium: {
      fontFamily: getFontFamily('Outfit-SemiBold'),
      fontSize: normalize(16),
      letterSpacing: Platform.OS === 'android' ? 0 : -0.1,
    },
    label: {
      fontFamily: getFontFamily('Outfit-Medium'),
      fontSize: normalize(12),
      letterSpacing: Platform.OS === 'android' ? 0.1 : 0.2,
    }
  },

  // Special Cases
  greeting: {
    fontFamily: getFontFamily('Outfit-Medium'),
    fontSize: normalize(18),
    letterSpacing: 0,
  },
  
  satronis: {
    title: {
      fontFamily: getFontFamily('Outfit-SemiBold'),
      fontSize: normalize(16),
      letterSpacing: Platform.OS === 'android' ? 0.3 : 0.5,
      textTransform: 'uppercase' as const,
    },
    subtitle: {
      fontFamily: getFontFamily('Outfit-Medium'),
      fontSize: normalize(14),
      letterSpacing: Platform.OS === 'android' ? 0.05 : 0.1,
    },
    description: {
      fontFamily: getFontFamily('Inter-Regular'),
      fontSize: normalize(16),
      lineHeight: normalize(24),
    }
  }
};

// Brand Colors (from logo analysis) with platform-aware enhancements
export const BrandColors = {
  // Logo-extracted greens
  deepTeal: '#0D7377',
  primaryGreen: '#14A085', 
  mintGreen: '#7FCDCD',
  softMint: '#B8E6E6',
  
  // Backgrounds
  cream: '#F5F1E8',
  white: '#FFFFFF',
  
  // Text
  textPrimary: '#2C2C2C',
  textSecondary: '#555555',
  textTertiary: '#888888',
  
  // Semantic
  success: '#7FCDCD',
  warning: '#F4A261', 
  error: '#E76F51',
  
  // Status Colors (for remote files compatibility)
  critical: '#E76F51',
  urgent: '#F4A261',
  dueSoon: '#F4A261',
  completed: '#7FCDCD',
  neutral: '#888888',
};

// Platform-aware spacing system
export const Spacing = {
  xs: Platform.OS === 'android' ? 3 : 4,
  sm: Platform.OS === 'android' ? 7 : 8,
  md: Platform.OS === 'android' ? 14 : 16,
  lg: Platform.OS === 'android' ? 22 : 24,
  xl: Platform.OS === 'android' ? 30 : 32,
  xxl: Platform.OS === 'android' ? 46 : 48,
};

// Platform-aware shadows and elevations
export const Shadows = {
  small: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
  }),
  modal: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.24,
      shadowRadius: 16,
    },
    android: {
      elevation: 16,
    },
  }),
};

// Enhanced border radius system
export const BorderRadius = {
  xs: 4,
  sm: Platform.OS === 'android' ? 6 : 8,
  md: Platform.OS === 'android' ? 10 : 12,
  lg: Platform.OS === 'android' ? 14 : 16,
  xl: Platform.OS === 'android' ? 18 : 20,
  xxl: Platform.OS === 'android' ? 22 : 24,
  pill: 999,
};