import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandColors, Typography } from '@/constants/Typography';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {
  X,
  Download,
  Share2,
  Star,
  Calendar,
  User,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Activity,
  FileText,
  Image as ImageIcon,
  Heart,
  Scissors,
  Shield,
  Zap,
  Pill,
  ChevronRight,
  ExternalLink,
} from 'lucide-react-native';
import AISummaryComponent from '@/components/AISummaryComponent';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Consistent Design System
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

interface RecordDetailModalProps {
  record: any;
  visible: boolean;
  onClose: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedModal = Animated.createAnimatedComponent(Modal);

export default function RecordDetailModal({ record, visible, onClose }: RecordDetailModalProps) {
  // Enhanced animation system for multiple buttons
  const shareButtonScale = useSharedValue(1);
  const downloadButtonScale = useSharedValue(1);
  const primaryButtonScale = useSharedValue(1);
  
  // Sophisticated modal animation values
  const modalTranslateY = useSharedValue(screenHeight);
  const modalScale = useSharedValue(0.95);
  const overlayOpacity = useSharedValue(0);

  // Smooth animated styles for modal
  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: modalTranslateY.value
    }, {
      scale: modalScale.value
    }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  // Smooth animation functions
  const showModal = () => {
    overlayOpacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    modalTranslateY.value = withTiming(0, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    });
    modalScale.value = withTiming(1, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    });
  };

  const hideModal = () => {
    overlayOpacity.value = withTiming(0, {
      duration: 250,
      easing: Easing.in(Easing.ease),
    });
    modalTranslateY.value = withTiming(screenHeight, {
      duration: 300,
      easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
    });
    modalScale.value = withTiming(0.95, {
      duration: 300,
      easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
    }, () => {
      runOnJS(onClose)();
    });
  };

  // Handle modal visibility changes
  useEffect(() => {
    if (visible) {
      showModal();
    } else {
      modalTranslateY.value = screenHeight;
      modalScale.value = 0.95;
      overlayOpacity.value = 0;
    }
  }, [visible]);

  const animatedShareButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shareButtonScale.value }],
  }));

  const animatedDownloadButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: downloadButtonScale.value }],
  }));

  const animatedPrimaryButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: primaryButtonScale.value }],
  }));

  const handleButtonPress = (buttonType: 'share' | 'download' | 'primary') => {
    const scaleValue = buttonType === 'share' ? shareButtonScale : 
                     buttonType === 'download' ? downloadButtonScale : 
                     primaryButtonScale;
    
    scaleValue.value = withSpring(0.96, { duration: 100 });
    setTimeout(() => {
      scaleValue.value = withSpring(1, { duration: 150 });
    }, 100);
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'critical': return BrandColors.error;
      case 'attention': return BrandColors.warning;
      case 'monitor': return BrandColors.deepTeal;
      default: return BrandColors.primaryGreen;
    }
  };

  const handleShare = () => {
    Alert.alert('Share Record', 'Share functionality would be implemented here');
  };

  const handleDownload = () => {
    Alert.alert('Download Record', 'Download functionality would be implemented here');
  };

  const handleScheduleFollowUp = () => {
    Alert.alert('Follow-up', 'Calendar integration would be implemented here');
  };

  const renderLabReportContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Test Results</Text>
      <View style={styles.labResultsContainer}>
        {record.data.values.map((result: any, index: number) => (
          <View key={index} style={styles.labResultItem}>
            <View style={styles.labResultHeader}>
              <Text style={styles.labTestName}>{result.test}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: result.status === 'high' ? `${BrandColors.error}15` : `${BrandColors.primaryGreen}15` }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: result.status === 'high' ? BrandColors.error : BrandColors.primaryGreen }
                ]}>
                  {result.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.labResultValues}>
              <Text style={styles.labResultValue}>{result.value}</Text>
              <Text style={styles.labResultRange}>Normal: {result.range}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderImagingContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Imaging Study</Text>
      <View style={styles.imagingContainer}>
        <View style={styles.imagePlaceholder}>
          <ImageIcon size={IconSizes.xlarge} color={BrandColors.textTertiary} strokeWidth={STROKE_WIDTH} />
          <Text style={styles.imagePlaceholderText}>Image viewer would be implemented here</Text>
        </View>
        <View style={styles.findingsContainer}>
          <Text style={styles.findingsTitle}>Findings</Text>
          <Text style={styles.findingsText}>{record.data.findings}</Text>
        </View>
      </View>
    </View>
  );

  const renderPrescriptionContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Prescription Details</Text>
      <View style={styles.prescriptionContainer}>
        <View style={styles.prescriptionItem}>
          <Text style={styles.prescriptionLabel}>Medication</Text>
          <Text style={styles.prescriptionValue}>{record.data.medication}</Text>
        </View>
        <View style={styles.prescriptionItem}>
          <Text style={styles.prescriptionLabel}>Dosage</Text>
          <Text style={styles.prescriptionValue}>{record.data.dosage}</Text>
        </View>
        <View style={styles.prescriptionItem}>
          <Text style={styles.prescriptionLabel}>Frequency</Text>
          <Text style={styles.prescriptionValue}>{record.data.frequency}</Text>
        </View>
        <View style={styles.prescriptionItem}>
          <Text style={styles.prescriptionLabel}>Quantity</Text>
          <Text style={styles.prescriptionValue}>{record.data.quantity}</Text>
        </View>
        <View style={styles.prescriptionItem}>
          <Text style={styles.prescriptionLabel}>Refills Remaining</Text>
          <Text style={styles.prescriptionValue}>{record.data.refills}</Text>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>{record.data.instructions}</Text>
        </View>
      </View>
    </View>
  );

  const renderConsultationContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Consultation Summary</Text>
      <View style={styles.consultationContainer}>
        <View style={styles.consultationItem}>
          <Text style={styles.consultationLabel}>Chief Complaint</Text>
          <Text style={styles.consultationValue}>{record.data.chiefComplaint}</Text>
        </View>
        <View style={styles.consultationItem}>
          <Text style={styles.consultationLabel}>Findings</Text>
          <Text style={styles.consultationValue}>{record.data.findings}</Text>
        </View>
        <View style={styles.consultationItem}>
          <Text style={styles.consultationLabel}>Recommendations</Text>
          <Text style={styles.consultationValue}>{record.data.recommendations}</Text>
        </View>
        {record.data.nextAppointment && (
          <View style={styles.nextAppointmentContainer}>
            <Calendar size={IconSizes.medium} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
            <View style={styles.nextAppointmentText}>
              <Text style={styles.nextAppointmentLabel}>Next Appointment</Text>
              <Text style={styles.nextAppointmentDate}>{record.data.nextAppointment}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderImplantContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Implant Information</Text>
      <View style={styles.implantContainer}>
        <View style={styles.implant3DContainer}>
          <Heart size={IconSizes.xlarge} color={BrandColors.deepTeal} strokeWidth={STROKE_WIDTH} />
          <Text style={styles.implant3DText}>3D model viewer would be implemented here</Text>
        </View>
        <View style={styles.implantDetails}>
          <View style={styles.implantItem}>
            <Text style={styles.implantLabel}>Type</Text>
            <Text style={styles.implantValue}>{record.data.implantType}</Text>
          </View>
          <View style={styles.implantItem}>
            <Text style={styles.implantLabel}>Material</Text>
            <Text style={styles.implantValue}>{record.data.material}</Text>
          </View>
          <View style={styles.implantItem}>
            <Text style={styles.implantLabel}>Location</Text>
            <Text style={styles.implantValue}>{record.data.location}</Text>
          </View>
          <View style={styles.implantItem}>
            <Text style={styles.implantLabel}>Model</Text>
            <Text style={styles.implantValue}>{record.data.model}</Text>
          </View>
          {record.data.nextCheckup && (
            <View style={styles.nextCheckupContainer}>
              <AlertCircle size={IconSizes.medium} color={getUrgencyColor(record.urgency)} strokeWidth={STROKE_WIDTH} />
              <View style={styles.nextCheckupText}>
                <Text style={styles.nextCheckupLabel}>Next Checkup</Text>
                <Text style={styles.nextCheckupDate}>{record.data.nextCheckup}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderSurgeryContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Surgery Details</Text>
      <View style={styles.surgeryContainer}>
        <View style={styles.timelineContainer}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Scissors size={IconSizes.small} color="white" strokeWidth={STROKE_WIDTH} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Procedure</Text>
              <Text style={styles.timelineText}>{record.data.procedure}</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Clock size={IconSizes.small} color="white" strokeWidth={STROKE_WIDTH} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Duration</Text>
              <Text style={styles.timelineText}>{record.data.duration}</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <CheckCircle size={IconSizes.small} color="white" strokeWidth={STROKE_WIDTH} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Recovery</Text>
              <Text style={styles.timelineText}>{record.data.recovery}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderVaccineContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Vaccination Record</Text>
      <View style={styles.vaccineContainer}>
        <View style={styles.vaccineItem}>
          <Text style={styles.vaccineLabel}>Vaccine</Text>
          <Text style={styles.vaccineValue}>{record.data.vaccine}</Text>
        </View>
        <View style={styles.vaccineItem}>
          <Text style={styles.vaccineLabel}>Lot Number</Text>
          <Text style={styles.vaccineValue}>{record.data.lot}</Text>
        </View>
        <View style={styles.vaccineItem}>
          <Text style={styles.vaccineLabel}>Injection Site</Text>
          <Text style={styles.vaccineValue}>{record.data.site}</Text>
        </View>
        <View style={styles.vaccineItem}>
          <Text style={styles.vaccineLabel}>Next Due</Text>
          <Text style={styles.vaccineValue}>{record.data.nextDue}</Text>
        </View>
        {record.data.reactions !== 'None reported' && (
          <View style={styles.reactionsContainer}>
            <Text style={styles.reactionsTitle}>Reactions</Text>
            <Text style={styles.reactionsText}>{record.data.reactions}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderEmergencyContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Emergency Visit</Text>
      <View style={styles.emergencyContainer}>
        <View style={styles.emergencyItem}>
          <Text style={styles.emergencyLabel}>Chief Complaint</Text>
          <Text style={styles.emergencyValue}>{record.data.chiefComplaint}</Text>
        </View>
        <View style={styles.emergencyItem}>
          <Text style={styles.emergencyLabel}>Triage Level</Text>
          <Text style={styles.emergencyValue}>{record.data.triage}</Text>
        </View>
        <View style={styles.emergencyItem}>
          <Text style={styles.emergencyLabel}>Diagnosis</Text>
          <Text style={styles.emergencyValue}>{record.data.diagnosis}</Text>
        </View>
        <View style={styles.emergencyItem}>
          <Text style={styles.emergencyLabel}>Treatment</Text>
          <Text style={styles.emergencyValue}>{record.data.treatment}</Text>
        </View>
        <View style={styles.emergencyItem}>
          <Text style={styles.emergencyLabel}>Disposition</Text>
          <Text style={styles.emergencyValue}>{record.data.disposition}</Text>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch(record.contentType) {
      case 'table': return renderLabReportContent();
      case 'image': return renderImagingContent();
      case 'prescription': return renderPrescriptionContent();
      case 'consultation': return renderConsultationContent();
      case '3d': return renderImplantContent();
      case 'timeline': return renderSurgeryContent();
      case 'vaccine': return renderVaccineContent();
      case 'emergency': return renderEmergencyContent();
      default: return null;
    }
  };

  const handleModalClose = () => {
    hideModal();
  };

  if (!record) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent
      onRequestClose={handleModalClose}
    >
      <Animated.View 
        style={[styles.overlay, overlayAnimatedStyle]}
      >
        <TouchableOpacity 
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={handleModalClose}
        />
        <Animated.View 
          style={[styles.modal, modalAnimatedStyle]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.98)', 'rgba(255, 255, 255, 0.95)']}
            style={styles.modalGradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIconContainer}>
                  <record.icon 
                    size={IconSizes.large} 
                    color={getUrgencyColor(record.urgency)} 
                    strokeWidth={STROKE_WIDTH} 
                  />
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.headerTitle}>{record.title}</Text>
                  <Text style={styles.headerDate}>{record.date}</Text>
                  <Text style={styles.headerProvider}>{record.provider}</Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                {record.urgency !== 'normal' && (
                  <View style={[styles.urgencyBadge, { backgroundColor: `${getUrgencyColor(record.urgency)}15` }]}>
                    <Text style={[styles.urgencyText, { color: getUrgencyColor(record.urgency) }]}>
                      {record.urgency.toUpperCase()}
                    </Text>
                  </View>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
                  <X size={IconSizes.large} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Content */}
            <ScrollView 
              style={styles.content}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainer}
            >
              {renderContent()}
              
              {/* AI Summary Component */}
              <AISummaryComponent record={record} />
            </ScrollView>

            {/* Action Buttons - Enhanced with Individual Animations */}
            <View style={styles.actionContainer}>
              <AnimatedTouchableOpacity
                style={[styles.actionButton, styles.secondaryButton, animatedShareButtonStyle]}
                onPress={() => { handleButtonPress('share'); handleShare(); }}
              >
                <Share2 size={IconSizes.medium} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                <Text style={styles.secondaryButtonText}>Share</Text>
              </AnimatedTouchableOpacity>
              
              <AnimatedTouchableOpacity
                style={[styles.actionButton, styles.secondaryButton, animatedDownloadButtonStyle]}
                onPress={() => { handleButtonPress('download'); handleDownload(); }}
              >
                <Download size={IconSizes.medium} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                <Text style={styles.secondaryButtonText}>Download</Text>
              </AnimatedTouchableOpacity>
              
              <AnimatedTouchableOpacity
                style={[styles.actionButton, styles.primaryButton, animatedPrimaryButtonStyle]}
                onPress={() => { handleButtonPress('primary'); handleScheduleFollowUp(); }}
              >
                <LinearGradient
                  colors={[BrandColors.primaryGreen, BrandColors.deepTeal]}
                  style={styles.primaryButtonGradient}
                >
                  <Calendar size={IconSizes.medium} color="white" strokeWidth={STROKE_WIDTH} />
                  <Text style={styles.primaryButtonText}>Follow-up</Text>
                </LinearGradient>
              </AnimatedTouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    height: screenHeight * 0.9,
    backgroundColor: 'transparent',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: `${BrandColors.primaryGreen}10`,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${BrandColors.primaryGreen}08`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.ui.label,
    fontSize: 20,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerDate: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    marginBottom: 2,
  },
  headerProvider: {
    ...Typography.body.small,
    color: BrandColors.textTertiary,
    fontStyle: 'italic',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  urgencyBadge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  urgencyText: {
    ...Typography.ui.labelSmall,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  contentSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.ui.label,
    fontSize: 18,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.md,
  },

  // Lab Reports
  labResultsContainer: {
    gap: Spacing.md,
  },
  labResultItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: BrandColors.primaryGreen,
  },
  labResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  labTestName: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
  },
  statusBadge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  statusText: {
    ...Typography.ui.labelSmall,
    fontSize: 10,
    fontWeight: '700',
  },
  labResultValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labResultValue: {
    ...Typography.body.large,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
  labResultRange: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },

  // Imaging
  imagingContainer: {
    gap: Spacing.md,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: `${BrandColors.primaryGreen}05`,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `${BrandColors.primaryGreen}20`,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    ...Typography.body.medium,
    color: BrandColors.textTertiary,
    marginTop: Spacing.sm,
  },
  findingsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  findingsTitle: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  findingsText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    lineHeight: 20,
  },

  // Prescription
  prescriptionContainer: {
    gap: Spacing.md,
  },
  prescriptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${BrandColors.primaryGreen}10`,
  },
  prescriptionLabel: {
    ...Typography.ui.label,
    color: BrandColors.textSecondary,
  },
  prescriptionValue: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    fontWeight: '500',
  },
  instructionsContainer: {
    backgroundColor: `${BrandColors.mintGreen}08`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  instructionsTitle: {
    ...Typography.ui.label,
    color: BrandColors.primaryGreen,
    marginBottom: Spacing.sm,
  },
  instructionsText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    lineHeight: 20,
  },

  // Consultation
  consultationContainer: {
    gap: Spacing.md,
  },
  consultationItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  consultationLabel: {
    ...Typography.ui.label,
    color: BrandColors.primaryGreen,
    marginBottom: Spacing.sm,
  },
  consultationValue: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    lineHeight: 20,
  },
  nextAppointmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${BrandColors.primaryGreen}08`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  nextAppointmentText: {
    marginLeft: Spacing.sm,
  },
  nextAppointmentLabel: {
    ...Typography.ui.labelSmall,
    color: BrandColors.primaryGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextAppointmentDate: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    fontWeight: '600',
  },

  // Implant
  implantContainer: {
    gap: Spacing.md,
  },
  implant3DContainer: {
    height: 150,
    backgroundColor: `${BrandColors.deepTeal}05`,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `${BrandColors.deepTeal}20`,
    borderStyle: 'dashed',
  },
  implant3DText: {
    ...Typography.body.medium,
    color: BrandColors.textTertiary,
    marginTop: Spacing.sm,
  },
  implantDetails: {
    gap: Spacing.sm,
  },
  implantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${BrandColors.deepTeal}10`,
  },
  implantLabel: {
    ...Typography.ui.label,
    color: BrandColors.textSecondary,
  },
  implantValue: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  nextCheckupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${BrandColors.warning}08`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  nextCheckupText: {
    marginLeft: Spacing.sm,
  },
  nextCheckupLabel: {
    ...Typography.ui.labelSmall,
    color: BrandColors.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextCheckupDate: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    fontWeight: '600',
  },

  // Surgery
  surgeryContainer: {
    gap: Spacing.md,
  },
  timelineContainer: {
    gap: Spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BrandColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineContent: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  timelineTitle: {
    ...Typography.ui.label,
    color: BrandColors.primaryGreen,
    marginBottom: Spacing.xs,
  },
  timelineText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    lineHeight: 18,
  },

  // Vaccine
  vaccineContainer: {
    gap: Spacing.md,
  },
  vaccineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${BrandColors.mintGreen}20`,
  },
  vaccineLabel: {
    ...Typography.ui.label,
    color: BrandColors.textSecondary,
  },
  vaccineValue: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    fontWeight: '500',
  },
  reactionsContainer: {
    backgroundColor: `${BrandColors.warning}08`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  reactionsTitle: {
    ...Typography.ui.label,
    color: BrandColors.warning,
    marginBottom: Spacing.sm,
  },
  reactionsText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    lineHeight: 20,
  },

  // Emergency
  emergencyContainer: {
    gap: Spacing.md,
  },
  emergencyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: BrandColors.error,
  },
  emergencyLabel: {
    ...Typography.ui.label,
    color: BrandColors.error,
    marginBottom: Spacing.sm,
  },
  emergencyValue: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    lineHeight: 20,
  },

  // AI Summary
  aiSummarySection: {
    marginTop: Spacing.lg,
  },
  aiSummaryContainer: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  aiSummaryGradient: {
    padding: Spacing.md,
  },
  aiSummaryText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    lineHeight: 20,
  },

  // Action Buttons - Enhanced Sophisticated Design
  actionContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: `${BrandColors.primaryGreen}08`,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  actionButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    // Enhanced shadow system for depth
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1.5,
    borderColor: `${BrandColors.primaryGreen}25`,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    minHeight: 52, // Consistent height with primary button
    // Enhanced hover/press state preparation
    transform: [{ scale: 1 }],
  },
  secondaryButtonText: {
    ...Typography.ui.label,
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.primaryGreen,
    letterSpacing: 0.3,
  },
  primaryButton: {
    flex: 1.8, // More balanced proportion
    // Additional elevation for primary action
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    minHeight: 52, // Consistent height with secondary buttons
  },
  primaryButtonText: {
    ...Typography.ui.label,
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});