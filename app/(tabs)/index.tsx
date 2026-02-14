import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
  Bell,
  FileText,
  CircleAlert as AlertCircle,
  Heart,
  Shield,
  Sparkles,
  Stethoscope,
  Pill,
  Activity,
  User,
  QrCode,
  Hand,
  Plus,
  Clock,
  Calendar,
  Users,
  Zap
} from 'lucide-react-native';
import { router } from 'expo-router';
import { BrandColors, Typography } from '@/constants/Typography';
import { getHomepageFamilyMembers } from '@/constants/FamilyData';
import { useQRScanner } from '@/contexts/QRScannerContext';
import EmergencyProfileModal from '../emergency-profile';
import QRScanner from '@/components/QRScanner';
import MedicalSharingFlow from '@/components/MedicalSharingFlow';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Consistent Icon System
const IconSizes = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 28,
};

const STROKE_WIDTH = 1.5; // Consistent across all icons

// Consistent Spacing System
const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Border Radius System
const BorderRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const [showEmergencyProfile, setShowEmergencyProfile] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showMedicalSharing, setShowMedicalSharing] = useState(false);
  const [scannedQRData, setScannedQRData] = useState<string>('');
  const { setIsQRScannerOpen, setIsMedicalSharingOpen } = useQRScanner();

  // Handle QR scanner activation - SIMPLIFIED: No animations
  const handleQRScannerToggle = () => {
    const newState = !showQRScanner;
    setShowQRScanner(newState);
    setIsQRScannerOpen(newState); // Update global context to hide/show tab bar
  };

  // Mock data with urgency states
  const medicationsRaw = [
    {
      id: 1,
      name: 'Metformin',
      time: '8:00 AM',
      status: 'completed',
      urgency: 'completed',
      dueTime: new Date('2024-12-20T08:00:00')
    },
    {
      id: 2,
      name: 'Lisinopril', 
      time: '2:00 PM',
      status: 'pending',
      urgency: 'urgent', // due today
      dueTime: new Date('2024-12-20T14:00:00')
    },
    {
      id: 3,
      name: 'Vitamin D',
      time: '6:00 PM',
      status: 'overdue',
      urgency: 'critical', // overdue
      dueTime: new Date('2024-12-19T18:00:00')
    }
  ];

  const alertsRaw = [
    {
      id: 1,
      text: 'Metformin refill needed in 3 days',
      urgency: 'dueSoon',
      priority: 3
    },
    {
      id: 2,
      text: 'Blood pressure check overdue by 2 days',
      urgency: 'critical',
      priority: 1
    },
    {
      id: 3,
      text: 'Annual checkup due next month',
      urgency: 'neutral',
      priority: 4
    }
  ];

  // Sort medications by urgency (critical first, then by time)
  const medications = medicationsRaw.sort((a, b) => {
    const urgencyOrder: { [key: string]: number } = { 'critical': 0, 'urgent': 1, 'dueSoon': 2, 'completed': 3, 'neutral': 4 };
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }
    return a.dueTime.getTime() - b.dueTime.getTime();
  });

  // Sort alerts by priority (critical first)
  const alerts = alertsRaw.sort((a, b) => a.priority - b.priority);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return BrandColors.critical;
      case 'urgent': return BrandColors.urgent;
      case 'dueSoon': return BrandColors.dueSoon;
      case 'completed': return BrandColors.completed;
      default: return BrandColors.neutral;
    }
  };

  const getUrgencyBgColor = (urgency: string, opacity: number = 0.1) => {
    const color = getUrgencyColor(urgency);
    // Convert hex to rgba for background tints
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Smart visibility logic
  const hasTodaysMedications = medications.length > 0;
  const hasHealthAlerts = alerts.length > 0;
  const hasConditions = true; // Mock - in real app, check if user has conditions
  const hasFamilyMembers = true; // Mock - in real app, check if user manages family
  const shouldShowEmergencyProfile = true; // Always show for safety
  const showEnhancedIntelligence = true; // Feature showcase

  // Get family members for homepage display
  const homepageFamilyMembers = getHomepageFamilyMembers();

  // Navigation handlers
  const handleTodaysHealthPress = () => {
    router.push('/todays-health' as any);
  };

  const handleHealthAlertsPress = () => {
    router.push('/health-alerts' as any);
  };

  const handleMyConditionsPress = () => {
    router.push('/my-conditions' as any);
  };

  const handleEmergencyProfilePress = () => {
    setShowEmergencyProfile(true);
  };

  const handleFamilyHealthPress = () => {
    // Navigate to Family tab with contextual state
    router.push('/(tabs)/family');
  };

  const cardScale = useSharedValue(1);
  const quickActionScale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const animatedQuickActionStyle = useAnimatedStyle(() => ({
    transform: [{ scale: quickActionScale.value }],
  }));

  const handleCardPress = () => {
    cardScale.value = withSpring(0.97, {
      duration: 120,
      dampingRatio: 0.8,
    });
    setTimeout(() => {
      cardScale.value = withSpring(1, {
        duration: 200,
        dampingRatio: 0.7,
      });
    }, 120);
  };

  const handleQuickActionPress = () => {
    quickActionScale.value = withSpring(0.92, {
      duration: 100,
      dampingRatio: 0.9,
    });
    setTimeout(() => {
      quickActionScale.value = withSpring(1, {
        duration: 150,
        dampingRatio: 0.6,
      });
      // Navigate to add reminder
      router.push('/add-reminder' as any);
    }, 100);
  };

  const handleAddRecordPress = () => {
    quickActionScale.value = withSpring(0.92, {
      duration: 100,
      dampingRatio: 0.9,
    });
    setTimeout(() => {
      quickActionScale.value = withSpring(1, {
        duration: 150,
        dampingRatio: 0.6,
      });
      router.push('/add-record' as any);
    }, 100);
  };

  const handleQRScannerPress = () => {
    // SIMPLIFIED: Direct toggle without animation
    handleQRScannerToggle();
  };

  return (
    <>
      <LinearGradient
        colors={[BrandColors.cream, '#F8F4EB', '#F6F2E9', BrandColors.cream]}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>

        {/* Hero Section with QR Scanner - NO ANIMATION */}
        <Animated.View
          entering={FadeInDown.delay(50).springify()}
          style={styles.heroSection}>
          <LinearGradient
            colors={[BrandColors.deepTeal, BrandColors.primaryGreen]}
            locations={[0, 1]}
            style={styles.heroGradient}>

            {/* Header within Hero Section */}
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              style={styles.heroHeader}>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>Hello,</Text>
                <Text style={styles.userName}>Sarah</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.notificationButton}>
                  <Bell size={IconSizes.large} color="white" strokeWidth={STROKE_WIDTH} />
                  <View style={styles.notificationBadge}>
                    <LinearGradient
                      colors={[BrandColors.error, '#FF6B6B']}
                      style={styles.badgeGradient}>
                      <Text style={styles.badgeText}>3</Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={() => router.push('/profile' as any)}>
                  <View style={styles.profileGradientHero}>
                    <User size={IconSizes.medium} color={BrandColors.deepTeal} strokeWidth={STROKE_WIDTH} />
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* QR Scanner Interface */}
            <Animated.View
              entering={FadeInUp.delay(150).springify()}
              style={styles.qrScannerContainer}>
              <TouchableOpacity
                style={styles.qrScannerArea}
                onPress={handleQRScannerPress}>

                {/* Corner Brackets */}
                <View style={styles.cornerBrackets}>
                  <View style={[styles.cornerBracket, styles.topLeft]} />
                  <View style={[styles.cornerBracket, styles.topRight]} />
                  <View style={[styles.cornerBracket, styles.bottomLeft]} />
                  <View style={[styles.cornerBracket, styles.bottomRight]} />
                </View>

                {/* QR Icon and Content */}
                <View style={styles.qrContent}>
                  <QrCode size={24} color="rgba(255, 255, 255, 0.9)" strokeWidth={STROKE_WIDTH} />
                  <View style={styles.qrTextContainer}>
                    <Text style={styles.qrMainText}>
                      Tap to Scan
                    </Text>
                    <View style={styles.qrSubTextContainer}>
                      <Hand size={12} color="rgba(255, 255, 255, 0.8)" strokeWidth={STROKE_WIDTH} />
                      <Text style={styles.qrSubText}>QR Code</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Reassuring Message */}
              <Animated.View
                entering={FadeInUp.delay(200).springify()}
                style={styles.reassuringMessage}>
                <Shield size={20} color="rgba(255, 255, 255, 0.9)" strokeWidth={STROKE_WIDTH} />
                <Text style={styles.reassuringText}>Share your health ID instantly & securely</Text>
              </Animated.View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions - RIGHT AFTER HERO */}
        <Animated.View
          entering={FadeInUp.delay(250).springify()}
          style={styles.quickActionsContainer}>
        <View style={styles.quickActions}>
          <AnimatedTouchableOpacity
            style={[{ flex: 1 }, animatedQuickActionStyle]}
            onPress={handleAddRecordPress}>
            <View style={styles.quickActionCard}>
              <LinearGradient
                colors={['rgba(20, 160, 133, 0.03)', 'rgba(20, 160, 133, 0.01)']}
                style={styles.quickActionGradient}>
                <Plus size={IconSizes.xlarge} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                <Text style={styles.quickActionText} numberOfLines={1}>Add Record</Text>
              </LinearGradient>
            </View>
          </AnimatedTouchableOpacity>

          <AnimatedTouchableOpacity
            style={[{ flex: 1 }, animatedQuickActionStyle]}
            onPress={handleQuickActionPress}>
            <View style={styles.quickActionCard}>
              <LinearGradient
                colors={['rgba(20, 160, 133, 0.03)', 'rgba(20, 160, 133, 0.01)']}
                style={styles.quickActionGradient}>
                <Clock size={IconSizes.xlarge} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                <Text style={styles.quickActionText} numberOfLines={1}>Add Reminder</Text>
              </LinearGradient>
            </View>
          </AnimatedTouchableOpacity>
        </View>
        </Animated.View>

        {/* Content - NO ANIMATION */}
        <View>        {/* Padded Content Container */}
        <View style={styles.paddedContent}>

          {/* Today's Health - MOVED TO PRIORITY #1 */}
          {hasTodaysMedications && (
            <Animated.View
              entering={FadeInUp.delay(200).springify()}
              style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Health</Text>
              <AnimatedTouchableOpacity
                style={[styles.summaryCard, animatedCardStyle]}
                onPress={() => {
                  handleCardPress();
                  handleTodaysHealthPress();
                }}>
                <View style={styles.cardContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                    style={styles.cardGradient}>
                    <View style={styles.cardHeader}>
                      <Calendar size={IconSizes.large} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                      <Text style={styles.cardTitle}>Medications Due Today</Text>
                    </View>
                    <View style={styles.medicationList}>
                      {medications.map((medication) => (
                        <View key={medication.id} style={styles.medicationItem}>
                          <View style={[
                            styles.medicationDot, 
                            { backgroundColor: getUrgencyColor(medication.urgency) }
                          ]} />
                          <Text style={styles.medicationText}>
                            {medication.name} - {medication.time}
                          </Text>
                          <Text style={[
                            styles.medicationStatus,
                            { color: getUrgencyColor(medication.urgency) }
                          ]}>
                            {medication.status === 'completed' ? '✓' : 
                             medication.status === 'overdue' ? 'OVERDUE' : 'Pending'}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </LinearGradient>
                </View>
              </AnimatedTouchableOpacity>
            </Animated.View>
          )}

          {/* Health Alerts - MOVED TO PRIORITY #2 */}
          {hasHealthAlerts && (
            <Animated.View
              entering={FadeInUp.delay(250).springify()}
              style={styles.section}>
              <Text style={styles.sectionTitle}>Health Alerts</Text>
              <AnimatedTouchableOpacity
                style={[styles.alertCard, animatedCardStyle]}
                onPress={() => {
                  handleCardPress();
                  handleHealthAlertsPress();
                }}>
                <View style={styles.cardContainer}>
                  <LinearGradient
                    colors={['rgba(244, 162, 97, 0.08)', 'rgba(244, 162, 97, 0.04)']}
                    style={styles.cardGradient}>
                    <View style={styles.cardHeader}>
                      <Zap size={IconSizes.large} color={BrandColors.warning} strokeWidth={STROKE_WIDTH} />
                      <Text style={styles.cardTitle}>Health Alerts</Text>
                    </View>
                    <View style={styles.alertList}>
                      {alerts.map((alert) => (
                        <View key={alert.id} style={[
                          styles.alertItem,
                          { 
                            backgroundColor: getUrgencyBgColor(alert.urgency, 0.05),
                            borderLeftWidth: 3,
                            borderLeftColor: getUrgencyColor(alert.urgency),
                            paddingLeft: 12,
                            borderRadius: 6,
                          }
                        ]}>
                          <Text style={[
                            styles.alertText,
                            alert.urgency === 'critical' && { fontFamily: 'Outfit-SemiBold' }
                          ]}>
                            {alert.text}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </LinearGradient>
                </View>
              </AnimatedTouchableOpacity>
            </Animated.View>
          )}

          {/* Family Health - ELEVATED TO PRIORITY #4 */}
          {hasFamilyMembers && (
            <Animated.View
              entering={FadeInUp.delay(325).springify()}
              style={styles.section}>
              <View style={styles.familyHeader}>
                <Text style={styles.sectionTitle}>Family Health</Text>
              </View>
              <View style={styles.familyList}>
                {homepageFamilyMembers.map((member, index) => (
                  <Animated.View key={member.id} entering={FadeInUp.delay(350 + index * 25).springify()}>
                    <AnimatedTouchableOpacity
                      style={[styles.familyItem, animatedCardStyle]}
                      onPress={() => {
                        handleCardPress();
                        // Navigate to specific family member profile
                        router.push(`/family-profile/${member.id}` as any);
                      }}>
                      <View style={styles.familyContainer}>
                        <LinearGradient
                          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                          style={styles.familyGradient}>
                          <View style={styles.familyIcon}>
                            <Users size={IconSizes.medium} 
                                  color={member.urgency === 'urgent' ? BrandColors.urgent : 
                                         member.urgency === 'critical' ? BrandColors.critical : 
                                         BrandColors.primaryGreen} 
                                  strokeWidth={STROKE_WIDTH} />
                          </View>
                          <View style={styles.familyContent}>
                            <Text style={styles.familyName}>{member.name}</Text>
                            <Text style={[
                              styles.familyStatus,
                              member.urgency === 'urgent' && { color: BrandColors.urgent, fontFamily: 'Outfit-SemiBold' },
                              member.urgency === 'critical' && { color: BrandColors.critical, fontFamily: 'Outfit-SemiBold' }
                            ]}>
                              {member.quickStatus}
                            </Text>
                          </View>
                          <View style={styles.familyStatusIndicator}>
                            <View style={[styles.statusDot, { 
                              backgroundColor: member.urgency === 'urgent' ? BrandColors.urgent : 
                                               member.urgency === 'critical' ? BrandColors.critical : 
                                               BrandColors.primaryGreen 
                            }]} />
                          </View>
                        </LinearGradient>
                      </View>
                    </AnimatedTouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* My Conditions - MOVED TO PRIORITY #5 */}
          {hasConditions && (
            <Animated.View
              entering={FadeInUp.delay(400).springify()}
              style={styles.section}>
              <Text style={styles.sectionTitle}>My Conditions</Text>
              <AnimatedTouchableOpacity
                style={[styles.conditionsCard, animatedCardStyle]}
                onPress={() => {
                  handleCardPress();
                  handleMyConditionsPress();
                }}>
                <View style={styles.cardContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                    style={styles.cardGradient}>
                    <View style={styles.cardHeader}>
                      <Heart size={IconSizes.large} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                      <Text style={styles.cardTitle}>Ongoing Health Conditions</Text>
                    </View>
                    <View style={styles.conditionsList}>
                      <View style={styles.conditionItem}>
                        <View style={[styles.conditionDot, { backgroundColor: BrandColors.primaryGreen }]} />
                        <Text style={styles.conditionText}>Type 2 Diabetes - Well controlled</Text>
                      </View>
                      <View style={styles.conditionItem}>
                        <View style={[styles.conditionDot, { backgroundColor: BrandColors.mintGreen }]} />
                        <Text style={styles.conditionText}>Hypertension - Stable</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </AnimatedTouchableOpacity>
            </Animated.View>
          )}

          {/* Emergency Access - PRIORITY #6 */}
          {shouldShowEmergencyProfile && (
            <Animated.View
              entering={FadeInUp.delay(425).springify()}
              style={styles.section}>
              <AnimatedTouchableOpacity
                style={[styles.emergencyCard, animatedCardStyle]}
                onPress={() => {
                  handleCardPress();
                  handleEmergencyProfilePress();
                }}>
                <View style={styles.emergencyContainer}>
                  <LinearGradient
                    colors={['rgba(231, 111, 81, 0.08)', 'rgba(231, 111, 81, 0.04)']}
                    style={styles.cardGradient}>
                    <View style={styles.cardHeader}>
                      <Shield size={IconSizes.large} color={BrandColors.error} strokeWidth={STROKE_WIDTH} />
                      <Text style={styles.cardTitle}>Emergency Profile</Text>
                    </View>
                    <Text style={styles.emergencyText}>
                      Critical health information available offline
                    </Text>
                    <Text style={styles.emergencySubtext}>
                      Blood Type: O+ • Allergies: Penicillin • Emergency Contact: John (+1 555-0123)
                    </Text>
                  </LinearGradient>
                </View>
              </AnimatedTouchableOpacity>
            </Animated.View>
          )}

          {/* Enhanced Health Intelligence - PRIORITY #7 */}
          {showEnhancedIntelligence && (
            <Animated.View
              entering={FadeInUp.delay(450).springify()}
              style={styles.section}>
              <AnimatedTouchableOpacity
                style={[styles.intelligenceCard, animatedCardStyle]}
                onPress={() => {
                  handleCardPress();
                  router.push('/satronis-demo');
                }}>
                <View style={styles.intelligenceContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                    style={styles.cardGradient}>
                    <View style={styles.cardHeader}>
                      <View style={styles.intelligenceIconContainer}>
                        <LinearGradient
                          colors={[BrandColors.deepTeal, BrandColors.primaryGreen, BrandColors.mintGreen]}
                          style={styles.intelligenceIconGradient}>
                          <Sparkles size={IconSizes.medium} color="white" strokeWidth={STROKE_WIDTH} />
                        </LinearGradient>
                      </View>
                      <View style={styles.intelligenceHeaderText}>
                        <Text style={styles.cardTitle}>Enhanced Health Intelligence</Text>
                        <Text style={styles.intelligenceSubtitle}>AI-powered insights for better care</Text>
                      </View>
                    </View>
                    <Text style={styles.intelligenceDescription}>
                      Transform complex medical documents into clear, understandable insights with our advanced AI assistant
                    </Text>
                    <View style={styles.intelligenceFeatures}>
                      <View style={styles.featureRow}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Patient-friendly explanations</Text>
                      </View>
                      <View style={styles.featureRow}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Confidence-based insights</Text>
                      </View>
                      <View style={styles.featureRow}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Source-verified information</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </AnimatedTouchableOpacity>
            </Animated.View>
          )}

          {/* Bottom spacing for tab bar */}
          <View style={styles.bottomSpacing} />
        </View>
        </View>
      </ScrollView>
      
      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          visible={showQRScanner}
          onClose={() => {
            setShowQRScanner(false);
            setIsQRScannerOpen(false); // Hide tab bar
          }}
          onScanSuccess={(data: string) => {
            console.log('QR Scanned:', data);
            setScannedQRData(data);
            setShowQRScanner(false);
            setIsQRScannerOpen(false); // Show tab bar again
            // Trigger medical sharing flow
            setShowMedicalSharing(true);
            setIsMedicalSharingOpen(true); // Hide tab bar for medical sharing
          }}
        />
      )}

      {/* Medical Sharing Flow */}
      <MedicalSharingFlow
        visible={showMedicalSharing}
        onClose={() => {
          setShowMedicalSharing(false);
          setIsMedicalSharingOpen(false); // Show tab bar when medical sharing closes
        }}
        qrData={scannedQRData}
      />
    </LinearGradient>

    <EmergencyProfileModal
      visible={showEmergencyProfile}
      onClose={() => setShowEmergencyProfile(false)}
    />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Hero Section Styles
  heroSection: {
    width: '100%', // Full width, borderless
  },
  heroGradient: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 50, // Status bar padding
    paddingBottom: Spacing.md,
    borderBottomLeftRadius: 40, // Apply rounding to gradient itself
    borderBottomRightRadius: 40, // Apply rounding to gradient itself
    overflow: 'hidden', // Ensure content respects border radius
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg, // Reduced from xl to lg
  },

  // QR Scanner Styles
  qrScannerContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  qrScannerArea: {
    width: 140, // Reduced from 280 to 140 (50%)
    height: 140, // Reduced from 280 to 140 (50%)
    borderRadius: BorderRadius.md, // Reduced from lg to md
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: Spacing.sm, // Reduced from lg to sm
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 }, // Reduced shadow
    shadowOpacity: 0.2, // Reduced shadow opacity
    shadowRadius: 8, // Reduced shadow radius
    elevation: 4, // Reduced elevation
  },
  cornerBrackets: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cornerBracket: {
    position: 'absolute',
    width: 15, // Reduced from 30 to 15 (50%)
    height: 15, // Reduced from 30 to 15 (50%)
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2, // Reduced from 3 to 2
  },
  topLeft: {
    top: 8, // Reduced from 15 to 8
    left: 8, // Reduced from 15 to 8
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4, // Reduced from 8 to 4
  },
  topRight: {
    top: 8, // Reduced from 15 to 8
    right: 8, // Reduced from 15 to 8
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4, // Reduced from 8 to 4
  },
  bottomLeft: {
    bottom: 8, // Reduced from 15 to 8
    left: 8, // Reduced from 15 to 8
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4, // Reduced from 8 to 4
  },
  bottomRight: {
    bottom: 8, // Reduced from 15 to 8
    right: 8, // Reduced from 15 to 8
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4, // Reduced from 8 to 4
  },
  qrContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrTextContainer: {
    alignItems: 'center',
    marginTop: Spacing.xs, // Further reduced for compact layout
  },
  qrMainText: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14, // Custom smaller size for compact area
    color: 'white',
    textAlign: 'center',
    marginBottom: 2, // Minimal spacing
    letterSpacing: 0.2,
  },
  qrSubTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Minimal gap
  },
  qrSubText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 11, // Smaller font for subtitle
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  reassuringMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs, // Reduced from sm to xs
    paddingHorizontal: Spacing.md, // Reduced from lg to md
  },
  reassuringText: {
    ...Typography.body.medium, // Reduced from large to medium
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontFamily: 'Outfit-Medium',
  },

  scrollView: {
    flex: 1,
  },
  paddedContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md, // Add small top padding for better separation from quick actions
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  greeting: {
    ...Typography.heading.hero,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    ...Typography.heading.hero,
    color: 'white',
    marginLeft: Spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  notificationButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  profileButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileGradientHero: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 10,
    width: 20,
    height: 20,
    overflow: 'hidden',
    shadowColor: BrandColors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...Typography.ui.caption,
    color: 'white',
    fontFamily: 'Outfit-Bold',
    fontSize: 10,
  },
  section: {
    marginBottom: Spacing.lg, // Reduced from xl for better space efficiency
  },
  sectionTitle: {
    ...Typography.heading.medium,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.md,
  },
  quickActionsContainer: {
    width: '100%',
    paddingHorizontal: Spacing.lg, // Add horizontal padding since it's outside padded content
    paddingTop: Spacing.lg, // Small top padding after hero
    paddingBottom: Spacing.lg, // Add bottom padding for proper spacing before next section
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
    alignItems: 'stretch', // Ensure equal height and proper alignment
  },
  quickActionCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: BrandColors.white,
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 160, 133, 0.1)',
  },
  quickActionGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  quickActionText: {
    ...Typography.ui.button,
    color: BrandColors.textPrimary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    flexShrink: 0, // Prevent text from shrinking
  },
  summaryCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  cardContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: BrandColors.white,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 160, 133, 0.1)',
  },
  cardGradient: {
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    ...Typography.heading.small,
    color: BrandColors.textPrimary,
    marginLeft: Spacing.md,
  },
  healthMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    ...Typography.metric.large,
    color: BrandColors.primaryGreen,
    marginBottom: Spacing.xs,
  },
  metricLabel: {
    ...Typography.metric.label,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
  emergencyCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: BrandColors.error,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  emergencyContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: 'rgba(231, 111, 81, 0.15)',
  },
  emergencyText: {
    ...Typography.heading.tiny,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emergencySubtext: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
  },
  activityList: {
    gap: Spacing.sm,
  },
  activityItem: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activityContainer: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: BrandColors.white,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 160, 133, 0.08)',
  },
  activityGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 160, 133, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...Typography.heading.tiny,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  activityTime: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
  },
  statusIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BrandColors.primaryGreen,
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 3,
  },
  bottomSpacing: {
    height: 120,
  },

  // New Section Styles
  medicationList: {
    gap: Spacing.sm,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  medicationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BrandColors.primaryGreen,
    marginRight: Spacing.sm,
  },
  medicationText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    flex: 1,
  },
  medicationStatus: {
    ...Typography.body.small,
    color: BrandColors.primaryGreen,
    fontFamily: 'Outfit-Medium',
  },

  // Health Alerts Styles
  alertCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: BrandColors.warning,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  alertList: {
    gap: Spacing.sm,
  },
  alertItem: {
    paddingVertical: Spacing.xs,
  },
  alertText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
  },

  // Conditions Styles
  conditionsCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  conditionsList: {
    gap: Spacing.sm,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  conditionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.sm,
  },
  conditionText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    flex: 1,
  },

  // Family Health Styles
  familyHeader: {
    marginBottom: Spacing.md,
  },
  familyList: {
    gap: Spacing.sm,
  },
  familyItem: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  familyContainer: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: BrandColors.white,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 160, 133, 0.08)',
  },
  familyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  familyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 160, 133, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  familyContent: {
    flex: 1,
  },
  familyName: {
    ...Typography.heading.tiny,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  familyStatus: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
  },
  familyStatusIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Enhanced Intelligence Card Styles (SATRONIS)
  intelligenceCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  intelligenceContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: BrandColors.white,
    borderWidth: 0.5,
    borderColor: 'rgba(13, 115, 119, 0.12)',
  },
  intelligenceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 16,
  },
  intelligenceIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  intelligenceHeaderText: {
    flex: 1,
  },
  intelligenceSubtitle: {
    ...Typography.satronis.subtitle,
    color: BrandColors.mintGreen,
    marginTop: 2,
  },
  intelligenceDescription: {
    ...Typography.satronis.description,
    color: BrandColors.textSecondary,
    marginBottom: Spacing.lg,
  },
  intelligenceFeatures: {
    gap: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.primaryGreen,
    marginRight: 12,
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
  },
  featureText: {
    fontSize: 15,
    fontFamily: 'Outfit-Medium',
    color: BrandColors.textPrimary,
    flex: 1,
  },
});