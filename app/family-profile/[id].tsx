import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
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
  Heart,
  Pill,
  Calendar,
  FileText,
  Phone,
  MapPin,
  CreditCard,
  Users,
  Bell,
  Activity,
  Thermometer,
  Weight,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Edit3,
  Share2,
} from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { BrandColors, Typography } from '@/constants/Typography';
import { getFamilyMemberById } from '@/constants/FamilyData';

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

export default function FamilyProfileScreen() {
  const { id, tab } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState(tab ? tab as string : 'overview');
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

  // Dynamic family member data based on ID
  const getFamilyMemberData = (memberId: string | string[]) => {
    const familyMembers = {
      '1': {
        id: '1',
        name: 'John Chen',
        relationship: 'Husband',
        age: 47,
        healthStatus: 'stable',
        initials: 'JC',
        medicalInfo: {
          bloodGroup: 'O+',
          allergies: ['Penicillin', 'Shellfish'],
          chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
          currentMedications: [
            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', nextRefill: '2024-10-20' },
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', nextRefill: '2024-10-15' },
          ],
          vitals: {
            lastBP: '130/85',
            lastWeight: '80kg',
            lastSugar: '140 mg/dL',
            lastTemp: '98.4°F',
            recordedDate: '2024-09-21'
          }
        },
        healthcare: {
          primaryDoctor: {
            name: 'Dr. Sarah Kim',
            specialty: 'Internal Medicine',
            hospital: 'Apollo Hospital Delhi',
            phone: '+91-11-2612-3456',
            location: 'New Delhi'
          },
          insurance: {
            type: 'Private Insurance',
            cardNumber: 'INS987654321',
            validTill: '2025-12-31',
            dependents: 3
          },
          appointments: [
            {
              doctor: 'Dr. Sarah Kim',
              specialty: 'Internal Medicine',
              date: '2024-10-18',
              time: '11:00 AM',
              hospital: 'Apollo Hospital Delhi',
              type: 'Regular Check-up'
            }
          ]
        },
        // Family Context
        emergencyContacts: [
          { name: 'Emma Chen', relation: 'Daughter', phone: '+91-98765-43211' },
          { name: 'Dr. Sarah Kim', relation: 'Primary Care', phone: '+91-11-2612-3456' },
        ],
        recentActivity: [
          { type: 'medication', message: 'Took Lisinopril 10mg', time: '3 hours ago' },
          { type: 'vitals', message: 'Blood pressure recorded: 128/82', time: '2 days ago' },
          { type: 'appointment', message: 'Visited Dr. Sarah Kim', time: '2 weeks ago' },
        ]
      },
      '2': {
        id: '2',
        name: 'Emma Chen',
        relationship: 'Daughter',
        age: 16,
        healthStatus: 'excellent',
        initials: 'EC',
        medicalInfo: {
          bloodGroup: 'A+',
          allergies: ['Tree nuts'],
          chronicConditions: [],
          currentMedications: [],
          vitals: {
            lastBP: '110/70',
            lastWeight: '55kg',
            lastSugar: 'N/A',
            lastTemp: '98.2°F',
            recordedDate: '2024-09-19'
          }
        },
        healthcare: {
          primaryDoctor: {
            name: 'Dr. Maria Rodriguez',
            specialty: 'Pediatrics',
            hospital: 'Fortis Hospital Delhi',
            phone: '+91-11-4567-8901',
            location: 'New Delhi'
          },
          insurance: {
            type: 'Family Coverage',
            cardNumber: 'FAM123456789',
            validTill: '2025-12-31',
            dependents: 0
          },
          appointments: [
            {
              doctor: 'Dr. Maria Rodriguez',
              specialty: 'Pediatrics',
              date: '2024-11-05',
              time: '3:00 PM',
              hospital: 'Fortis Hospital Delhi',
              type: 'Annual Check-up'
            }
          ]
        },
        // Family Context
        emergencyContacts: [
          { name: 'John Chen', relation: 'Father', phone: '+91-98765-43210' },
          { name: 'Dr. Maria Rodriguez', relation: 'Pediatrician', phone: '+91-11-4567-8901' },
        ],
        recentActivity: [
          { type: 'appointment', message: 'School health check completed', time: '1 week ago' },
          { type: 'vitals', message: 'Height/weight recorded', time: '1 week ago' },
          { type: 'vaccination', message: 'Annual flu shot', time: '2 months ago' },
        ]
      },
      '3': {
        id: '3',
        name: 'Robert Chen',
        relationship: 'Father',
        age: 72,
        healthStatus: 'needs-attention',
        initials: 'RC',
        medicalInfo: {
          bloodGroup: 'O-',
          allergies: ['Sulfa drugs', 'Iodine'],
          chronicConditions: ['Heart Disease', 'COPD', 'Arthritis', 'High Cholesterol'],
          currentMedications: [
            { name: 'Carvedilol', dosage: '25mg', frequency: 'Twice daily', nextRefill: '2024-10-15' },
            { name: 'Albuterol Inhaler', dosage: '2 puffs', frequency: 'As needed', nextRefill: '2024-10-20' },
            { name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily', nextRefill: '2024-10-12' },
            { name: 'Warfarin', dosage: '5mg', frequency: 'Once daily', nextRefill: '2024-10-18' },
          ],
          vitals: {
            lastBP: '140/90',
            lastWeight: '75kg',
            lastSugar: 'N/A',
            lastTemp: '98.6°F',
            recordedDate: '2024-09-20'
          }
        },
        healthcare: {
          primaryDoctor: {
            name: 'Dr. James Park',
            specialty: 'Cardiologist',
            hospital: 'AIIMS Delhi',
            phone: '+91-11-2658-8500',
            location: 'New Delhi'
          },
          insurance: {
            type: 'CGHS',
            cardNumber: 'CGHS123456789',
            validTill: '2025-12-31',
            dependents: 4
          },
          appointments: [
            {
              doctor: 'Dr. James Park',
              specialty: 'Cardiology',
              date: '2024-10-15',
              time: '10:00 AM',
              hospital: 'AIIMS Delhi',
              type: 'Follow-up'
            },
            {
              doctor: 'Dr. Priya Sharma',
              specialty: 'Pulmonology',
              date: '2024-10-22',
              time: '2:30 PM',
              hospital: 'Safdarjung Hospital',
              type: 'Routine Check-up'
            }
          ]
        },
        // Family Context
        emergencyContacts: [
          { name: 'John Chen', relation: 'Son', phone: '+91-98765-43210' },
          { name: 'Dr. James Park', relation: 'Cardiologist', phone: '+91-11-2658-8500' },
        ],
        recentActivity: [
          { type: 'medication', message: 'Took Carvedilol 25mg', time: '2 hours ago' },
          { type: 'vitals', message: 'Blood pressure recorded: 138/88', time: '1 day ago' },
          { type: 'appointment', message: 'Visited Dr. James Park', time: '1 week ago' },
        ]
      }
    };

    return familyMembers[memberId as keyof typeof familyMembers] || familyMembers['3'];
  };

  const familyMember = getFamilyMemberData(id);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return BrandColors.completed;
      case 'stable': return BrandColors.primaryGreen;
      case 'needs-attention': return BrandColors.warning;
      case 'critical': return BrandColors.critical;
      default: return BrandColors.neutral;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverview();
      case 'medications':
        return renderMedications();
      case 'appointments':
        return renderAppointments();
      case 'documents':
        return renderDocuments();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Vitals Card */}
      <Animated.View 
        entering={FadeInUp.delay(100).springify()}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Vitals</Text>
        <View style={styles.vitalsGrid}>
          <View style={styles.vitalCard}>
            <Heart size={IconSizes.large} color={BrandColors.critical} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.vitalValue}>{familyMember.medicalInfo.vitals.lastBP}</Text>
            <Text style={styles.vitalLabel}>Blood Pressure</Text>
          </View>
          <View style={styles.vitalCard}>
            <Weight size={IconSizes.large} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.vitalValue}>{familyMember.medicalInfo.vitals.lastWeight}</Text>
            <Text style={styles.vitalLabel}>Weight</Text>
          </View>
          <View style={styles.vitalCard}>
            <Thermometer size={IconSizes.large} color={BrandColors.warning} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.vitalValue}>{familyMember.medicalInfo.vitals.lastTemp}</Text>
            <Text style={styles.vitalLabel}>Temperature</Text>
          </View>
        </View>
        <Text style={styles.vitalsDate}>Last recorded: {familyMember.medicalInfo.vitals.recordedDate}</Text>
      </Animated.View>

      {/* Health Status */}
      <Animated.View 
        entering={FadeInUp.delay(200).springify()}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Health Status</Text>
        <View style={styles.conditionsContainer}>
          {familyMember.medicalInfo.chronicConditions.map((condition, index) => (
            <View key={index} style={styles.conditionChip}>
              <Text style={styles.conditionText}>{condition}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Recent Activity */}
      <Animated.View 
        entering={FadeInUp.delay(300).springify()}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {familyMember.recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                {activity.type === 'medication' && <Pill size={IconSizes.small} color={BrandColors.primaryGreen} />}
                {activity.type === 'vitals' && <Activity size={IconSizes.small} color={BrandColors.warning} />}
                {activity.type === 'appointment' && <Calendar size={IconSizes.small} color={BrandColors.deepTeal} />}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityMessage}>{activity.message}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );

  const renderMedications = () => (
    <View style={styles.tabContent}>
      <Animated.View 
        entering={FadeInUp.delay(100).springify()}
        style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={IconSizes.medium} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.medicationsList}>
          {familyMember.medicalInfo.currentMedications.map((medication, index) => (
            <Animated.View 
              key={index}
              entering={FadeInUp.delay(150 + index * 50).springify()}
              style={styles.medicationCard}>
              <View style={styles.medicationHeader}>
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{medication.name}</Text>
                  <Text style={styles.medicationDosage}>{medication.dosage} • {medication.frequency}</Text>
                </View>
                <TouchableOpacity style={styles.medicationAction}>
                  <Edit3 size={IconSizes.small} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
                </TouchableOpacity>
              </View>
              <View style={styles.medicationFooter}>
                <Text style={styles.refillDate}>Next refill: {medication.nextRefill}</Text>
                <View style={[styles.refillStatus, { backgroundColor: new Date(medication.nextRefill) < new Date() ? BrandColors.critical + '20' : BrandColors.completed + '20' }]}>
                  <Text style={[styles.refillStatusText, { color: new Date(medication.nextRefill) < new Date() ? BrandColors.critical : BrandColors.completed }]}>
                    {new Date(medication.nextRefill) < new Date() ? 'Overdue' : 'On Track'}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </View>
  );

  const renderAppointments = () => (
    <View style={styles.tabContent}>
      <Animated.View 
        entering={FadeInUp.delay(100).springify()}
        style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={IconSizes.medium} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.appointmentsList}>
          {familyMember.healthcare.appointments.map((appointment, index) => (
            <Animated.View 
              key={index}
              entering={FadeInUp.delay(150 + index * 50).springify()}
              style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <View style={styles.appointmentDate}>
                  <Text style={styles.appointmentDay}>{new Date(appointment.date).getDate()}</Text>
                  <Text style={styles.appointmentMonth}>{new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}</Text>
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentDoctor}>{appointment.doctor}</Text>
                  <Text style={styles.appointmentSpecialty}>{appointment.specialty}</Text>
                  <View style={styles.appointmentDetails}>
                    <Clock size={IconSizes.small} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
                    <Text style={styles.appointmentTime}>{appointment.time}</Text>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <MapPin size={IconSizes.small} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
                    <Text style={styles.appointmentHospital}>{appointment.hospital}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.appointmentAction}>
                  <Phone size={IconSizes.medium} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </View>
  );

  const renderDocuments = () => (
    <View style={styles.tabContent}>
      <Animated.View 
        entering={FadeInUp.delay(100).springify()}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Documents</Text>
        <View style={styles.documentsGrid}>
          <TouchableOpacity style={styles.documentCard}>
            <FileText size={IconSizes.xlarge} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.documentTitle}>Lab Reports</Text>
            <Text style={styles.documentCount}>12 files</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentCard}>
            <CreditCard size={IconSizes.xlarge} color={BrandColors.deepTeal} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.documentTitle}>Insurance</Text>
            <Text style={styles.documentCount}>CGHS Card</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentCard}>
            <Heart size={IconSizes.xlarge} color={BrandColors.critical} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.documentTitle}>Prescriptions</Text>
            <Text style={styles.documentCount}>8 files</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.documentCard}>
            <Users size={IconSizes.xlarge} color={BrandColors.warning} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.documentTitle}>Emergency</Text>
            <Text style={styles.documentCount}>Contacts</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );

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
        
        <View style={styles.profileHeader}>
          <View style={[styles.profileAvatar, { backgroundColor: `${getHealthStatusColor(familyMember.healthStatus)}15` }]}>
            <Text style={[styles.profileInitials, { color: getHealthStatusColor(familyMember.healthStatus) }]}>
              {familyMember.initials}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{familyMember.name}</Text>
            <Text style={styles.profileRelation}>{familyMember.relationship} • {familyMember.age} years</Text>
            <View style={styles.healthStatusBadge}>
              <View style={[styles.statusIndicator, { backgroundColor: getHealthStatusColor(familyMember.healthStatus) }]} />
              <Text style={styles.healthStatusText}>{familyMember.healthStatus.replace('-', ' ')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={IconSizes.medium} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, selectedTab === tab.id && styles.activeTabButton]}
            onPress={() => setSelectedTab(tab.id)}>
            <tab.icon 
              size={IconSizes.medium} 
              color={selectedTab === tab.id ? BrandColors.primaryGreen : BrandColors.textSecondary} 
              strokeWidth={STROKE_WIDTH} 
            />
            <Text style={[styles.tabLabel, selectedTab === tab.id && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  profileInitials: {
    ...Typography.heading.medium,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.heading.large,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  profileRelation: {
    ...Typography.body.large,
    color: BrandColors.textSecondary,
    marginBottom: Spacing.sm,
  },
  healthStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  healthStatusText: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  shareButton: {
    padding: Spacing.sm,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.neutral + '20',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: BrandColors.primaryGreen,
  },
  tabLabel: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textSecondary,
  },
  activeTabLabel: {
    color: BrandColors.primaryGreen,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: BrandColors.cream,
  },
  tabContent: {
    padding: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading.medium,
    color: BrandColors.textPrimary,
  },
  addButton: {
    padding: Spacing.sm,
  },
  vitalsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  vitalCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  vitalValue: {
    ...Typography.heading.medium,
    color: BrandColors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  vitalLabel: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
  vitalsDate: {
    ...Typography.body.small,
    color: BrandColors.textTertiary,
    textAlign: 'center',
  },
  conditionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  conditionChip: {
    backgroundColor: BrandColors.warning + '20',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  conditionText: {
    ...Typography.ui.labelSmall,
    color: BrandColors.warning,
    fontWeight: '600',
  },
  activityList: {
    gap: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BrandColors.neutral + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  activityTime: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textTertiary,
  },
  medicationsList: {
    gap: Spacing.md,
  },
  medicationCard: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    ...Typography.body.large,
    color: BrandColors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  medicationDosage: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
  },
  medicationAction: {
    padding: Spacing.sm,
  },
  medicationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refillDate: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textTertiary,
  },
  refillStatus: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  refillStatusText: {
    ...Typography.ui.labelSmall,
    fontWeight: '600',
  },
  appointmentsList: {
    gap: Spacing.md,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  appointmentDate: {
    alignItems: 'center',
    marginRight: Spacing.lg,
    backgroundColor: BrandColors.primaryGreen + '10',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minWidth: 60,
  },
  appointmentDay: {
    ...Typography.heading.medium,
    color: BrandColors.primaryGreen,
    fontWeight: '700',
  },
  appointmentMonth: {
    ...Typography.ui.labelSmall,
    color: BrandColors.primaryGreen,
    textTransform: 'uppercase',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDoctor: {
    ...Typography.body.large,
    color: BrandColors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  appointmentSpecialty: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    marginBottom: Spacing.sm,
  },
  appointmentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  appointmentTime: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textSecondary,
    marginLeft: Spacing.sm,
  },
  appointmentHospital: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textSecondary,
    marginLeft: Spacing.sm,
  },
  appointmentAction: {
    padding: Spacing.sm,
  },
  documentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  documentCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  documentTitle: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  documentCount: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textSecondary,
  },
  bottomSpacing: {
    height: 80,
  },
});