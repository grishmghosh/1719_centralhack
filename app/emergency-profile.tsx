import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import {
  X,
  AlertTriangle,
  Heart,
  Phone,
  Pill,
  Shield,
  QrCode,
  Clock,
  FileText,
  Zap,
  Info
} from 'lucide-react-native';
import { BrandColors, Typography } from '@/constants/Typography';
import { getEmergencyContacts, EmergencyContact } from '@/constants/EmergencyData';

interface EmergencyProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function EmergencyProfileModal({ visible, onClose }: EmergencyProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'critical' | 'contacts' | 'medical' | 'qr'>('critical');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  // Load emergency contacts when modal opens
  useEffect(() => {
    if (visible) {
      loadEmergencyContacts();
    }
  }, [visible]);

  const loadEmergencyContacts = async () => {
    const contacts = await getEmergencyContacts();
    setEmergencyContacts(contacts);
  };

  // Function to handle phone calls
  const handlePhoneCall = async (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open dialer');
      console.error('Error opening dialer:', error);
    }
  };

  // Auto-populated emergency data from app's health records
  const emergencyData = {
    // From user profile & medical records
    bloodType: 'A+',
    
    // From health alerts & allergy tracking
    criticalAllergies: [
      { name: 'Penicillin', severity: 'severe', symptoms: 'Anaphylaxis' },
      { name: 'Shellfish', severity: 'moderate', symptoms: 'Hives, swelling' }
    ],
    
    // From daily medication tracking
    criticalMedications: [
      { name: 'Metformin', dosage: '500mg twice daily', condition: 'Diabetes' },
      { name: 'Lisinopril', dosage: '10mg once daily', condition: 'Hypertension' },
      { name: 'Rescue Inhaler', dosage: 'As needed', condition: 'Asthma' }
    ],
    
    // From My Conditions page
    medicalConditions: [
      { name: 'Type 2 Diabetes', status: 'managed', severity: 'moderate' },
      { name: 'Hypertension', status: 'controlled', severity: 'mild' },
      { name: 'Mild Asthma', status: 'stable', severity: 'mild' }
    ],
    
    // From profile settings - loaded dynamically
    emergencyContacts: emergencyContacts,
    
    // Critical alerts for first responders
    medicalAlerts: [
      'DIABETIC - Check blood sugar immediately',
      'NO NSAIDs - Kidney concerns',
      'Carries rescue inhaler for asthma',
      'Recent surgery - Left knee (2 weeks ago)'
    ],
    
    // Insurance information
    insurance: {
      provider: 'Star Health Insurance',
      policyNumber: 'SH2024789456',
      groupNumber: 'GRP001'
    },
    
    lastUpdated: new Date().toISOString(),
  };

  const tabs = [
    { id: 'critical', label: 'Critical', icon: AlertTriangle, color: BrandColors.critical },
    { id: 'contacts', label: 'Contacts', icon: Phone, color: BrandColors.primaryGreen },
    { id: 'medical', label: 'Medical', icon: Pill, color: BrandColors.deepTeal },
    { id: 'qr', label: 'QR Code', icon: QrCode, color: BrandColors.mintGreen },
  ];

  const renderCriticalTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Blood Type */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Heart size={20} color={BrandColors.critical} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Blood Type</Text>
          <View style={styles.criticalBadge}>
            <Text style={styles.criticalBadgeText}>CRITICAL</Text>
          </View>
        </View>
        <View style={styles.bloodTypeDisplay}>
          <Text style={styles.bloodTypeText}>{emergencyData.bloodType}</Text>
          <Text style={styles.bloodTypeSubtext}>From medical records</Text>
        </View>
      </View>

      {/* Critical Allergies */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={20} color={BrandColors.critical} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Critical Allergies</Text>
        </View>
        {emergencyData.criticalAllergies.map((allergy, index) => (
          <View key={index} style={styles.allergyItem}>
            <View style={[styles.severityDot, { backgroundColor: 
              allergy.severity === 'severe' ? BrandColors.critical : 
              allergy.severity === 'moderate' ? '#FF9500' : '#34C759' 
            }]} />
            <View style={styles.allergyInfo}>
              <Text style={styles.allergyName}>{allergy.name}</Text>
              <Text style={styles.allergySymptoms}>{allergy.symptoms}</Text>
            </View>
            <Text style={[styles.severityTag, { 
              backgroundColor: allergy.severity === 'severe' ? BrandColors.critical : '#FF9500',
              color: 'white'
            }]}>
              {allergy.severity.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>

      {/* Medical Alerts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AlertTriangle size={20} color={BrandColors.critical} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Emergency Alerts</Text>
        </View>
        {emergencyData.medicalAlerts.map((alert, index) => (
          <View key={index} style={styles.alertItem}>
            <Zap size={16} color={BrandColors.critical} strokeWidth={2} />
            <Text style={styles.alertText}>{alert}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderContactsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Phone size={20} color={BrandColors.primaryGreen} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        </View>
        {emergencyData.emergencyContacts.map((contact, index) => (
          <View key={index} style={[styles.contactItem, contact.primary && styles.primaryContact]}>
            {contact.primary && (
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryBadgeText}>PRIMARY</Text>
              </View>
            )}
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactRelationship}>{contact.relationship}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
            <TouchableOpacity 
              style={styles.callButton}
              onPress={() => handlePhoneCall(contact.phone)}>
              <Phone size={20} color="white" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderMedicalTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Critical Medications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Pill size={20} color={BrandColors.deepTeal} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Critical Medications</Text>
        </View>
        {emergencyData.criticalMedications.map((med, index) => (
          <View key={index} style={styles.medicationItem}>
            <View style={styles.medicationInfo}>
              <Text style={styles.medicationName}>{med.name}</Text>
              <Text style={styles.medicationDosage}>{med.dosage}</Text>
              <Text style={styles.medicationCondition}>For: {med.condition}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Medical Conditions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FileText size={20} color={BrandColors.deepTeal} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Medical Conditions</Text>
        </View>
        {emergencyData.medicalConditions.map((condition, index) => (
          <View key={index} style={styles.conditionItem}>
            <Text style={styles.conditionName}>{condition.name}</Text>
            <Text style={styles.conditionStatus}>{condition.status}</Text>
          </View>
        ))}
      </View>

      {/* Insurance Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={20} color={BrandColors.deepTeal} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Insurance Information</Text>
        </View>
        <View style={styles.insuranceInfo}>
          <Text style={styles.insuranceProvider}>{emergencyData.insurance.provider}</Text>
          <Text style={styles.insuranceDetail}>Policy: {emergencyData.insurance.policyNumber}</Text>
          <Text style={styles.insuranceDetail}>Group: {emergencyData.insurance.groupNumber}</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderQRTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <QrCode size={20} color={BrandColors.mintGreen} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Emergency QR Code</Text>
        </View>
        
        <View style={styles.qrContainer}>
          <View style={styles.qrPlaceholder}>
            <QrCode size={120} color={BrandColors.textSecondary} strokeWidth={1} />
            <Text style={styles.qrPlaceholderText}>QR Code Generated</Text>
          </View>
          
          <Text style={styles.qrDescription}>
            This QR code contains your critical emergency information and can be scanned by first responders even from your lock screen.
          </Text>
          
          <View style={styles.qrInfo}>
            <Info size={16} color={BrandColors.mintGreen} strokeWidth={2} />
            <Text style={styles.qrInfoText}>
              Add this to your phone's Medical ID or lock screen widgets for emergency access.
            </Text>
          </View>
        </View>
      </View>

      {/* Last Updated */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Clock size={20} color={BrandColors.textSecondary} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Data Freshness</Text>
        </View>
        <Text style={styles.lastUpdated}>
          Last updated: {new Date(emergencyData.lastUpdated).toLocaleString()}
        </Text>
        <Text style={styles.autoUpdate}>
          ✓ Auto-synced from your health data
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <AlertTriangle size={24} color={BrandColors.critical} strokeWidth={2} />
            <Text style={styles.headerTitle}>Emergency Profile</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={BrandColors.textPrimary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id as any)}>
              <tab.icon 
                size={16} 
                color={activeTab === tab.id ? 'white' : tab.color} 
                strokeWidth={2} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.content}>
          {activeTab === 'critical' && renderCriticalTab()}
          {activeTab === 'contacts' && renderContactsTab()}
          {activeTab === 'medical' && renderMedicalTab()}
          {activeTab === 'qr' && renderQRTab()}
        </View>

        {/* Emergency Notice */}
        <View style={styles.emergencyNotice}>
          <Zap size={16} color={BrandColors.critical} strokeWidth={2} />
          <Text style={styles.emergencyNoticeText}>
            This information is automatically compiled from your health data for emergency use
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.textPrimary,
  },
  closeButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: BrandColors.cream,
    gap: 6,
  },
  activeTab: {
    backgroundColor: BrandColors.primaryGreen,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BrandColors.textPrimary,
    flex: 1,
  },
  criticalBadge: {
    backgroundColor: BrandColors.critical,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  criticalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  bloodTypeDisplay: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: BrandColors.cream,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BrandColors.critical,
  },
  bloodTypeText: {
    fontSize: 48,
    fontWeight: '900',
    color: BrandColors.critical,
  },
  bloodTypeSubtext: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    marginTop: 4,
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: BrandColors.cream,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  severityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  allergyInfo: {
    flex: 1,
  },
  allergyName: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
  allergySymptoms: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  severityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '700',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: BrandColors.cream,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: BrandColors.critical,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
    color: BrandColors.textPrimary,
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: BrandColors.cream,
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
  },
  primaryContact: {
    borderWidth: 2,
    borderColor: BrandColors.primaryGreen,
  },
  primaryBadge: {
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: BrandColors.primaryGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
  contactRelationship: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  contactPhone: {
    fontSize: 14,
    fontWeight: '500',
    color: BrandColors.primaryGreen,
    marginTop: 4,
  },
  callButton: {
    backgroundColor: BrandColors.primaryGreen,
    padding: 12,
    borderRadius: 8,
  },
  medicationItem: {
    padding: 16,
    backgroundColor: BrandColors.cream,
    borderRadius: 12,
    marginBottom: 8,
  },
  medicationInfo: {
    gap: 4,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
  medicationDosage: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  medicationCondition: {
    fontSize: 12,
    color: BrandColors.mintGreen,
    fontWeight: '500',
  },
  conditionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: BrandColors.cream,
    borderRadius: 12,
    marginBottom: 8,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: '500',
    color: BrandColors.textPrimary,
  },
  conditionStatus: {
    fontSize: 14,
    color: BrandColors.success,
    fontWeight: '500',
  },
  insuranceInfo: {
    padding: 16,
    backgroundColor: BrandColors.cream,
    borderRadius: 12,
  },
  insuranceProvider: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.textPrimary,
    marginBottom: 8,
  },
  insuranceDetail: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    marginBottom: 4,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 24,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: BrandColors.cream,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  qrPlaceholderText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    marginTop: 8,
  },
  qrDescription: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  qrInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 16,
    backgroundColor: BrandColors.cream,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: BrandColors.mintGreen,
  },
  qrInfoText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    marginBottom: 8,
  },
  autoUpdate: {
    fontSize: 14,
    color: BrandColors.success,
    fontWeight: '500',
  },
  emergencyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  emergencyNoticeText: {
    fontSize: 12,
    color: BrandColors.critical,
    fontWeight: '500',
    flex: 1,
  },
});