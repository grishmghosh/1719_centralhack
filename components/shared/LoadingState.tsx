import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { BrandColors, Typography } from '@/constants/Typography';
import Animated, { 
  FadeIn, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence
} from 'react-native-reanimated';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'pulse';
  message?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  message = 'Loading...',
  size = 'medium',
  color = BrandColors.primaryGreen
}) => {
  const pulseOpacity = useSharedValue(1);

  React.useEffect(() => {
    if (type === 'pulse') {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
    }
  }, [type, pulseOpacity]);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const getSpinnerSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'medium': return 32;
      case 'large': return 48;
      default: return 32;
    }
  };

  if (type === 'spinner') {
    return (
      <Animated.View 
        entering={FadeIn.duration(300)}
        style={styles.container}>
        <ActivityIndicator 
          size={getSpinnerSize()} 
          color={color} 
        />
        {message && (
          <Animated.Text 
            entering={FadeInUp.delay(200).springify()}
            style={[styles.message, styles[`message_${size}`]]}>
            {message}
          </Animated.Text>
        )}
      </Animated.View>
    );
  }

  if (type === 'skeleton') {
    return (
      <View style={styles.skeletonContainer}>
        <SkeletonLine width="80%" height={20} />
        <SkeletonLine width="60%" height={16} />
        <SkeletonLine width="90%" height={16} />
        <SkeletonLine width="40%" height={16} />
      </View>
    );
  }

  if (type === 'pulse') {
    return (
      <Animated.View 
        style={[styles.pulseContainer, pulseAnimatedStyle]}>
        <View style={[styles.pulseCircle, { backgroundColor: color }]} />
        {message && (
          <Text style={[styles.message, styles[`message_${size}`]]}>
            {message}
          </Text>
        )}
      </Animated.View>
    );
  }

  return null;
};

// Skeleton Line Component
const SkeletonLine: React.FC<{ width: string | number; height: number }> = ({ 
  width, 
  height 
}) => {
  const shimmerOpacity = useSharedValue(0.3);

  React.useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      false
    );
  }, [shimmerOpacity]);

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeletonLine,
        { width: width as any, height },
        shimmerAnimatedStyle
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  message_small: {
    fontSize: 12,
    marginTop: 8,
  },
  message_medium: {
    fontSize: 14,
    marginTop: 16,
  },
  message_large: {
    fontSize: 16,
    marginTop: 20,
  },
  skeletonContainer: {
    padding: 20,
    gap: 12,
  },
  skeletonLine: {
    backgroundColor: BrandColors.neutral,
    borderRadius: 4,
    marginBottom: 8,
  },
  pulseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pulseCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 16,
  },
});