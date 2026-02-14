import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import {
  Pill,
  Calendar,
  Clock,
  User,
  Save,
  ChevronDown,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { BrandColors, Typography } from '@/constants/Typography';
import BackArrow from '@/components/BackArrow';

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

const REMINDER_TYPES = [
  { id: 'medication', label: 'Medication', icon: Pill },
  { id: 'appointment', label: 'Appointment', icon: Calendar },
];

const FAMILY_MEMBERS = [
  'Sarah (You)',
  'John Chen',
  'Emma Chen',
  'Robert Chen',
];

interface Reminder {
  id: string;
  title: string;
  type: 'medication' | 'appointment';
  familyMember: string;
  time: string;
  date: string;
  completed: boolean;
  createdAt: string;
}

export default function AddReminderScreen() {
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<'medication' | 'appointment'>('medication');
  const [selectedMember, setSelectedMember] = useState('Sarah (You)');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  const handleSave = async () => {
    if (!title || !time || !date) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    try {
      // Create new reminder
      const newReminder: Reminder = {
        id: Date.now().toString(),
        title,
        type: selectedType,
        familyMember: selectedMember,
        time,
        date,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      // Get existing reminders
      const existingReminders = await AsyncStorage.getItem('healthReminders');
      const reminders = existingReminders ? JSON.parse(existingReminders) : [];

      // Add new reminder
      reminders.push(newReminder);

      // Save back to storage
      await AsyncStorage.setItem('healthReminders', JSON.stringify(reminders));

      Alert.alert(
        'Reminder Set!',
        `${selectedType === 'medication' ? 'Medication' : 'Appointment'} reminder for ${selectedMember} has been saved.`,
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      console.error('Error saving reminder:', error);
      Alert.alert('Error', 'Failed to save reminder. Please try again.');
    }
  };

  const getTypeIcon = (type: string) => {
    const typeObj = REMINDER_TYPES.find(t => t.id === type);
    return typeObj ? typeObj.icon : Pill;
  };

  return (
    <LinearGradient
      colors={[BrandColors.cream, '#F8F4EB', '#F6F2E9', BrandColors.cream]}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.container}>
      
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(50).springify()}
        style={styles.header}>
        <BackArrow onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Add Reminder</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Reminder Type */}
        <Animated.View
          entering={FadeInUp.delay(100).springify()}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Type</Text>
          <View style={styles.typeGrid}>
            {REMINDER_TYPES.map((type) => {
              const IconComponent = type.icon;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeCard,
                    selectedType === type.id && styles.selectedTypeCard
                  ]}
                  onPress={() => setSelectedType(type.id as 'medication' | 'appointment')}>
                  <IconComponent 
                    size={IconSizes.xlarge} 
                    color={selectedType === type.id ? BrandColors.primaryGreen : BrandColors.textSecondary} 
                    strokeWidth={STROKE_WIDTH} 
                  />
                  <Text style={[
                    styles.typeText,
                    selectedType === type.id && styles.selectedTypeText
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Reminder Details */}
        <Animated.View
          entering={FadeInUp.delay(150).springify()}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Details</Text>

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={selectedType === 'medication' ? 'e.g., Take Lisinopril 10mg' : 'e.g., Cardiology checkup'}
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={BrandColors.textSecondary}
              />
            </View>
          </View>

          {/* Family Member */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Family Member *</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowMemberPicker(!showMemberPicker)}>
              <User size={IconSizes.medium} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
              <Text style={styles.pickerText}>{selectedMember}</Text>
              <ChevronDown size={IconSizes.medium} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
            </TouchableOpacity>

            {showMemberPicker && (
              <Animated.View
                entering={FadeInDown.delay(50).springify()}
                style={styles.dropdown}>
                {FAMILY_MEMBERS.map((member) => (
                  <TouchableOpacity
                    key={member}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setSelectedMember(member);
                      setShowMemberPicker(false);
                    }}>
                    <Text style={styles.dropdownOptionText}>{member}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
          </View>

          {/* Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date *</Text>
            <View style={styles.inputContainer}>
              <Calendar size={IconSizes.medium} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
              <TextInput
                style={styles.textInput}
                placeholder="MM/DD/YYYY"
                value={date}
                onChangeText={setDate}
                placeholderTextColor={BrandColors.textSecondary}
              />
            </View>
          </View>

          {/* Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Time *</Text>
            <View style={styles.inputContainer}>
              <Clock size={IconSizes.medium} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
              <TextInput
                style={styles.textInput}
                placeholder="HH:MM AM/PM"
                value={time}
                onChangeText={setTime}
                placeholderTextColor={BrandColors.textSecondary}
              />
            </View>
          </View>
        </Animated.View>

        {/* Save Button */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={styles.saveSection}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}>
            <LinearGradient
              colors={[BrandColors.primaryGreen, BrandColors.deepTeal]}
              style={styles.saveGradient}>
              <Save size={IconSizes.medium} color="white" strokeWidth={STROKE_WIDTH} />
              <Text style={styles.saveButtonText}>Save Reminder</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom spacing */}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: 50,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    ...Typography.heading.medium,
    color: BrandColors.textPrimary,
  },
  headerSpacer: {
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
  sectionTitle: {
    ...Typography.heading.small,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.lg,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedTypeCard: {
    borderColor: BrandColors.primaryGreen,
    backgroundColor: `${BrandColors.primaryGreen}08`,
  },
  typeText: {
    ...Typography.ui.label,
    color: BrandColors.textSecondary,
    marginTop: Spacing.sm,
  },
  selectedTypeText: {
    color: BrandColors.primaryGreen,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: 'Outfit-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(20, 160, 133, 0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  textInput: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    flex: 1,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(20, 160, 133, 0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  pickerText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    flex: 1,
  },
  dropdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(20, 160, 133, 0.1)',
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20, 160, 133, 0.05)',
  },
  dropdownOptionText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
  },
  saveSection: {
    marginTop: Spacing.lg,
  },
  saveButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  saveButtonText: {
    ...Typography.ui.button,
    color: 'white',
    fontSize: 16,
  },
  bottomSpacing: {
    height: 40,
  },
});