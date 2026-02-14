import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import { ArrowLeft, Globe, Check, Clock } from 'lucide-react-native';
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

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

interface Region {
  code: string;
  name: string;
  flag: string;
  languages: string[];
}

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [selectedRegion, setSelectedRegion] = useState('IN');

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

  const languages: Language[] = [
    { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'United States' },
    { code: 'en-GB', name: 'English', nativeName: 'English', flag: '🇬🇧', region: 'United Kingdom' },
    { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Spain' },
    { code: 'es-MX', name: 'Spanish', nativeName: 'Español', flag: '🇲🇽', region: 'Mexico' },
    { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'France' },
    { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany' },
    { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Italy' },
    { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', region: 'Brazil' },
    { code: 'pt-PT', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', region: 'Portugal' },
    { code: 'zh-CN', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', region: 'China' },
    { code: 'zh-TW', name: 'Chinese', nativeName: '中文', flag: '🇹🇼', region: 'Taiwan' },
    { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Japan' },
    { code: 'ko-KR', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'South Korea' },
    { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Saudi Arabia' },
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India' },
    { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Russia' },
  ];

  const regions: Region[] = [
    { code: 'US', name: 'United States', flag: '🇺🇸', languages: ['en-US', 'es-MX'] },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', languages: ['en-GB'] },
    { code: 'EU', name: 'Europe', flag: '🇪🇺', languages: ['es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-PT'] },
    { code: 'LATAM', name: 'Latin America', flag: '🌎', languages: ['es-MX', 'pt-BR'] },
    { code: 'ASIA', name: 'Asia Pacific', flag: '🌏', languages: ['zh-CN', 'zh-TW', 'ja-JP', 'ko-KR', 'hi-IN'] },
    { code: 'MENA', name: 'Middle East & Africa', flag: '🌍', languages: ['ar-SA'] },
    { code: 'OTHER', name: 'Other', flag: '🌐', languages: ['ru-RU'] },
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    handleCardPress();
  };

  const handleRegionSelect = (regionCode: string) => {
    setSelectedRegion(regionCode);
    handleCardPress();
  };

  const getSelectedLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage);
  };

  const getSelectedRegion = () => {
    return regions.find(region => region.code === selectedRegion);
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
        <Text style={styles.headerTitle}>Language & Region</Text>
        <View style={styles.headerRight} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Current Selection */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={IconSizes.large} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Current Selection</Text>
          </View>
          
          <AnimatedTouchableOpacity
            entering={FadeInUp.delay(300).springify()}
            style={[styles.currentCard, animatedCardStyle]}
            onPress={handleCardPress}>
            <View style={styles.cardContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                style={styles.currentGradient}>
                <View style={styles.currentContent}>
                  <View style={styles.currentInfo}>
                    <Text style={styles.currentFlag}>{getSelectedLanguage()?.flag}</Text>
                    <View style={styles.currentText}>
                      <Text style={styles.currentLanguage}>
                        {getSelectedLanguage()?.nativeName} ({getSelectedLanguage()?.name})
                      </Text>
                      <Text style={styles.currentRegion}>{getSelectedLanguage()?.region}</Text>
                    </View>
                  </View>
                  <Check size={IconSizes.medium} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                </View>
              </LinearGradient>
            </View>
          </AnimatedTouchableOpacity>
        </Animated.View>

        {/* Language Selection */}
        <Animated.View
          entering={FadeInUp.delay(400).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={IconSizes.large} color={BrandColors.deepTeal} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Available Languages</Text>
          </View>
          
          <View style={styles.languagesList}>
            {languages.map((language, index) => (
              <AnimatedTouchableOpacity
                key={language.code}
                entering={FadeInUp.delay(500 + index * 50).springify()}
                style={[
                  styles.languageCard,
                  selectedLanguage === language.code && styles.selectedCard,
                  animatedCardStyle
                ]}
                onPress={() => handleLanguageSelect(language.code)}>
                <View style={styles.cardContainer}>
                  <LinearGradient
                    colors={
                      selectedLanguage === language.code
                        ? [`${BrandColors.primaryGreen}20`, `${BrandColors.primaryGreen}10`]
                        : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']
                    }
                    style={styles.languageGradient}>
                    <View style={styles.languageContent}>
                      <View style={styles.languageInfo}>
                        <Text style={styles.languageFlag}>{language.flag}</Text>
                        <View style={styles.languageText}>
                          <Text style={[
                            styles.languageName,
                            selectedLanguage === language.code && { color: BrandColors.primaryGreen }
                          ]}>
                            {language.nativeName}
                          </Text>
                          <Text style={styles.languageEnglish}>
                            {language.name} • {language.region}
                          </Text>
                        </View>
                      </View>
                      {selectedLanguage === language.code && (
                        <Check size={IconSizes.medium} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                      )}
                    </View>
                  </LinearGradient>
                </View>
              </AnimatedTouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Region Selection */}
        <Animated.View
          entering={FadeInUp.delay(600).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={IconSizes.large} color={BrandColors.warning} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Regional Preferences</Text>
          </View>
          
          <View style={styles.regionsList}>
            {regions.map((region, index) => (
              <AnimatedTouchableOpacity
                key={region.code}
                entering={FadeInUp.delay(700 + index * 50).springify()}
                style={[
                  styles.regionCard,
                  selectedRegion === region.code && styles.selectedCard,
                  animatedCardStyle
                ]}
                onPress={() => handleRegionSelect(region.code)}>
                <View style={styles.cardContainer}>
                  <LinearGradient
                    colors={
                      selectedRegion === region.code
                        ? [`${BrandColors.warning}20`, `${BrandColors.warning}10`]
                        : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']
                    }
                    style={styles.regionGradient}>
                    <View style={styles.regionContent}>
                      <View style={styles.regionInfo}>
                        <Text style={styles.regionFlag}>{region.flag}</Text>
                        <View style={styles.regionText}>
                          <Text style={[
                            styles.regionName,
                            selectedRegion === region.code && { color: BrandColors.warning }
                          ]}>
                            {region.name}
                          </Text>
                          <Text style={styles.regionLanguages}>
                            {region.languages.length} language{region.languages.length > 1 ? 's' : ''} available
                          </Text>
                        </View>
                      </View>
                      {selectedRegion === region.code && (
                        <Check size={IconSizes.medium} color={BrandColors.warning} strokeWidth={STROKE_WIDTH} />
                      )}
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
  currentCard: {
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
  currentGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  currentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currentFlag: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  currentText: {
    flex: 1,
  },
  currentLanguage: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: 2,
  },
  currentRegion: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  languagesList: {
    gap: Spacing.sm,
  },
  languageCard: {
    borderRadius: BorderRadius.md,
    shadowColor: BrandColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCard: {
    shadowColor: BrandColors.primaryGreen,
    shadowOpacity: 0.2,
  },
  languageGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: 2,
  },
  languageEnglish: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  regionsList: {
    gap: Spacing.sm,
  },
  regionCard: {
    borderRadius: BorderRadius.md,
    shadowColor: BrandColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  regionGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  regionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  regionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  regionFlag: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  regionText: {
    flex: 1,
  },
  regionName: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: 2,
  },
  regionLanguages: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  bottomSpacing: {
    height: 40,
  },
});