import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  Check,
  Shield,
  User,
  Building2,
  FileText,
  Calendar,
  Lock,
  Send,
  CheckCircle,
} from 'lucide-react-native';
import { BrandColors } from '@/constants/Typography';
import { useQRScanner } from '@/contexts/QRScannerContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MedicalRecord {
  id: string;
  type: 'blood_test' | 'prescription' | 'scan' | 'diagnosis' | 'allergy' | 'report';
  title: string;
  date: string;
  doctor: string;
  summary: string;
  isSensitive?: boolean;
  fileSize?: string;
}

interface DoctorInfo {
  name: string;
  specialization: string;
  clinic: string;
  verified: boolean;
}

interface MedicalSharingFlowProps {
  visible: boolean;
  onClose: () => void;
  qrData?: string;
}

const MedicalSharingFlow: React.FC<MedicalSharingFlowProps> = ({
  visible,
  onClose,
  qrData,
}) => {
  const [currentStep, setCurrentStep] = useState<'doctor' | 'records' | 'pin' | 'success'>('doctor');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsMedicalSharingOpen } = useQRScanner();

  // Mock doctor info (in real app, this would be fetched from QR data)
  const doctorInfo: DoctorInfo = {
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    clinic: 'City Heart Center',
    verified: true,
  };

  // Mock medical records (replace with real data from your database)
  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      type: 'blood_test',
      title: 'Complete Blood Count (CBC)',
      date: '2024-12-15',
      doctor: 'Dr. Michael Chen',
      summary: 'Routine blood work - All values normal',
      fileSize: '245 KB',
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Current Medications',
      date: '2024-12-10',
      doctor: 'Dr. Emily Davis',
      summary: 'Metformin 500mg, Lisinopril 10mg',
      fileSize: '89 KB',
    },
    {
      id: '3',
      type: 'scan',
      title: 'Chest X-Ray',
      date: '2024-11-28',
      doctor: 'Dr. Robert Wilson',
      summary: 'Clear lungs, no abnormalities detected',
      fileSize: '2.1 MB',
    },
    {
      id: '4',
      type: 'allergy',
      title: 'Allergy Information',
      date: '2024-11-20',
      doctor: 'Dr. Lisa Parker',
      summary: 'Penicillin allergy - severe reaction',
      isSensitive: true,
      fileSize: '67 KB',
    },
    {
      id: '5',
      type: 'diagnosis',
      title: 'Hypertension Diagnosis',
      date: '2024-10-15',
      doctor: 'Dr. James Brown',
      summary: 'Stage 1 hypertension - well controlled',
      fileSize: '134 KB',
    },
  ];

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'blood_test': return '🩸';
      case 'prescription': return '💊';
      case 'scan': return '📡';
      case 'allergy': return '⚠️';
      case 'diagnosis': return '📋';
      default: return '📄';
    }
  };

  const handleRecordToggle = (recordId: string) => {
    setSelectedRecords(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handlePinSubmit = () => {
    if (pin === '1234') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep('success');
      }, 2000);
    } else {
      Alert.alert('Invalid PIN', 'Please enter the correct PIN (1234 for demo)');
    }
  };

  const handleClose = () => {
    setCurrentStep('doctor');
    setSelectedRecords([]);
    setPin('');
    setIsMedicalSharingOpen(false); // Show tab bar
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Doctor Verification Step */}
      {currentStep === 'doctor' && (
        <Animated.View entering={FadeInUp} style={styles.stepContainer}>
          <LinearGradient
            colors={[BrandColors.deepTeal, BrandColors.primaryGreen]}
            style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Share Medical Records</Text>
          </LinearGradient>

          <ScrollView style={styles.content}>
            <View style={styles.doctorCard}>
              <View style={styles.doctorHeader}>
                <View style={styles.doctorIcon}>
                  <User size={32} color={BrandColors.primaryGreen} />
                </View>
                <View style={styles.verifiedBadge}>
                  <CheckCircle size={16} color={BrandColors.primaryGreen} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
              
              <Text style={styles.doctorName}>{doctorInfo.name}</Text>
              <Text style={styles.doctorSpecialization}>{doctorInfo.specialization}</Text>
              
              <View style={styles.clinicInfo}>
                <Building2 size={16} color={BrandColors.textSecondary} />
                <Text style={styles.clinicName}>{doctorInfo.clinic}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Shield size={20} color={BrandColors.primaryGreen} />
              <Text style={styles.infoText}>
                Your medical records will be securely shared with this healthcare provider.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setCurrentStep('records')}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      )}

      {/* Record Selection Step */}
      {currentStep === 'records' && (
        <Animated.View entering={FadeInUp} style={styles.stepContainer}>
          <LinearGradient
            colors={[BrandColors.deepTeal, BrandColors.primaryGreen]}
            style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setCurrentStep('doctor')}>
              <X size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select Records to Share</Text>
          </LinearGradient>

          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Choose which records to share:</Text>
            
            {medicalRecords.map((record) => (
              <TouchableOpacity
                key={record.id}
                style={[
                  styles.recordCard,
                  selectedRecords.includes(record.id) && styles.recordCardSelected,
                ]}
                onPress={() => handleRecordToggle(record.id)}>
                
                <View style={styles.recordHeader}>
                  <Text style={styles.recordIcon}>{getRecordIcon(record.type)}</Text>
                  <View style={styles.recordInfo}>
                    <Text style={styles.recordTitle}>{record.title}</Text>
                    <Text style={styles.recordDate}>
                      {new Date(record.date).toLocaleDateString()} • {record.doctor}
                    </Text>
                    <Text style={styles.recordSummary}>{record.summary}</Text>
                  </View>
                  <View style={styles.recordActions}>
                    {record.isSensitive && (
                      <View style={styles.sensitiveTag}>
                        <Lock size={12} color={BrandColors.error} />
                      </View>
                    )}
                    <View style={[
                      styles.checkbox,
                      selectedRecords.includes(record.id) && styles.checkboxSelected,
                    ]}>
                      {selectedRecords.includes(record.id) && (
                        <Check size={16} color="white" />
                      )}
                    </View>
                  </View>
                </View>
                
                {record.fileSize && (
                  <Text style={styles.fileSize}>{record.fileSize}</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.shareButton,
                selectedRecords.length === 0 && styles.shareButtonDisabled,
              ]}
              disabled={selectedRecords.length === 0}
              onPress={() => setCurrentStep('pin')}>
              <Send size={20} color="white" />
              <Text style={styles.shareButtonText}>
                Share {selectedRecords.length} Record{selectedRecords.length !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      )}

      {/* PIN Authentication Step */}
      {currentStep === 'pin' && (
        <Animated.View entering={FadeInUp} style={styles.stepContainer}>
          <LinearGradient
            colors={[BrandColors.deepTeal, BrandColors.primaryGreen]}
            style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setCurrentStep('records')}>
              <X size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Enter PIN</Text>
          </LinearGradient>

          <View style={styles.pinContainer}>
            <Lock size={48} color={BrandColors.primaryGreen} />
            <Text style={styles.pinTitle}>Secure Authentication</Text>
            <Text style={styles.pinSubtitle}>Enter your 4-digit PIN to confirm sharing</Text>
            
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              placeholder="1234"
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              autoFocus
            />

            <TouchableOpacity
              style={[
                styles.confirmButton,
                pin.length !== 4 && styles.confirmButtonDisabled,
              ]}
              disabled={pin.length !== 4 || isLoading}
              onPress={handlePinSubmit}>
              <Text style={styles.confirmButtonText}>
                {isLoading ? 'Sharing...' : 'Confirm & Share'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.demoHint}>(Demo PIN: 1234)</Text>
          </View>
        </Animated.View>
      )}

      {/* Success Step */}
      {currentStep === 'success' && (
        <Animated.View entering={FadeInUp} style={styles.stepContainer}>
          <View style={styles.successContainer}>
            <CheckCircle size={64} color={BrandColors.primaryGreen} />
            <Text style={styles.successTitle}>Records Shared Successfully!</Text>
            <Text style={styles.successSubtitle}>
              Your medical records have been securely shared with {doctorInfo.name}
            </Text>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Shared Records:</Text>
              {selectedRecords.map((recordId) => {
                const record = medicalRecords.find(r => r.id === recordId);
                return record ? (
                  <Text key={recordId} style={styles.summaryItem}>
                    • {record.title}
                  </Text>
                ) : null;
              })}
            </View>

            <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 2000,
  },
  stepContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-SemiBold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  doctorCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  doctorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(20, 160, 133, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 160, 133, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
    color: BrandColors.primaryGreen,
    marginLeft: 4,
  },
  doctorName: {
    fontSize: 24,
    fontFamily: 'Outfit-SemiBold',
    color: BrandColors.textPrimary,
    marginBottom: 4,
  },
  doctorSpecialization: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: BrandColors.textSecondary,
    marginBottom: 10,
  },
  clinicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicName: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: BrandColors.textSecondary,
    marginLeft: 6,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 160, 133, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: BrandColors.textPrimary,
    marginLeft: 10,
    flex: 1,
  },
  continueButton: {
    backgroundColor: BrandColors.primaryGreen,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: BrandColors.textPrimary,
    marginBottom: 20,
  },
  recordCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(20, 160, 133, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recordCardSelected: {
    borderColor: BrandColors.primaryGreen,
    backgroundColor: 'rgba(20, 160, 133, 0.02)',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recordIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: BrandColors.textPrimary,
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: BrandColors.textSecondary,
    marginBottom: 6,
  },
  recordSummary: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: BrandColors.textPrimary,
  },
  recordActions: {
    alignItems: 'center',
  },
  sensitiveTag: {
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BrandColors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: BrandColors.primaryGreen,
    borderColor: BrandColors.primaryGreen,
  },
  fileSize: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: BrandColors.textSecondary,
    marginTop: 8,
    textAlign: 'right',
  },
  shareButton: {
    backgroundColor: BrandColors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  shareButtonDisabled: {
    backgroundColor: BrandColors.textSecondary,
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
  pinContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  pinTitle: {
    fontSize: 24,
    fontFamily: 'Outfit-SemiBold',
    color: BrandColors.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },
  pinSubtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: BrandColors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  pinInput: {
    width: 200,
    height: 60,
    borderWidth: 2,
    borderColor: BrandColors.primaryGreen,
    borderRadius: 12,
    fontSize: 24,
    fontFamily: 'Outfit-SemiBold',
    textAlign: 'center',
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: BrandColors.primaryGreen,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  confirmButtonDisabled: {
    backgroundColor: BrandColors.textSecondary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: 'white',
  },
  demoHint: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: BrandColors.textSecondary,
    marginTop: 20,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Outfit-SemiBold',
    color: BrandColors.textPrimary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: BrandColors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  summaryCard: {
    backgroundColor: 'rgba(20, 160, 133, 0.05)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: BrandColors.textPrimary,
    marginBottom: 10,
  },
  summaryItem: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: BrandColors.textPrimary,
    marginBottom: 4,
  },
  doneButton: {
    backgroundColor: BrandColors.primaryGreen,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: 'white',
  },
});

export default MedicalSharingFlow;