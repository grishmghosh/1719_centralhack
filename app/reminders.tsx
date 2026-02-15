import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import {
  Bell,
  Clock,
  Pill,
  Calendar,
  User,
  Plus,
  Trash2,
  CheckCircle,
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

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('healthReminders');
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveReminders = async (newReminders: Reminder[]) => {
    try {
      await AsyncStorage.setItem('healthReminders', JSON.stringify(newReminders));
      setReminders(newReminders);
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const toggleReminderComplete = (reminderId: string) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === reminderId 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    );
    saveReminders(updatedReminders);
  };

  const deleteReminder = (reminderId: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedReminders = reminders.filter(r => r.id !== reminderId);
            saveReminders(updatedReminders);
          }
        }
      ]
    );
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return Pill;
      case 'appointment':
        return Calendar;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication':
        return BrandColors.primaryGreen;
      case 'appointment':
        return BrandColors.deepTeal;
      default:
        return BrandColors.textSecondary;
    }
  };

  const sortedReminders = reminders.sort((a, b) => {
    // Sort by completion status first (incomplete first), then by date/time
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime();
  });

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
        <Text style={styles.headerTitle}>Health Reminders</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-reminder' as any)}>
          <Plus size={IconSizes.medium} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {loading ? (
          <Animated.View
            entering={FadeInUp.delay(100).springify()}
            style={styles.loadingContainer}>
            <Bell size={IconSizes.xlarge} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.loadingText}>Loading reminders...</Text>
          </Animated.View>
        ) : reminders.length === 0 ? (
          <Animated.View
            entering={FadeInUp.delay(100).springify()}
            style={styles.emptyContainer}>
            <Bell size={64} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.emptyTitle}>No Reminders Yet</Text>
            <Text style={styles.emptySubtitle}>
              Set reminders for medications, appointments, and health tasks for you and your family.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/add-reminder' as any)}>
              <LinearGradient
                colors={[BrandColors.primaryGreen, BrandColors.deepTeal]}
                style={styles.emptyButtonGradient}>
                <Plus size={IconSizes.medium} color="white" strokeWidth={STROKE_WIDTH} />
                <Text style={styles.emptyButtonText}>Add First Reminder</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInUp.delay(100).springify()}
            style={styles.remindersList}>
            {sortedReminders.map((reminder, index) => {
              const IconComponent = getReminderIcon(reminder.type);
              return (
                <Animated.View
                  key={reminder.id}
                  entering={FadeInUp.delay(150 + index * 50).springify()}>
                  <View style={[
                    styles.reminderCard,
                    reminder.completed && styles.completedCard
                  ]}>
                    <LinearGradient
                      colors={reminder.completed 
                        ? ['rgba(127, 205, 205, 0.1)', 'rgba(127, 205, 205, 0.05)']
                        : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']
                      }
                      style={styles.reminderGradient}>
                      
                      <View style={styles.reminderHeader}>
                        <View style={styles.reminderInfo}>
                          <View style={styles.reminderTitleRow}>
                            <View style={[
                              styles.reminderIcon,
                              { backgroundColor: `${getTypeColor(reminder.type)}15` }
                            ]}>
                              <IconComponent 
                                size={IconSizes.medium} 
                                color={getTypeColor(reminder.type)} 
                                strokeWidth={STROKE_WIDTH} 
                              />
                            </View>
                            <View style={styles.reminderDetails}>
                              <Text style={[
                                styles.reminderTitle,
                                reminder.completed && styles.completedText
                              ]}>
                                {reminder.title}
                              </Text>
                              <View style={styles.reminderMeta}>
                                <User size={IconSizes.small} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
                                <Text style={styles.reminderMember}>{reminder.familyMember}</Text>
                              </View>
                            </View>
                          </View>
                          
                          <View style={styles.reminderTime}>
                            <Clock size={IconSizes.small} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
                            <Text style={styles.reminderTimeText}>
                              {reminder.date} at {reminder.time}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.reminderActions}>
                          <TouchableOpacity
                            style={styles.completeButton}
                            onPress={() => toggleReminderComplete(reminder.id)}>
                            {reminder.completed ? (
                              <CheckCircle size={IconSizes.large} color={BrandColors.completed} strokeWidth={STROKE_WIDTH} />
                            ) : (
                              <View style={styles.uncompleteCircle} />
                            )}
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => deleteReminder(reminder.id)}>
                            <Trash2 size={IconSizes.medium} color={BrandColors.error} strokeWidth={STROKE_WIDTH} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                </Animated.View>
              );
            })}
          </Animated.View>
        )}

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
  addButton: {
    padding: Spacing.sm,
    backgroundColor: `${BrandColors.primaryGreen}15`,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  loadingText: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.heading.medium,
    color: BrandColors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyButtonText: {
    ...Typography.ui.button,
    color: 'white',
  },
  remindersList: {
    gap: Spacing.md,
  },
  reminderCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  completedCard: {
    opacity: 0.7,
  },
  reminderGradient: {
    padding: Spacing.lg,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reminderInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  reminderTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  reminderDetails: {
    flex: 1,
  },
  reminderTitle: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: BrandColors.textSecondary,
  },
  reminderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  reminderMember: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  reminderTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  reminderTimeText: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  reminderActions: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  completeButton: {
    padding: Spacing.xs,
  },
  uncompleteCircle: {
    width: IconSizes.large,
    height: IconSizes.large,
    borderRadius: IconSizes.large / 2,
    borderWidth: 2,
    borderColor: BrandColors.textSecondary,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  bottomSpacing: {
    height: 40,
  },
});