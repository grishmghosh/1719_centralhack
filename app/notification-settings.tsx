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
  Bell, 
  Smartphone, 
  Clock, 
  Heart, 
  Pill, 
  Calendar, 
  Users,
  AlertCircle,
  Volume2
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

export default function NotificationSettingsScreen() {
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [appointmentAlerts, setAppointmentAlerts] = useState(true);
  const [healthCheckups, setHealthCheckups] = useState(true);
  const [familyUpdates, setFamilyUpdates] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

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

  const healthNotifications = [
    {
      icon: Pill,
      title: 'Medication Reminders',
      subtitle: 'Get reminders to take your medications on time',
      value: medicationReminders,
      onToggle: setMedicationReminders,
      color: BrandColors.primaryGreen,
    },
    {
      icon: Calendar,
      title: 'Appointment Alerts',
      subtitle: 'Notifications for upcoming medical appointments',
      value: appointmentAlerts,
      onToggle: setAppointmentAlerts,
      color: BrandColors.deepTeal,
    },
    {
      icon: Heart,
      title: 'Health Check-ups',
      subtitle: 'Reminders for routine health screenings',
      value: healthCheckups,
      onToggle: setHealthCheckups,
      color: BrandColors.success,
    },
    {
      icon: AlertCircle,
      title: 'Emergency Alerts',
      subtitle: 'Critical health alerts and emergency notifications',
      value: emergencyAlerts,
      onToggle: setEmergencyAlerts,
      color: BrandColors.error,
    },
  ];

  const socialNotifications = [
    {
      icon: Users,
      title: 'Family Updates',
      subtitle: 'Updates from family members\' health status',
      value: familyUpdates,
      onToggle: setFamilyUpdates,
      color: BrandColors.mintGreen,
    },
  ];

  const systemNotifications = [
    {
      icon: Smartphone,
      title: 'Push Notifications',
      subtitle: 'Show notifications on your device',
      value: pushNotifications,
      onToggle: setPushNotifications,
      color: BrandColors.warning,
    },
    {
      icon: Bell,
      title: 'Email Notifications',
      subtitle: 'Receive notifications via email',
      value: emailNotifications,
      onToggle: setEmailNotifications,
      color: BrandColors.deepTeal,
    },
    {
      icon: Volume2,
      title: 'Sound Alerts',
      subtitle: 'Play sounds for important notifications',
      value: soundAlerts,
      onToggle: setSoundAlerts,
      color: BrandColors.primaryGreen,
    },
  ];

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Health Notifications */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={IconSizes.large} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Health Notifications</Text>
          </View>
          
          <View style={styles.optionsList}>
            {healthNotifications.map((option, index) => (
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

        {/* Social Notifications */}
        <Animated.View
          entering={FadeInUp.delay(500).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={IconSizes.large} color={BrandColors.mintGreen} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Family & Social</Text>
          </View>
          
          <View style={styles.optionsList}>
            {socialNotifications.map((option, index) => (
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

        {/* System Notifications */}
        <Animated.View
          entering={FadeInUp.delay(700).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={IconSizes.large} color={BrandColors.warning} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Delivery Settings</Text>
          </View>
          
          <View style={styles.optionsList}>
            {systemNotifications.map((option, index) => (
              <AnimatedTouchableOpacity
                key={index}
                entering={FadeInUp.delay(800 + index * 100).springify()}
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

        {/* Active Medication Reminders */}
        <Animated.View
          entering={FadeInUp.delay(900).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Pill size={IconSizes.large} color={BrandColors.success} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Active Medication Reminders</Text>
          </View>
          
          <View style={styles.medicationsList}>
            <Animated.View
              entering={FadeInUp.delay(1000).springify()}
              style={styles.medicationCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                style={styles.medicationGradient}>
                <View style={styles.medicationContent}>
                  <View style={styles.medicationInfo}>
                    <Text style={styles.medicationName}>Metformin 500mg</Text>
                    <Text style={styles.medicationSchedule}>Twice daily: 8:00 AM, 8:00 PM</Text>
                    <Text style={styles.medicationNext}>Next reminder: Today 8:00 PM</Text>
                  </View>
                  <View style={[styles.medicationStatus, { backgroundColor: `${BrandColors.success}15` }]}>
                    <Text style={[styles.medicationStatusText, { color: BrandColors.success }]}>Active</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(1100).springify()}
              style={styles.medicationCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                style={styles.medicationGradient}>
                <View style={styles.medicationContent}>
                  <View style={styles.medicationInfo}>
                    <Text style={styles.medicationName}>Vitamin D3</Text>
                    <Text style={styles.medicationSchedule}>Once daily: 9:00 AM</Text>
                    <Text style={styles.medicationNext}>Next reminder: Tomorrow 9:00 AM</Text>
                  </View>
                  <View style={[styles.medicationStatus, { backgroundColor: `${BrandColors.success}15` }]}>
                    <Text style={[styles.medicationStatusText, { color: BrandColors.success }]}>Active</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
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
  medicationsList: {
    gap: Spacing.md,
  },
  medicationCard: {
    borderRadius: BorderRadius.md,
    shadowColor: BrandColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medicationGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  medicationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: 4,
  },
  medicationSchedule: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
    marginBottom: 2,
  },
  medicationNext: {
    ...Typography.body.small,
    color: BrandColors.primaryGreen,
    fontWeight: '500',
  },
  medicationStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  medicationStatusText: {
    ...Typography.body.small,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});