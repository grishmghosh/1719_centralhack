import React, { useState, useRef } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  Pressable, 
  ViewStyle, 
  TextStyle, 
  Platform,
  Animated,
  PixelRatio
} from 'react-native';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react-native';
import { BorderRadius, Shadows } from '@/constants/Typography';

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

export type InputVariant = 'outlined' | 'filled' | 'underlined';
export type InputState = 'default' | 'focused' | 'error' | 'success' | 'disabled';

interface EnhancedInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  variant?: InputVariant;
  state?: InputState;
  errorMessage?: string;
  successMessage?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  multiline?: boolean;
  maxLength?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'off' | 'username' | 'password' | 'email' | 'name' | 'tel' | 'street-address' | 'postal-code' | 'cc-number';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  required?: boolean;
}

const BrandColors = {
  primaryGreen: '#14A085',
  lightGreen: '#E6F7FF',
  error: '#EF4444',
  lightError: '#FEF2F2',
  success: '#10B981',
  lightSuccess: '#F0FDF4',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  background: '#F9FAFB',
};

export default function EnhancedInput({
  label,
  placeholder,
  value = '',
  onChangeText,
  variant = 'outlined',
  state = 'default',
  errorMessage,
  successMessage,
  helperText,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  multiline = false,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete,
  style,
  inputStyle,
  disabled = false,
  required = false,
}: EnhancedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [internalValue, setInternalValue] = useState(value);
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    if (variant === 'filled' || variant === 'outlined') {
      Animated.timing(labelAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if ((variant === 'filled' || variant === 'outlined') && !internalValue) {
      Animated.timing(labelAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleChangeText = (text: string) => {
    setInternalValue(text);
    onChangeText?.(text);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerStyle = (): ViewStyle => {
    const currentState = disabled ? 'disabled' : (state !== 'default' ? state : (isFocused ? 'focused' : 'default'));
    
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.sm,
      minHeight: multiline ? normalize(80) : normalize(48),
      paddingHorizontal: normalize(12),
      paddingVertical: Platform.OS === 'ios' ? normalize(12) : normalize(8),
      flexDirection: 'row',
      alignItems: multiline ? 'flex-start' : 'center',
      position: 'relative',
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: currentState === 'error' ? BrandColors.lightError :
                          currentState === 'success' ? BrandColors.lightSuccess :
                          currentState === 'focused' ? BrandColors.lightGreen :
                          disabled ? '#F3F4F6' : BrandColors.background,
          borderWidth: 2,
          borderColor: currentState === 'error' ? BrandColors.error :
                      currentState === 'success' ? BrandColors.success :
                      currentState === 'focused' ? BrandColors.primaryGreen :
                      'transparent',
        };
        
      case 'underlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderRadius: 0,
          borderBottomWidth: 2,
          borderBottomColor: currentState === 'error' ? BrandColors.error :
                           currentState === 'success' ? BrandColors.success :
                           currentState === 'focused' ? BrandColors.primaryGreen :
                           BrandColors.border,
          paddingHorizontal: 0,
        };
        
      case 'outlined':
      default:
        return {
          ...baseStyle,
          backgroundColor: disabled ? '#F9FAFB' : '#FFFFFF',
          borderWidth: 1.5,
          borderColor: currentState === 'error' ? BrandColors.error :
                      currentState === 'success' ? BrandColors.success :
                      currentState === 'focused' ? BrandColors.primaryGreen :
                      BrandColors.border,
          ...Platform.select({
            ios: currentState === 'focused' ? Shadows.small : {},
            android: currentState === 'focused' ? { elevation: 2 } : {},
          }),
        };
    }
  };

  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontSize: normalize(16),
      fontFamily: Platform.select({
        ios: 'Inter-Regular',
        android: 'Inter-Regular',
      }),
      color: disabled ? BrandColors.textLight : BrandColors.textPrimary,
      paddingVertical: Platform.OS === 'ios' ? 0 : normalize(4),
      textAlignVertical: multiline ? 'top' : 'center',
      ...inputStyle,
    };
  };

  const getLabelStyle = (): TextStyle => {
    if (variant === 'filled' || variant === 'outlined') {
      return {
        position: 'absolute',
        left: normalize(12),
        fontSize: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [normalize(16), normalize(12)],
        }),
        top: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [normalize(12), normalize(-8)],
        }),
        backgroundColor: (variant === 'outlined' && isFocused) ? '#FFFFFF' : 'transparent',
        paddingHorizontal: (variant === 'outlined' && isFocused) ? normalize(4) : 0,
        color: state === 'error' ? BrandColors.error :
               state === 'success' ? BrandColors.success :
               isFocused ? BrandColors.primaryGreen :
               BrandColors.textSecondary,
        fontFamily: Platform.select({
          ios: 'Inter-Medium',
          android: 'Inter-Medium',
        }),
        zIndex: 1,
      } as any;
    }
    
    return {
      fontSize: normalize(14),
      fontFamily: Platform.select({
        ios: 'Inter-Medium',
        android: 'Inter-Medium',
      }),
      color: state === 'error' ? BrandColors.error :
             state === 'success' ? BrandColors.success :
             BrandColors.textSecondary,
      marginBottom: normalize(6),
    };
  };

  const showPasswordToggle = secureTextEntry && rightIcon === undefined;
  const showValidationIcon = (state === 'error' || state === 'success') && !showPasswordToggle && rightIcon === undefined;

  return (
    <View style={[{ marginBottom: normalize(16) }, style]}>
      {label && (variant === 'underlined' || (!isFocused && !internalValue)) && (
        <Text style={getLabelStyle()}>
          {label}
          {required && <Text style={{ color: BrandColors.error }}> *</Text>}
        </Text>
      )}
      
      {label && (variant === 'filled' || variant === 'outlined') && (
        <Animated.Text style={getLabelStyle()}>
          {label}
          {required && <Text style={{ color: BrandColors.error }}> *</Text>}
        </Animated.Text>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <View style={{ marginRight: normalize(8) }}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={BrandColors.textLight}
          value={internalValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          editable={!disabled}
          selectionColor={BrandColors.primaryGreen}
        />
        
        {showPasswordToggle && (
          <Pressable
            onPress={togglePasswordVisibility}
            style={{ padding: normalize(4), marginLeft: normalize(4) }}
          >
            {isPasswordVisible ? (
              <EyeOff size={normalize(20)} color={BrandColors.textSecondary} />
            ) : (
              <Eye size={normalize(20)} color={BrandColors.textSecondary} />
            )}
          </Pressable>
        )}
        
        {showValidationIcon && (
          <View style={{ marginLeft: normalize(8) }}>
            {state === 'error' ? (
              <AlertCircle size={normalize(20)} color={BrandColors.error} />
            ) : (
              <Check size={normalize(20)} color={BrandColors.success} />
            )}
          </View>
        )}
        
        {rightIcon && !showPasswordToggle && !showValidationIcon && (
          <View style={{ marginLeft: normalize(8) }}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {/* Helper/Error/Success Text */}
      {(errorMessage || successMessage || helperText) && (
        <View style={{ marginTop: normalize(4), flexDirection: 'row', alignItems: 'center' }}>
          {(errorMessage || successMessage) && (
            <View style={{ marginRight: normalize(4) }}>
              {errorMessage ? (
                <AlertCircle size={normalize(14)} color={BrandColors.error} />
              ) : (
                <Check size={normalize(14)} color={BrandColors.success} />
              )}
            </View>
          )}
          <Text
            style={{
              fontSize: normalize(12),
              color: errorMessage ? BrandColors.error :
                     successMessage ? BrandColors.success :
                     BrandColors.textSecondary,
              fontFamily: Platform.select({
                ios: 'Inter-Regular',
                android: 'Inter-Regular',
              }),
              flex: 1,
            }}
          >
            {errorMessage || successMessage || helperText}
          </Text>
        </View>
      )}
      
      {/* Character Count */}
      {maxLength && (
        <Text
          style={{
            fontSize: normalize(12),
            color: BrandColors.textLight,
            textAlign: 'right',
            marginTop: normalize(2),
            fontFamily: Platform.select({
              ios: 'Inter-Regular',
              android: 'Inter-Regular',
            }),
          }}
        >
          {internalValue.length}/{maxLength}
        </Text>
      )}
    </View>
  );
}