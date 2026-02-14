import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withTiming,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import {
  UserPlus,
  Settings,
  Bell,
  Shield,
  Calendar,
  Pill,
  Heart,
  Activity,
  AlertCircle,
  ChevronRight,
  Phone,
  AlertTriangle,
  Clock,
  MapPin,
} from 'lucide-react-native';
import { BrandColors, Typography } from '@/constants/Typography';
import { FAMILY_MEMBERS, FamilyMember } from '@/constants/FamilyData';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Design System Constants (consistent with homepage)
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

export default function FamilyScreen() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const cardScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  // Pulsing animation for critical status
  React.useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(0.6, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const handleCardPress = () => {
    cardScale.value = withSpring(0.96, { duration: 100 });
    setTimeout(() => {
      cardScale.value = withSpring(1, { duration: 150 });
    }, 100);
  };

  // Use shared family members data
  const familyMembers = FAMILY_MEMBERS;

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return BrandColors.completed;
      case 'stable': return BrandColors.primaryGreen;
      case 'needs-attention': return BrandColors.warning;
      case 'critical': return BrandColors.critical;
      default: return BrandColors.neutral;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return BrandColors.critical;
      case 'urgent': return BrandColors.urgent;
      case 'normal': return BrandColors.primaryGreen;
      default: return BrandColors.neutral;
    }
  };

  const handleEmergencyAccess = (member: typeof familyMembers[0]) => {
    Alert.alert(
      `🚨 Emergency Info - ${member.name}`,
      `Blood Type: ${member.emergency.bloodType}\n\nAllergies: ${member.emergency.allergies.join(', ') || 'None'}\n\nConditions: ${member.emergency.conditions.join(', ') || 'None'}\n\nCurrent Medications: ${member.emergency.medications.join(', ') || 'None'}\n\nHospital: ${member.emergency.hospital}\n\nInsurance: ${member.emergency.insurance}`,
      [
        {
          text: `Call ${member.emergency.emergencyContact.name}`,
          onPress: () => Alert.alert('Calling...', `Dialing ${member.emergency.emergencyContact.phone}`)
        },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleCallEmergencyContact = (member: typeof familyMembers[0]) => {
    Alert.alert(
      'Emergency Contact',
      `Call ${member.emergency.emergencyContact.name} (${member.emergency.emergencyContact.relation})?`,
      [
        {
          text: 'Call Now',
          onPress: () => Alert.alert('Calling...', `Dialing ${member.emergency.emergencyContact.phone}`)
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <LinearGradient
      colors={[BrandColors.cream, '#F8F4EB', '#F6F2E9', BrandColors.cream]}
      style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Header - Consistent with other screens */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.header}>
          <Text style={styles.title}>Family Health</Text>
          <Text style={styles.subtitle}>Manage your family's healthcare together</Text>
        </Animated.View>

        {/* Emergency Access - Critical Feature */}
        <Animated.View 
          entering={FadeInUp.delay(200).springify()}
          style={styles.section}>
          <View style={styles.emergencyHeader}>
            <AlertTriangle size={IconSizes.large} color={BrandColors.critical} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.emergencyTitle}>Emergency Medical Access</Text>
          </View>
          <View style={styles.emergencyGrid}>
            {familyMembers
              .filter(member => member.urgency === 'critical')
              .map((member, index) => {
              // Determine gradient colors based on urgency
              const getEmergencyGradient = (urgency: string): [string, string] => {
                switch (urgency) {
                  case 'critical':
                    return ['#8B0000', '#DC143C'];
                  case 'urgent':
                    return ['#B8860B', '#FF8C00'];
                  default:
                    return ['#DC2626', '#EF4444'];
                }
              };

              return (
                <Animated.View
                  key={`emergency-${member.id}`}
                  entering={FadeInUp.delay(250 + index * 100).springify()}
                  style={{ flex: 1, minWidth: '100%' }}>
                  <AnimatedTouchableOpacity
                    style={[styles.emergencyCard, animatedCardStyle]}
                    onPress={() => {
                      handleCardPress();
                      handleEmergencyAccess(member);
                    }}>
                    <LinearGradient
                      colors={getEmergencyGradient(member.urgency)}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.emergencyGradient}>
                      
                      {/* Urgency Indicator Pulse for Critical */}
                      {member.urgency === 'critical' && (
                        <Animated.View
                          style={[{
                            position: 'absolute',
                            top: Spacing.md,
                            right: Spacing.md,
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: '#FFD700',
                            shadowColor: '#FFD700',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.8,
                            shadowRadius: 6,
                            elevation: 8,
                          }, pulseStyle]}
                        />
                      )}

                      <View style={styles.emergencyCardContent}>
                        <Text style={styles.emergencyMemberName}>{member.name}</Text>
                        
                        <View style={styles.emergencyInfo}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
                            <Text style={styles.emergencyBloodType}>🩸 Blood Type: {member.emergency.bloodType}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.emergencyAllergies}>
                              ⚠️ {member.emergency.allergies.length > 0 
                                ? `Allergies: ${member.emergency.allergies.slice(0, 2).join(', ')}${member.emergency.allergies.length > 2 ? '...' : ''}`
                                : 'No known allergies'
                              }
                            </Text>
                          </View>
                        </View>

                        {/* Emergency Action Buttons - Fixed Layout */}
                        <View style={styles.emergencyButtonsContainer}>
                          {/* Primary Emergency Call Button */}
                          <TouchableOpacity 
                            style={styles.emergencyPrimaryButton}
                            onPress={() => handleCallEmergencyContact(member)}>
                            <Phone size={IconSizes.medium} color="white" strokeWidth={2} />
                            <Text style={styles.emergencyPrimaryButtonText}>EMERGENCY CALL</Text>
                          </TouchableOpacity>
                          
                          {/* Secondary Actions Row */}
                          <View style={styles.emergencySecondaryActions}>
                            <TouchableOpacity 
                              style={styles.emergencySecondaryButton}
                              onPress={() => handleEmergencyAccess(member)}>
                              <Text style={styles.emergencySecondaryButtonText}>VIEW DETAILS</Text>
                            </TouchableOpacity>
                            
                            <View style={styles.emergencyContactBadge}>
                              <Text style={styles.emergencyContactBadgeText}>
                                {member.emergency.emergencyContact.relation.toUpperCase()}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  </AnimatedTouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Family Members */}
        <Animated.View 
          entering={FadeInUp.delay(400).springify()}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Family Members</Text>
          
          {/* Add Family Member - Positioned as first item in family section */}
          <Animated.View 
            entering={FadeInUp.delay(450).springify()}
            style={{ marginBottom: Spacing.lg }}>
            <AnimatedTouchableOpacity
              style={[styles.addMemberCard, animatedCardStyle]}
              onPress={() => {
                handleCardPress();
                Alert.alert(
                  'Add Family Member',
                  'Connect a new family member to share health records and enable emergency access.',
                  [
                    { text: 'Invite via SMS', onPress: () => Alert.alert('SMS Invite', 'Invitation sent!') },
                    { text: 'Share QR Code', onPress: () => Alert.alert('QR Code', 'QR code generated for sharing.') },
                    { text: 'Cancel', style: 'cancel' }
                  ]
                );
              }}>
              <BlurView intensity={60} tint="light" style={styles.cardBlur}>
                <LinearGradient
                  colors={[`${BrandColors.primaryGreen}10`, `${BrandColors.deepTeal}10`]}
                  style={styles.addMemberGradient}>
                  <UserPlus size={IconSizes.xlarge} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                  <Text style={styles.addMemberText}>Add Family Member</Text>
                  <Text style={styles.addMemberSubtext}>Connect and manage their health records</Text>
                </LinearGradient>
              </BlurView>
            </AnimatedTouchableOpacity>
          </Animated.View>
          
          <View style={styles.membersList}>
            {familyMembers.map((member, index) => (
              <Animated.View
                key={member.id}
                entering={FadeInUp.delay(400 + index * 100).springify()}>
                <AnimatedTouchableOpacity
                  style={[styles.memberCard, animatedCardStyle]}
                  onPress={() => {
                    handleCardPress();
                    // Navigate to family profile screen
                    router.push(`/family-profile/${member.id}` as any);
                  }}>
                  <BlurView intensity={60} tint="light" style={styles.cardBlur}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                      style={styles.memberGradient}>
                      
                      <View style={styles.memberHeader}>
                        <View style={[
                          styles.memberAvatar, 
                          { backgroundColor: `${getHealthStatusColor(member.healthStatus)}15` }
                        ]}>
                          <Text style={[
                            styles.memberInitials, 
                            { color: getHealthStatusColor(member.healthStatus) }
                          ]}>
                            {member.initials}
                          </Text>
                        </View>
                        <View style={styles.memberInfo}>
                          <View style={styles.memberNameRow}>
                            <Text style={styles.memberName}>{member.name}</Text>
                            <View style={[
                              styles.urgencyIndicator,
                              { backgroundColor: getUrgencyColor(member.urgency) }
                            ]} />
                          </View>
                          <Text style={styles.memberRelationship}>
                            {member.relationship} • {member.age} years old
                          </Text>
                          <Text style={styles.lastCheckup}>
                            Last checkup: {member.lastCheckup}
                          </Text>
                        </View>
                        <TouchableOpacity style={styles.settingsButton}>
                          <ChevronRight size={IconSizes.medium} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.memberStats}>
                        <View style={styles.statRow}>
                          <View style={styles.statItem}>
                            <Activity size={IconSizes.small} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                            <Text style={styles.statText}>{member.activeConditions} conditions</Text>
                          </View>
                          <View style={styles.statItem}>
                            <Calendar size={IconSizes.small} color={BrandColors.deepTeal} strokeWidth={STROKE_WIDTH} />
                            <Text style={styles.statText}>{member.upcomingAppointments} appointments</Text>
                          </View>
                        </View>
                        <View style={styles.statRow}>
                          <View style={styles.statItem}>
                            <Pill size={IconSizes.small} color={BrandColors.warning} strokeWidth={STROKE_WIDTH} />
                            <Text style={styles.statText}>{member.medications} medications</Text>
                          </View>
                          <View style={styles.statItem}>
                            <Heart size={IconSizes.small} color={getHealthStatusColor(member.healthStatus)} strokeWidth={STROKE_WIDTH} />
                            <Text style={[styles.statText, { color: getHealthStatusColor(member.healthStatus) }]}>
                              {member.healthStatus.replace('-', ' ')}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.memberActions}>
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={(e) => {
                            e.stopPropagation(); // Prevent parent card onPress
                            // Navigate to family member's profile with documents tab selected
                            router.push({
                              pathname: `/family-profile/${member.id}` as any,
                              params: { tab: 'documents' }
                            });
                          }}>
                          <Text style={styles.actionButtonText}>View Records</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.reminderButton}
                          onPress={(e) => {
                            e.stopPropagation(); // Prevent parent card onPress
                            console.log('Reminder bell pressed for:', member.name);
                            // Direct navigation to reminders page
                            router.push('/reminders');
                          }}>
                          <Bell size={IconSizes.small} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </BlurView>
                </AnimatedTouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Privacy Settings */}
        <Animated.View 
          entering={FadeInUp.delay(800).springify()}
          style={styles.section}>
          <AnimatedTouchableOpacity
            style={[styles.privacyCard, animatedCardStyle]}
            onPress={() => {
              handleCardPress();
              router.push('/family-privacy-settings');
            }}>
            <BlurView intensity={35} tint="light" style={styles.cardBlur}>
              <LinearGradient
                colors={['rgba(34, 197, 94, 0.1)', 'rgba(16, 185, 129, 0.05)']}
                style={styles.privacyGradient}>
                <View style={styles.privacyHeader}>
                  <Shield size={24} color="#10B981" strokeWidth={2} />
                  <Text style={styles.privacyTitle}>Family Privacy Settings</Text>
                </View>
                <Text style={styles.privacyText}>
                  Manage what health information is shared between family members
                </Text>
              </LinearGradient>
            </BlurView>
          </AnimatedTouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.heading.hero,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
    fontSize: 28, // Explicitly set to ensure consistency
    fontFamily: 'Outfit-SemiBold', // Explicit font family
  },
  subtitle: {
    ...Typography.body.large,
    color: BrandColors.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading.medium,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.md,
  },
  
  // Emergency Access Styles - Sophisticated Design
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    backgroundColor: `${BrandColors.critical}08`,
    borderWidth: 1,
    borderColor: `${BrandColors.critical}20`,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    shadowColor: BrandColors.critical,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emergencyTitle: {
    ...Typography.heading.medium,
    color: BrandColors.critical,
    marginLeft: Spacing.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emergencyGrid: {
    gap: Spacing.lg,
  },
  emergencyCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  emergencyGradient: {
    padding: Spacing.lg,
    minHeight: 180,
    position: 'relative',
  },
  emergencyCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  emergencyMemberName: {
    ...Typography.heading.small,
    color: 'white',
    fontWeight: '800',
    marginBottom: Spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  emergencyInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  emergencyBloodType: {
    ...Typography.body.medium,
    color: 'white',
    fontWeight: '700',
    marginBottom: Spacing.xs,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  emergencyAllergies: {
    ...Typography.body.medium,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Emergency Button Layout - Fixed Design
  emergencyButtonsContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  emergencyPrimaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
    gap: Spacing.sm,
  },
  emergencyPrimaryButtonText: {
    ...Typography.ui.label,
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  emergencySecondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emergencySecondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flex: 1,
  },
  emergencySecondaryButtonText: {
    ...Typography.ui.labelSmall,
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  emergencyContactBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    minWidth: 80,
  },
  emergencyContactBadgeText: {
    ...Typography.body.small,
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  addMemberCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  cardBlur: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  addMemberGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  addMemberText: {
    ...Typography.body.large,
    fontWeight: '600',
    color: BrandColors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  addMemberSubtext: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
  membersList: {
    gap: Spacing.md,
  },
  memberCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  memberGradient: {
    padding: Spacing.lg,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  memberInitials: {
    ...Typography.body.large,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  memberName: {
    ...Typography.body.large,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
  urgencyIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  memberRelationship: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  lastCheckup: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  memberStats: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: `${BrandColors.primaryGreen}15`,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flex: 1,
    marginRight: Spacing.sm,
  },
  actionButtonText: {
    ...Typography.ui.label,
    color: BrandColors.primaryGreen,
    textAlign: 'center',
    fontWeight: '600',
  },
  reminderButton: {
    backgroundColor: `${BrandColors.textSecondary}15`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  privacyCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  privacyGradient: {
    padding: Spacing.lg,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  privacyTitle: {
    ...Typography.body.large,
    fontWeight: '600',
    color: BrandColors.textPrimary,
    marginLeft: Spacing.md,
  },
  privacyText: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 120,
  },
});