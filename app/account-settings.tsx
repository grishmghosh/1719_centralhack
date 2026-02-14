import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Linking,
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
import { ArrowLeft, User, Phone, Mail, Calendar, Shield, Lock, Plus, CreditCard as Edit3, Trash2, Save, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { BrandColors, Typography } from '@/constants/Typography';
import { 
  EmergencyContact, 
  getEmergencyContacts, 
  addEmergencyContact, 
  updateEmergencyContact, 
  deleteEmergencyContact,
  setPrimaryEmergencyContact 
} from '@/constants/EmergencyData';

// Consistent Icon System from Home Page
const IconSizes = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 28,
};

const STROKE_WIDTH = 1.5; // Consistent across all icons

// Consistent Spacing System from Home Page
const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Border Radius System from Home Page
const BorderRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ProfileData {
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
}

export default function AccountSettingsScreen() {
  const [activeTab, setActiveTab] = useState<'profile' | 'emergency' | 'password'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const cardScale = useSharedValue(1);

  // Profile form state
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Sarah Chen',
    phone: '+1 (555) 123-4567',
    email: 'sarah.chen@email.com',
    dateOfBirth: '1985-03-15',
    gender: 'Female',
  });

  // Emergency contacts state
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState({ 
    name: '', 
    phone: '', 
    relationship: '', 
    primary: false 
  });

  // Load emergency contacts on component mount
  useEffect(() => {
    loadEmergencyContacts();
  }, []);

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
  const [editingContact, setEditingContact] = useState<string | null>(null);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handleCardPress = () => {
    cardScale.value = withSpring(0.95, { duration: 150 });
    setTimeout(() => {
      cardScale.value = withSpring(1, { duration: 150 });
    }, 150);
  };

  // Profile form handlers
  const handleSaveProfile = async () => {
    if (!profileData.name || !profileData.email || !profileData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!isValidEmail(profileData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!isValidPhone(profileData.phone)) {
      Alert.alert('Error', 'Please enter a valid phone number (minimum 10 digits)');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Emergency contacts handlers
  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidPhone(newContact.phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    const updatedContacts = await addEmergencyContact(newContact);
    setEmergencyContacts(updatedContacts);
    setNewContact({ name: '', phone: '', relationship: '', primary: false });
    Alert.alert('Success', 'Emergency contact added');
  };

  const handleEditContact = (id: string) => {
    setEditingContact(id);
  };

  const handleSaveContact = async (id: string, updatedContact: Omit<EmergencyContact, 'id'>) => {
    if (!updatedContact.name || !updatedContact.phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const updatedContacts = await updateEmergencyContact(id, updatedContact);
    setEmergencyContacts(updatedContacts);
    setEditingContact(null);
    Alert.alert('Success', 'Contact updated');
  };

  const handleDeleteContact = async (id: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedContacts = await deleteEmergencyContact(id);
            setEmergencyContacts(updatedContacts);
            Alert.alert('Success', 'Contact deleted');
          },
        },
      ]
    );
  };

  // Password form handlers
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  // Validation helpers
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  };

  const renderTabButton = (
    tab: 'profile' | 'emergency' | 'password',
    title: string,
    icon: any
  ) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}>
            {React.createElement(icon, { size: 20, color: activeTab === tab ? '#0066CC' : '#6B7280', strokeWidth: 2 })}
      <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderProfileForm = () => (
    <Animated.View entering={FadeInUp.springify()} style={styles.formContainer}>
      <BlurView intensity={40} tint="light" style={styles.formBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
          style={styles.formGradient}>
          <Text style={styles.formTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#6B7280" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={profileData.name}
                onChangeText={(text) => setProfileData({...profileData, name: text})}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#6B7280" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={profileData.email}
                onChangeText={(text) => setProfileData({...profileData, email: text})}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color="#6B7280" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={profileData.phone}
                onChangeText={(text) => setProfileData({...profileData, phone: text})}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color="#6B7280" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={profileData.dateOfBirth}
                onChangeText={(text) => setProfileData({...profileData, dateOfBirth: text})}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderContainer}>
              {['Male', 'Female', 'Other', 'Prefer not to say'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderOption,
                    profileData.gender === gender && styles.selectedGenderOption
                  ]}
                  onPress={() => setProfileData({...profileData, gender})}>
                  <Text style={[
                    styles.genderOptionText,
                    profileData.gender === gender && styles.selectedGenderOptionText
                  ]}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={handleSaveProfile}
            disabled={isLoading}>
            <Save size={20} color="white" strokeWidth={2} />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );

  const renderEmergencyContactsForm = () => (
    <Animated.View entering={FadeInUp.springify()} style={styles.formContainer}>
      {/* Add New Contact */}
      <BlurView intensity={40} tint="light" style={styles.formBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
          style={styles.formGradient}>
          <Text style={styles.formTitle}>Add Emergency Contact</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Name *</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#6B7280" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={newContact.name}
                onChangeText={(text) => setNewContact({...newContact, name: text})}
                placeholder="Enter contact name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color="#6B7280" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={newContact.phone}
                onChangeText={(text) => setNewContact({...newContact, phone: text})}
                placeholder="Enter phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Relationship *</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#6B7280" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={newContact.relationship}
                onChangeText={(text) => setNewContact({...newContact, relationship: text})}
                placeholder="e.g., Spouse, Parent, Doctor"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
            <Plus size={20} color="white" strokeWidth={2} />
            <Text style={styles.addButtonText}>Add Contact</Text>
          </TouchableOpacity>
        </LinearGradient>
      </BlurView>

      {/* Existing Contacts */}
      <View style={styles.contactsList}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        {emergencyContacts.map((contact, index) => (
          <Animated.View
            key={contact.id}
            entering={FadeInUp.delay(index * 100).springify()}>
            <BlurView intensity={30} tint="light" style={styles.contactBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']}
                style={styles.contactGradient}>
                {editingContact === contact.id ? (
                  <EditContactForm
                    contact={contact}
                    onSave={(updatedContact) => handleSaveContact(contact.id, updatedContact)}
                    onCancel={() => setEditingContact(null)}
                  />
                ) : (
                  <View style={styles.contactInfo}>
                    <View style={styles.contactDetails}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                      <Text style={styles.contactRelationship}>{contact.relationship}</Text>
                    </View>
                    <View style={styles.contactActions}>
                      <TouchableOpacity
                        style={styles.callButton}
                        onPress={() => handlePhoneCall(contact.phone)}>
                        <Phone size={16} color={BrandColors.primaryGreen} strokeWidth={2} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditContact(contact.id)}>
                        <Edit3 size={16} color="#0066CC" strokeWidth={2} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteContact(contact.id)}>
                        <Trash2 size={16} color="#EF4444" strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </LinearGradient>
            </BlurView>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderPasswordForm = () => (
    <Animated.View entering={FadeInUp.springify()} style={styles.formContainer}>
      <BlurView intensity={40} tint="light" style={styles.formBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
          style={styles.formGradient}>
          <Text style={styles.formTitle}>Change Password</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password *</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#6B7280" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                placeholder="Enter current password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPasswords.current}
              />
              <TouchableOpacity
                onPress={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}>
                {showPasswords.current ? (
                  <EyeOff size={20} color="#6B7280" strokeWidth={2} />
                ) : (
                  <Eye size={20} color="#6B7280" strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password *</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#6B7280" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                placeholder="Enter new password (min 8 characters)"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPasswords.new}
              />
              <TouchableOpacity
                onPress={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}>
                {showPasswords.new ? (
                  <EyeOff size={20} color="#6B7280" strokeWidth={2} />
                ) : (
                  <Eye size={20} color="#6B7280" strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm New Password *</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#6B7280" strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                placeholder="Confirm new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPasswords.confirm}
              />
              <TouchableOpacity
                onPress={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}>
                {showPasswords.confirm ? (
                  <EyeOff size={20} color="#6B7280" strokeWidth={2} />
                ) : (
                  <Eye size={20} color="#6B7280" strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <Text style={styles.requirementItem}>• Minimum 8 characters</Text>
            <Text style={styles.requirementItem}>• Mix of letters and numbers recommended</Text>
            <Text style={styles.requirementItem}>• Avoid common passwords</Text>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={handleChangePassword}
            disabled={isLoading}>
            <Shield size={20} color="white" strokeWidth={2} />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Changing...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );

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
        <Text style={styles.title}>Account Settings</Text>
        <View style={styles.headerRight} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Tab Navigation */}
        <Animated.View 
          entering={FadeInUp.delay(200).springify()}
          style={styles.tabContainer}>
          <View style={styles.tabBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
              style={styles.tabGradient}>
              {renderTabButton('profile', 'Profile', User)}
              {renderTabButton('emergency', 'Emergency', Shield)}
              {renderTabButton('password', 'Password', Lock)}
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Content */}
        {activeTab === 'profile' && renderProfileForm()}
        {activeTab === 'emergency' && renderEmergencyContactsForm()}
        {activeTab === 'password' && renderPasswordForm()}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
}

// Edit Contact Form Component
const EditContactForm: React.FC<{
  contact: EmergencyContact;
  onSave: (contact: Omit<EmergencyContact, 'id'>) => void;
  onCancel: () => void;
}> = ({ contact, onSave, onCancel }) => {
  const [editData, setEditData] = useState({
    name: contact.name,
    phone: contact.phone,
    relationship: contact.relationship,
    primary: contact.primary,
  });

  return (
    <View style={styles.editForm}>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.editInput}
          value={editData.name}
          onChangeText={(text) => setEditData({...editData, name: text})}
          placeholder="Contact name"
        />
      </View>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.editInput}
          value={editData.phone}
          onChangeText={(text) => setEditData({...editData, phone: text})}
          placeholder="Phone number"
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.editInput}
          value={editData.relationship}
          onChangeText={(text) => setEditData({...editData, relationship: text})}
          placeholder="Relationship"
        />
      </View>
      <View style={styles.editActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveEditButton}
          onPress={() => onSave(editData)}>
          <Text style={styles.saveEditButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    padding: Spacing.sm,
  },
  title: {
    ...Typography.heading.large,
    color: BrandColors.textPrimary,
  },
  headerRight: {
    width: 40, // Balance the header layout
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  
  // Tab Navigation - matching home page card style
  tabContainer: {
    marginBottom: Spacing.lg,
  },
  tabBlur: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 160, 133, 0.1)',
  },
  tabGradient: {
    flexDirection: 'row',
    padding: Spacing.xs,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  activeTabButton: {
    backgroundColor: `${BrandColors.primaryGreen}15`,
  },
  tabButtonText: {
    ...Typography.ui.label,
    color: BrandColors.textSecondary,
    marginLeft: Spacing.sm,
  },
  activeTabButtonText: {
    color: BrandColors.primaryGreen,
    fontFamily: 'Outfit-SemiBold',
  },

  // Form Styles - matching home page card style
  formContainer: {
    marginBottom: Spacing.lg,
  },
  formBlur: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    backgroundColor: BrandColors.white,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 160, 133, 0.1)',
  },
  formGradient: {
    padding: Spacing.lg,
  },
  formTitle: {
    ...Typography.heading.small,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 160, 133, 0.1)',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    ...Typography.body.large,
    color: BrandColors.textPrimary,
    marginLeft: Spacing.md,
  },
  
  // Gender Selection - matching home page button style
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  genderOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 0.5,
    borderColor: 'rgba(20, 160, 133, 0.1)',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedGenderOption: {
    backgroundColor: `${BrandColors.primaryGreen}15`,
    borderColor: BrandColors.primaryGreen,
  },
  genderOptionText: {
    ...Typography.ui.label,
    color: BrandColors.textSecondary,
  },
  selectedGenderOptionText: {
    color: BrandColors.primaryGreen,
    fontFamily: 'Outfit-SemiBold',
  },

  // Buttons - matching home page style
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.primaryGreen,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...Typography.ui.button,
    color: 'white',
    marginLeft: Spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.success,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
    shadowColor: BrandColors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    ...Typography.ui.button,
    color: 'white',
    marginLeft: Spacing.sm,
  },

  // Emergency Contacts - matching home page card style
  contactsList: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading.small,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.md,
  },
  contactBlur: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    backgroundColor: BrandColors.white,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 160, 133, 0.08)',
  },
  contactGradient: {
    padding: Spacing.md,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    ...Typography.heading.tiny,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  contactPhone: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
  },
  contactRelationship: {
    ...Typography.body.small,
    color: BrandColors.primaryGreen,
    fontWeight: '500',
  },
  contactActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  callButton: {
    padding: Spacing.sm,
    backgroundColor: `${BrandColors.primaryGreen}15`,
    borderRadius: Spacing.sm,
  },
  editButton: {
    padding: Spacing.sm,
    backgroundColor: `${BrandColors.primaryGreen}15`,
    borderRadius: Spacing.sm,
  },
  deleteButton: {
    padding: Spacing.sm,
    backgroundColor: `${BrandColors.error}15`,
    borderRadius: Spacing.sm,
  },

  // Edit Form
  editForm: {
    gap: Spacing.md,
  },
  editInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.body.large,
    color: BrandColors.textPrimary,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 160, 133, 0.1)',
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    backgroundColor: `${BrandColors.textSecondary}15`,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.ui.label,
    color: BrandColors.textSecondary,
  },
  saveEditButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    backgroundColor: BrandColors.primaryGreen,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  saveEditButtonText: {
    ...Typography.ui.label,
    color: 'white',
  },

  // Password Requirements
  passwordRequirements: {
    backgroundColor: `${BrandColors.primaryGreen}08`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.md,
  },
  requirementsTitle: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  requirementItem: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
    marginBottom: Spacing.xs,
  },

  bottomSpacing: {
    height: 40,
  },
});