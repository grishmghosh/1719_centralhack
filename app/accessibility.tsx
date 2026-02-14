import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import { 
  ArrowLeft, 
  Accessibility, 
  Type, 
  Volume2, 
  VolumeX, 
  Eye, 
  Smartphone, 
  Vibrate,
  Sun,
  Moon,
  Contrast,
  MousePointer
} from 'lucide-react-native';
import { router } from 'expo-router';
import { BrandColors, Typography } from '@/constants/Typography';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Design System Constants
const IconSizes = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 28,
};

const STROKE_WIDTH = 1.5;

const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const BorderRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

export default function AccessibilityScreen() {
  const [largeText, setLargeText] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [voiceOver, setVoiceOver] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [textSize, setTextSize] = useState(1.3);
  const [voiceSpeed, setVoiceSpeed] = useState(0.8);

  const cardScale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handleCardPress = () => {
    cardScale.value = withSpring(0.97, {
      duration: 120,
      dampingRatio: 0.8,
      stiffness: 400
    });
    setTimeout(() => {
      cardScale.value = withSpring(1, {
        duration: 200,
        dampingRatio: 0.7,
        stiffness: 300
      });
    }, 120);
  };

  const visualOptions = [
    {
      icon: Type,
      title: 'Large Text',
      subtitle: 'Increase text size throughout the app',
      value: largeText,
      onToggle: setLargeText,
      color: BrandColors.primaryGreen,
    },
    {
      icon: Contrast,
      title: 'High Contrast',
      subtitle: 'Increase contrast for better visibility',
      value: highContrast,
      onToggle: setHighContrast,
      color: BrandColors.deepTeal,
    },
    {
      icon: MousePointer,
      title: 'Reduced Motion',
      subtitle: 'Minimize animations and transitions',
      value: reducedMotion,
      onToggle: setReducedMotion,
      color: BrandColors.mintGreen,
    },
  ];

  const audioOptions = [
    {
      icon: Volume2,
      title: 'Voice Over',
      subtitle: 'Enable screen reader functionality',
      value: voiceOver,
      onToggle: setVoiceOver,
      color: BrandColors.success,
    },
    {
      icon: Volume2,
      title: 'Sound Alerts',
      subtitle: 'Play sounds for notifications and alerts',
      value: soundAlerts,
      onToggle: setSoundAlerts,
      color: BrandColors.warning,
    },
  ];

  const interactionOptions = [
    {
      icon: Vibrate,
      title: 'Haptic Feedback',
      subtitle: 'Vibration feedback for touch interactions',
      value: hapticFeedback,
      onToggle: setHapticFeedback,
      color: BrandColors.deepTeal,
    },
  ];

  const getTextSizeLabel = (value: number) => {
    if (value < 0.8) return 'Small';
    if (value < 1.2) return 'Normal';
    if (value < 1.5) return 'Large';
    return 'Extra Large';
  };

  const getVoiceSpeedLabel = (value: number) => {
    if (value < 0.7) return 'Slow';
    if (value < 1.3) return 'Normal';
    if (value < 1.8) return 'Fast';
    return 'Very Fast';
  };

  return (
    <LinearGradient
      colors={[BrandColors.cream, '#F8F4EB', '#F6F2E9', BrandColors.cream]}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.container}>
      
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(100).springify()}
        style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={IconSizes.large} color={BrandColors.textPrimary} strokeWidth={STROKE_WIDTH} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accessibility</Text>
        <View style={styles.headerRight} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Visual Accessibility */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Eye size={IconSizes.large} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Visual</Text>
          </View>
          
          <View style={styles.optionsList}>
            {visualOptions.map((option, index) => (
              <AnimatedTouchableOpacity
                key={index}
                entering={FadeInUp.delay(300 + index * 100).springify()}
                style={[styles.optionCard, animatedCardStyle]}
                onPress={handleCardPress}>
                <View style={styles.cardContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                    style={styles.optionGradient}>
                    <View style={styles.optionContent}>
                      <View style={styles.optionInfo}>
                        <View style={[styles.optionIcon, { backgroundColor: `${option.color}15` }]}>
                          <option.icon size={IconSizes.medium} color={option.color} strokeWidth={STROKE_WIDTH} />
                        </View>
                        <View style={styles.optionText}>
                          <Text style={styles.optionTitle}>{option.title}</Text>
                          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                        </View>
                      </View>
                      <Switch
                        value={option.value}
                        onValueChange={option.onToggle}
                        trackColor={{ 
                          false: `${BrandColors.textTertiary}30`, 
                          true: `${option.color}40` 
                        }}
                        thumbColor={option.value ? option.color : BrandColors.textSecondary}
                        ios_backgroundColor={`${BrandColors.textTertiary}30`}
                      />
                    </View>
                  </LinearGradient>
                </View>
              </AnimatedTouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Text Size Slider */}
        <Animated.View
          entering={FadeInUp.delay(400).springify()}
          style={styles.section}>
          <AnimatedTouchableOpacity
            style={[styles.sliderCard, animatedCardStyle]}
            onPress={handleCardPress}>
            <View style={styles.cardContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                style={styles.sliderGradient}>
                <View style={styles.sliderHeader}>
                  <View style={styles.sliderInfo}>
                    <View style={[styles.sliderIcon, { backgroundColor: `${BrandColors.primaryGreen}15` }]}>
                      <Type size={IconSizes.medium} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                    </View>
                    <View style={styles.sliderText}>
                      <Text style={styles.sliderTitle}>Text Size</Text>
                      <Text style={styles.sliderValue}>{getTextSizeLabel(textSize)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.customSlider}>
                  <View style={styles.sliderTrack}>
                    <View 
                      style={[
                        styles.sliderProgress, 
                        { 
                          width: `${((textSize - 0.6) / (2.0 - 0.6)) * 100}%`,
                          backgroundColor: BrandColors.primaryGreen
                        }
                      ]} 
                    />
                  </View>
                  <View style={styles.sliderLabels}>
                    <TouchableOpacity onPress={() => setTextSize(0.6)}>
                      <Text style={styles.sliderLabel}>Small</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTextSize(1.0)}>
                      <Text style={styles.sliderLabel}>Normal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTextSize(1.3)}>
                      <Text style={styles.sliderLabel}>Large</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTextSize(2.0)}>
                      <Text style={styles.sliderLabel}>XLarge</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </AnimatedTouchableOpacity>
        </Animated.View>

        {/* Audio Accessibility */}
        <Animated.View
          entering={FadeInUp.delay(500).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Volume2 size={IconSizes.large} color={BrandColors.deepTeal} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Audio</Text>
          </View>
          
          <View style={styles.optionsList}>
            {audioOptions.map((option, index) => (
              <AnimatedTouchableOpacity
                key={index}
                entering={FadeInUp.delay(600 + index * 100).springify()}
                style={[styles.optionCard, animatedCardStyle]}
                onPress={handleCardPress}>
                <View style={styles.cardContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                    style={styles.optionGradient}>
                    <View style={styles.optionContent}>
                      <View style={styles.optionInfo}>
                        <View style={[styles.optionIcon, { backgroundColor: `${option.color}15` }]}>
                          <option.icon size={IconSizes.medium} color={option.color} strokeWidth={STROKE_WIDTH} />
                        </View>
                        <View style={styles.optionText}>
                          <Text style={styles.optionTitle}>{option.title}</Text>
                          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                        </View>
                      </View>
                      <Switch
                        value={option.value}
                        onValueChange={option.onToggle}
                        trackColor={{ 
                          false: `${BrandColors.textTertiary}30`, 
                          true: `${option.color}40` 
                        }}
                        thumbColor={option.value ? option.color : BrandColors.textSecondary}
                        ios_backgroundColor={`${BrandColors.textTertiary}30`}
                      />
                    </View>
                  </LinearGradient>
                </View>
              </AnimatedTouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Voice Speed Slider */}
        <Animated.View
          entering={FadeInUp.delay(700).springify()}
          style={styles.section}>
          <AnimatedTouchableOpacity
            style={[styles.sliderCard, animatedCardStyle]}
            onPress={handleCardPress}>
            <View style={styles.cardContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                style={styles.sliderGradient}>
                <View style={styles.sliderHeader}>
                  <View style={styles.sliderInfo}>
                    <View style={[styles.sliderIcon, { backgroundColor: `${BrandColors.success}15` }]}>
                      <Volume2 size={IconSizes.medium} color={BrandColors.success} strokeWidth={STROKE_WIDTH} />
                    </View>
                    <View style={styles.sliderText}>
                      <Text style={styles.sliderTitle}>Voice Speed</Text>
                      <Text style={styles.sliderValue}>{getVoiceSpeedLabel(voiceSpeed)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.customSlider}>
                  <View style={styles.sliderTrack}>
                    <View 
                      style={[
                        styles.sliderProgress, 
                        { 
                          width: `${((voiceSpeed - 0.5) / (2.0 - 0.5)) * 100}%`,
                          backgroundColor: BrandColors.success
                        }
                      ]} 
                    />
                  </View>
                  <View style={styles.sliderLabels}>
                    <TouchableOpacity onPress={() => setVoiceSpeed(0.5)}>
                      <Text style={styles.sliderLabel}>Slow</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setVoiceSpeed(0.8)}>
                      <Text style={styles.sliderLabel}>Normal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setVoiceSpeed(1.0)}>
                      <Text style={styles.sliderLabel}>Fast</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setVoiceSpeed(2.0)}>
                      <Text style={styles.sliderLabel}>Very Fast</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </AnimatedTouchableOpacity>
        </Animated.View>

        {/* Interaction */}
        <Animated.View
          entering={FadeInUp.delay(800).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Smartphone size={IconSizes.large} color={BrandColors.warning} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Interaction</Text>
          </View>
          
          <View style={styles.optionsList}>
            {interactionOptions.map((option, index) => (
              <AnimatedTouchableOpacity
                key={index}
                entering={FadeInUp.delay(900 + index * 100).springify()}
                style={[styles.optionCard, animatedCardStyle]}
                onPress={handleCardPress}>
                <View style={styles.cardContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                    style={styles.optionGradient}>
                    <View style={styles.optionContent}>
                      <View style={styles.optionInfo}>
                        <View style={[styles.optionIcon, { backgroundColor: `${option.color}15` }]}>
                          <option.icon size={IconSizes.medium} color={option.color} strokeWidth={STROKE_WIDTH} />
                        </View>
                        <View style={styles.optionText}>
                          <Text style={styles.optionTitle}>{option.title}</Text>
                          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                        </View>
                      </View>
                      <Switch
                        value={option.value}
                        onValueChange={option.onToggle}
                        trackColor={{ 
                          false: `${BrandColors.textTertiary}30`, 
                          true: `${option.color}40` 
                        }}
                        thumbColor={option.value ? option.color : BrandColors.textSecondary}
                        ios_backgroundColor={`${BrandColors.textTertiary}30`}
                      />
                    </View>
                  </LinearGradient>
                </View>
              </AnimatedTouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BrandColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    ...Typography.heading.medium,
    color: BrandColors.textPrimary,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.heading.small,
    color: BrandColors.textPrimary,
    marginLeft: Spacing.sm,
  },
  optionsList: {
    gap: Spacing.sm,
  },
  optionCard: {
    borderRadius: BorderRadius.md,
    shadowColor: BrandColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContainer: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  optionGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: 2,
  },
  optionSubtitle: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  sliderCard: {
    borderRadius: BorderRadius.md,
    shadowColor: BrandColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sliderGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  sliderHeader: {
    marginBottom: Spacing.md,
  },
  sliderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  sliderText: {
    flex: 1,
  },
  sliderTitle: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: 2,
  },
  sliderValue: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  customSlider: {
    marginTop: Spacing.md,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: `${BrandColors.textTertiary}30`,
    borderRadius: 2,
    marginBottom: Spacing.md,
  },
  sliderProgress: {
    height: '100%',
    borderRadius: 2,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
    fontSize: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});