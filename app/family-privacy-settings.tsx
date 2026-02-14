import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import {
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Users,
  Lock,
  Unlock,
  Settings,
  Bell,
  FileText,
  CreditCard,
  Heart,
  User,
  AlertCircle,
  CheckCircle,
  Info,
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

const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export default function FamilyPrivacySettingsScreen() {
  const [privacySettings, setPrivacySettings] = useState({
    // Medical Information Sharing
    medicalRecords: {
      'John Chen': { labReports: true, prescriptions: true, chronicConditions: true, mentalHealth: false },
      'Emma Chen': { labReports: false, prescriptions: false, chronicConditions: false, mentalHealth: false },
      'Robert Chen': { labReports: true, prescriptions: true, chronicConditions: true, mentalHealth: true },
    },
    // Financial Information
    financialAccess: {
      'John Chen': { insuranceDetails: true, medicalBills: true, premiumPayments: false },
      'Emma Chen': { insuranceDetails: false, medicalBills: false, premiumPayments: false },
      'Robert Chen': { insuranceDetails: true, medicalBills: true, premiumPayments: true },
    },
    // Emergency Access
    emergencyOverride: {
      'John Chen': true,
      'Emma Chen': false,
      'Robert Chen': true,
    },
    // Appointment Visibility
    appointmentSharing: {
      'John Chen': { upcoming: true, history: true, doctorNotes: false },
      'Emma Chen': { upcoming: false, history: false, doctorNotes: false },
      'Robert Chen': { upcoming: true, history: true, doctorNotes: true },
    }
  });

  const cardScale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handleCardPress = () => {
    cardScale.value = withSpring(0.96, { duration: 100 });
    setTimeout(() => {
      cardScale.value = withSpring(1, { duration: 150 });
    }, 100);
  };

  const familyMembers = [
    { id: '1', name: 'John Chen', relationship: 'Husband', isCurrentUser: true },
    { id: '2', name: 'Emma Chen', relationship: 'Daughter', isCurrentUser: false },
    { id: '3', name: 'Robert Chen', relationship: 'Father', isCurrentUser: false },
  ];

  const toggleSetting = (category: string, member: string, setting: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [member]: {
          ...(prev[category as keyof typeof prev] as any)[member],
          [setting]: !(prev[category as keyof typeof prev] as any)[member][setting]
        }
      }
    }));
  };

  const renderPrivacySection = (title: string, icon: any, description: string, category: string, settingKeys: string[]) => (
    <Animated.View 
      entering={FadeInUp.delay(100).springify()}
      style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          {React.createElement(icon, { size: IconSizes.large, color: BrandColors.primaryGreen, strokeWidth: STROKE_WIDTH })}
        </View>
        <View style={styles.sectionInfo}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionDescription}>{description}</Text>
        </View>
      </View>

      <View style={styles.settingsContainer}>
        {familyMembers.map((member, memberIndex) => (
          <Animated.View 
            key={member.id}
            entering={FadeInUp.delay(200 + memberIndex * 50).springify()}
            style={styles.memberSettingsCard}>
            <View style={styles.memberHeader}>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRelation}>{member.relationship}</Text>
                {member.isCurrentUser && (
                  <View style={styles.currentUserBadge}>
                    <Text style={styles.currentUserText}>You</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.settingsGrid}>
              {settingKeys.map((settingKey, settingIndex) => {
                const currentSetting = (privacySettings[category as keyof typeof privacySettings] as any)[member.name]?.[settingKey];
                return (
                  <View key={settingKey} style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingLabel}>{formatSettingLabel(settingKey)}</Text>
                      <Text style={styles.settingSubtext}>
                        {getSettingDescription(settingKey)}
                      </Text>
                    </View>
                    <Switch
                      value={currentSetting}
                      onValueChange={() => toggleSetting(category, member.name, settingKey)}
                      trackColor={{ false: BrandColors.neutral + '40', true: BrandColors.primaryGreen + '40' }}
                      thumbColor={currentSetting ? BrandColors.primaryGreen : BrandColors.neutral}
                      disabled={member.isCurrentUser} // Users have full access to their own data
                    />
                  </View>
                );
              })}
            </View>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const formatSettingLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      labReports: 'Lab Reports',
      prescriptions: 'Prescriptions',
      chronicConditions: 'Chronic Conditions',
      mentalHealth: 'Mental Health Records',
      insuranceDetails: 'Insurance Details',
      medicalBills: 'Medical Bills',
      premiumPayments: 'Premium Payments',
      upcoming: 'Upcoming Appointments',
      history: 'Appointment History',
      doctorNotes: 'Doctor Notes',
    };
    return labels[key] || key;
  };

  const getSettingDescription = (key: string) => {
    const descriptions: { [key: string]: string } = {
      labReports: 'Blood tests, X-rays, scan results',
      prescriptions: 'Current and past medications',
      chronicConditions: 'Ongoing health conditions',
      mentalHealth: 'Counseling and therapy records',
      insuranceDetails: 'Policy numbers and coverage',
      medicalBills: 'Treatment costs and invoices',
      premiumPayments: 'Insurance payment history',
      upcoming: 'Future doctor visits',
      history: 'Past appointment records',
      doctorNotes: 'Physician observations',
    };
    return descriptions[key] || '';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <LinearGradient
        colors={[BrandColors.cream, '#F8F4EB']}
        style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={IconSizes.large} color={BrandColors.textPrimary} strokeWidth={STROKE_WIDTH} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Shield size={IconSizes.xlarge} color="white" strokeWidth={STROKE_WIDTH} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Family Privacy Settings</Text>
            <Text style={styles.subtitle}>Control health information sharing across your family</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Important Notice */}
      <Animated.View 
        entering={FadeInUp.delay(50).springify()}
        style={styles.noticeContainer}>
        <View style={styles.notice}>
          <Info size={IconSizes.medium} color={BrandColors.warning} strokeWidth={STROKE_WIDTH} />
          <View style={styles.noticeText}>
            <Text style={styles.noticeTitle}>Privacy Control</Text>
            <Text style={styles.noticeDescription}>
              You control what health information family members can see. Emergency access may override these settings.
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderPrivacySection(
          'Medical Records Access',
          FileText,
          'Control who can view different types of medical information',
          'medicalRecords',
          ['labReports', 'prescriptions', 'chronicConditions', 'mentalHealth']
        )}

        {renderPrivacySection(
          'Financial Information',
          CreditCard,
          'Manage access to insurance and billing information',
          'financialAccess',
          ['insuranceDetails', 'medicalBills', 'premiumPayments']
        )}

        {renderPrivacySection(
          'Appointment Sharing',
          Heart,
          'Choose what appointment information to share',
          'appointmentSharing',
          ['upcoming', 'history', 'doctorNotes']
        )}

        {/* Emergency Override Section */}
        <Animated.View 
          entering={FadeInUp.delay(400).springify()}
          style={styles.section}>
          <View style={styles.emergencySection}>
            <View style={styles.emergencyHeader}>
              <AlertCircle size={IconSizes.large} color={BrandColors.critical} strokeWidth={STROKE_WIDTH} />
              <View style={styles.emergencyInfo}>
                <Text style={styles.emergencyTitle}>Emergency Access Override</Text>
                <Text style={styles.emergencyDescription}>
                  In medical emergencies, selected family members can access all health information regardless of privacy settings.
                </Text>
              </View>
            </View>

            <View style={styles.emergencySettings}>
              {familyMembers.filter(member => !member.isCurrentUser).map((member, index) => (
                <View key={member.id} style={styles.emergencyMemberRow}>
                  <View style={styles.emergencyMemberInfo}>
                    <Text style={styles.emergencyMemberName}>{member.name}</Text>
                    <Text style={styles.emergencyMemberRole}>Can access all health data in emergencies</Text>
                  </View>
                  <Switch
                    value={privacySettings.emergencyOverride[member.name as keyof typeof privacySettings.emergencyOverride]}
                    onValueChange={() => 
                      setPrivacySettings(prev => ({
                        ...prev,
                        emergencyOverride: {
                          ...prev.emergencyOverride,
                          [member.name]: !prev.emergencyOverride[member.name as keyof typeof prev.emergencyOverride]
                        }
                      }))
                    }
                    trackColor={{ false: BrandColors.neutral + '40', true: BrandColors.critical + '40' }}
                    thumbColor={privacySettings.emergencyOverride[member.name as keyof typeof privacySettings.emergencyOverride] ? BrandColors.critical : BrandColors.neutral}
                  />
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Privacy Tips */}
        <Animated.View 
          entering={FadeInUp.delay(500).springify()}
          style={styles.section}>
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Privacy Best Practices</Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <CheckCircle size={IconSizes.small} color={BrandColors.completed} strokeWidth={STROKE_WIDTH} />
                <Text style={styles.tipText}>Review privacy settings regularly as family dynamics change</Text>
              </View>
              <View style={styles.tipItem}>
                <CheckCircle size={IconSizes.small} color={BrandColors.completed} strokeWidth={STROKE_WIDTH} />
                <Text style={styles.tipText}>Emergency access ensures critical information is available when needed</Text>
              </View>
              <View style={styles.tipItem}>
                <CheckCircle size={IconSizes.small} color={BrandColors.completed} strokeWidth={STROKE_WIDTH} />
                <Text style={styles.tipText}>Mental health records require extra privacy considerations</Text>
              </View>
              <View style={styles.tipItem}>
                <CheckCircle size={IconSizes.small} color={BrandColors.completed} strokeWidth={STROKE_WIDTH} />
                <Text style={styles.tipText}>Minors' records may have special legal requirements</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.cream,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  backButton: {
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BrandColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Typography.heading.large,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body.large,
    color: BrandColors.textSecondary,
  },
  noticeContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: BrandColors.warning + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: BrandColors.warning,
  },
  noticeText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  noticeTitle: {
    ...Typography.body.medium,
    fontWeight: '600',
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  noticeDescription: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BrandColors.primaryGreen + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    ...Typography.heading.medium,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    lineHeight: 22,
  },
  settingsContainer: {
    gap: Spacing.md,
  },
  memberSettingsCard: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  memberHeader: {
    marginBottom: Spacing.lg,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  memberName: {
    ...Typography.body.large,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
  memberRelation: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
  },
  currentUserBadge: {
    backgroundColor: BrandColors.primaryGreen + '20',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  currentUserText: {
    ...Typography.ui.labelSmall,
    color: BrandColors.primaryGreen,
    fontWeight: '600',
  },
  settingsGrid: {
    gap: Spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    ...Typography.body.medium,
    fontWeight: '500',
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  settingSubtext: {
    ...Typography.body.small,
    color: BrandColors.textTertiary,
    lineHeight: 18,
  },
  emergencySection: {
    backgroundColor: BrandColors.critical + '05',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: BrandColors.critical + '20',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  emergencyInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  emergencyTitle: {
    ...Typography.body.large,
    fontWeight: '600',
    color: BrandColors.critical,
    marginBottom: Spacing.xs,
  },
  emergencyDescription: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    lineHeight: 22,
  },
  emergencySettings: {
    gap: Spacing.md,
  },
  emergencyMemberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  emergencyMemberInfo: {
    flex: 1,
  },
  emergencyMemberName: {
    ...Typography.body.medium,
    fontWeight: '600',
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emergencyMemberRole: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  tipsContainer: {
    backgroundColor: BrandColors.completed + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  tipsTitle: {
    ...Typography.body.large,
    fontWeight: '600',
    color: BrandColors.textPrimary,
    marginBottom: Spacing.md,
  },
  tipsList: {
    gap: Spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 80,
  },
});