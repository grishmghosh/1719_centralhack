import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import {
  Calendar,
  Clock,
  Pill,
  Check,
  X,
  Plus,
  Filter,
  Zap,
  Activity
} from 'lucide-react-native';
import { BrandColors, Typography } from '@/constants/Typography';
import { HealthPageHeader, StatusBadge, ActionButton, LoadingState } from '@/components/shared';
import { Medication, MedicationDose, TodaysHealthData } from '@/types/health';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function TodaysHealthScreen() {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'completed'>('all');

  // Mock data - in real app, this would come from API/state management
  const todaysHealthData: TodaysHealthData = {
    medications: [
      {
        id: '1',
        userId: 'user1',
        name: 'Vitamin D',
        dosage: '1000 IU',
        frequency: 'Once daily',
        instructions: 'Take with breakfast',
        isActive: true,
        reminderTimes: ['18:00'],
        createdAt: new Date(),
        updatedAt: new Date(),
        startDate: new Date(),
        todaysDoses: [
          {
            id: 'dose1',
            medicationId: '1',
            userId: 'user1',
            scheduledTime: new Date('2024-12-20T18:00:00'),
            status: 'overdue',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        streak: 12,
      },
      {
        id: '2',
        userId: 'user1',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        instructions: 'Take with meals',
        isActive: true,
        reminderTimes: ['08:00', '20:00'],
        createdAt: new Date(),
        updatedAt: new Date(),
        startDate: new Date(),
        todaysDoses: [
          {
            id: 'dose2',
            medicationId: '2',
            userId: 'user1',
            scheduledTime: new Date('2024-12-20T08:00:00'),
            status: 'taken',
            takenTime: new Date('2024-12-20T08:15:00'),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'dose3',
            medicationId: '2',
            userId: 'user1',
            scheduledTime: new Date('2024-12-20T20:00:00'),
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        streak: 28,
        nextDose: {
          id: 'dose3',
          medicationId: '2',
          userId: 'user1',
          scheduledTime: new Date('2024-12-20T20:00:00'),
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      },
      {
        id: '3',
        userId: 'user1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        instructions: 'Take in the afternoon',
        isActive: true,
        reminderTimes: ['14:00'],
        createdAt: new Date(),
        updatedAt: new Date(),
        startDate: new Date(),
        todaysDoses: [
          {
            id: 'dose4',
            medicationId: '3',
            userId: 'user1',
            scheduledTime: new Date('2024-12-20T14:00:00'),
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        streak: 45,
        nextDose: {
          id: 'dose4',
          medicationId: '3',
          userId: 'user1',
          scheduledTime: new Date('2024-12-20T14:00:00'),
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
    ],
    completedCount: 1,
    pendingCount: 2,
    overdueCount: 1,
  };

  const filteredMedications = todaysHealthData.medications.filter(med => {
    if (filter === 'all') return true;
    if (filter === 'completed') return med.todaysDoses.some(dose => dose.status === 'taken');
    if (filter === 'pending') return med.todaysDoses.some(dose => dose.status === 'pending');
    if (filter === 'overdue') return med.todaysDoses.some(dose => dose.status === 'overdue');
    return true;
  });

  const handleMarkAsTaken = async (doseId: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // In real app, update the dose status via API/state management
      console.log('Marked dose as taken:', doseId);
    }, 1000);
  };

  const handleSkipDose = async (doseId: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('Skipped dose:', doseId);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDoseUrgency = (dose: MedicationDose) => {
    const now = new Date();
    const scheduled = dose.scheduledTime;
    
    if (dose.status === 'taken') return 'completed';
    if (dose.status === 'skipped') return 'neutral';
    if (now > scheduled) return 'critical'; // overdue
    if (now.getDate() === scheduled.getDate()) return 'urgent'; // due today
    return 'dueSoon';
  };

  const getTodaySubtitle = () => {
    const date = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return date;
  };

  if (loading) {
    return <LoadingState message="Updating medication..." />;
  }

  return (
    <View style={styles.container}>
      <HealthPageHeader
        title="Today's Health"
        subtitle={getTodaySubtitle()}
        rightElement={
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="white" strokeWidth={2} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        <Animated.View 
          entering={FadeInUp.delay(100).springify()}
          style={styles.summaryContainer}>
          <View style={styles.summaryCards}>
            <View style={[styles.summaryCard, { backgroundColor: `${BrandColors.critical}15` }]}>
              <Text style={[styles.summaryNumber, { color: BrandColors.critical }]}>
                {todaysHealthData.overdueCount}
              </Text>
              <Text style={styles.summaryLabel}>Overdue</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: `${BrandColors.urgent}15` }]}>
              <Text style={[styles.summaryNumber, { color: BrandColors.urgent }]}>
                {todaysHealthData.pendingCount}
              </Text>
              <Text style={styles.summaryLabel}>Pending</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: `${BrandColors.completed}15` }]}>
              <Text style={[styles.summaryNumber, { color: BrandColors.completed }]}>
                {todaysHealthData.completedCount}
              </Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </View>
          </View>
        </Animated.View>

        {/* Filter Buttons */}
        <Animated.View 
          entering={FadeInUp.delay(200).springify()}
          style={styles.filterContainer}>
          {['all', 'overdue', 'pending', 'completed'].map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterTab,
                filter === filterOption && styles.filterTabActive
              ]}
              onPress={() => setFilter(filterOption as any)}>
              <Text style={[
                styles.filterTabText,
                filter === filterOption && styles.filterTabTextActive
              ]}>
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Medications List */}
        <View style={styles.medicationsContainer}>
          {filteredMedications.map((medication, index) => (
            <Animated.View
              key={medication.id}
              entering={FadeInUp.delay(300 + index * 100).springify()}
              style={styles.medicationCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                style={styles.medicationGradient}>
                
                {/* Medication Header */}
                <View style={styles.medicationHeader}>
                  <View style={styles.medicationInfo}>
                    <View style={styles.medicationNameRow}>
                      <Pill size={20} color={BrandColors.primaryGreen} strokeWidth={2} />
                      <Text style={styles.medicationName}>{medication.name}</Text>
                      <StatusBadge 
                        status={medication.todaysDoses[0]?.status || 'pending'} 
                        size="small" 
                      />
                    </View>
                    <Text style={styles.medicationDetails}>
                      {medication.dosage} • {medication.frequency}
                    </Text>
                    {medication.streak > 0 && (
                      <View style={styles.streakContainer}>
                        <Zap size={14} color={BrandColors.dueSoon} strokeWidth={2} />
                        <Text style={styles.streakText}>{medication.streak} day streak</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Today's Doses */}
                <View style={styles.dosesContainer}>
                  {medication.todaysDoses.map((dose) => (
                    <View key={dose.id} style={styles.doseItem}>
                      <View style={styles.doseInfo}>
                        <View style={styles.doseTimeContainer}>
                          <Clock size={16} color={BrandColors.textSecondary} strokeWidth={2} />
                          <Text style={styles.doseTime}>{formatTime(dose.scheduledTime)}</Text>
                        </View>
                        <StatusBadge 
                          status={getDoseUrgency(dose)} 
                          size="small"
                          customText={dose.status === 'taken' ? 'Taken' : 
                                     dose.status === 'skipped' ? 'Skipped' :
                                     dose.status === 'overdue' ? 'OVERDUE' : 'Pending'}
                        />
                      </View>
                      
                      {dose.status === 'pending' || dose.status === 'overdue' ? (
                        <View style={styles.doseActions}>
                          <ActionButton
                            title="Take"
                            size="small"
                            variant="success"
                            icon={Check}
                            onPress={() => handleMarkAsTaken(dose.id)}
                          />
                          <ActionButton
                            title="Skip"
                            size="small"
                            variant="outline"
                            icon={X}
                            onPress={() => handleSkipDose(dose.id)}
                          />
                        </View>
                      ) : dose.status === 'taken' && dose.takenTime && (
                        <Text style={styles.takenTime}>
                          Taken at {formatTime(dose.takenTime)}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>

                {/* Medication Instructions */}
                {medication.instructions && (
                  <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsText}>{medication.instructions}</Text>
                  </View>
                )}
              </LinearGradient>
            </Animated.View>
          ))}
        </View>

        {/* Add Medication Button */}
        <Animated.View 
          entering={FadeInUp.delay(600).springify()}
          style={styles.addButtonContainer}>
          <ActionButton
            title="Add New Medication"
            icon={Plus}
            variant="outline"
            fullWidth
            onPress={() => console.log('Add medication')}
          />
        </Animated.View>

        {/* Bottom spacing */}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryNumber: {
    ...Typography.metric.large,
    marginBottom: 4,
  },
  summaryLabel: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: 'white',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTabText: {
    ...Typography.ui.label,
    color: BrandColors.textSecondary,
  },
  filterTabTextActive: {
    color: BrandColors.primaryGreen,
    fontFamily: 'Outfit-SemiBold',
  },
  medicationsContainer: {
    gap: 16,
  },
  medicationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  medicationGradient: {
    padding: 20,
  },
  medicationHeader: {
    marginBottom: 16,
  },
  medicationInfo: {
    gap: 8,
  },
  medicationNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medicationName: {
    ...Typography.heading.small,
    color: BrandColors.textPrimary,
    flex: 1,
  },
  medicationDetails: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    marginLeft: 28,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 28,
  },
  streakText: {
    ...Typography.body.small,
    color: BrandColors.dueSoon,
    fontFamily: 'Outfit-Medium',
  },
  dosesContainer: {
    gap: 12,
  },
  doseItem: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    gap: 8,
  },
  doseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doseTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doseTime: {
    ...Typography.heading.tiny,
    color: BrandColors.textPrimary,
  },
  doseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  takenTime: {
    ...Typography.body.small,
    color: BrandColors.completed,
    fontFamily: 'Outfit-Medium',
  },
  instructionsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(20, 160, 133, 0.05)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: BrandColors.primaryGreen,
  },
  instructionsText: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
  },
  addButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});