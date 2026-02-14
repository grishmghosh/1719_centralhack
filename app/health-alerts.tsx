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
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import {
  AlertTriangle,
  Clock,
  Calendar,
  Phone,
  ShoppingCart,
  Bell,
  BellOff,
  X,
  CheckCircle,
  ExternalLink,
  Filter,
  Plus,
  Zap,
  AlertCircle,
  Activity,
  Stethoscope
} from 'lucide-react-native';
import { BrandColors, Typography } from '@/constants/Typography';
import { HealthPageHeader, StatusBadge, ActionButton, LoadingState } from '@/components/shared';
import { HealthAlert, HealthAlertsData, AlertAction } from '@/types/health';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HealthAlertsScreen() {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'critical' | 'urgent' | 'dueSoon'>('all');
  const [actioningAlert, setActioningAlert] = useState<string | null>(null);

  // Mock data - in real app, this would come from API/state management
  const healthAlertsData: HealthAlertsData = {
    alerts: [
      {
        id: '1',
        userId: 'user1',
        type: 'medication',
        title: 'Blood Pressure Check Overdue',
        description: 'Your last blood pressure reading was 2 weeks ago. Schedule a check-up to monitor your hypertension.',
        urgency: 'critical',
        dueDate: new Date('2024-12-18'),
        isRecurring: true,
        recurringPattern: 'weekly',
        isDismissed: false,
        isSnoozed: false,
        actionRequired: true,
        actionButtons: [
          {
            id: 'schedule1',
            label: 'Schedule Appointment',
            action: 'schedule',
            actionData: { type: 'checkup', specialty: 'cardiology' }
          },
          {
            id: 'call1',
            label: 'Call Doctor',
            action: 'call',
            actionData: { phone: '+1234567890' }
          }
        ],
        relatedEntityId: 'condition1',
        relatedEntityType: 'condition',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        userId: 'user1',
        type: 'refill',
        title: 'Metformin Prescription Refill',
        description: 'You have 3 days of Metformin left. Order a refill to avoid missing doses.',
        urgency: 'urgent',
        dueDate: new Date('2024-12-23'),
        isRecurring: false,
        isDismissed: false,
        isSnoozed: false,
        actionRequired: true,
        actionButtons: [
          {
            id: 'refill1',
            label: 'Order Refill',
            action: 'refill',
            actionData: { medicationId: 'med1', pharmacy: 'CVS Pharmacy' }
          },
          {
            id: 'call2',
            label: 'Call Pharmacy',
            action: 'call',
            actionData: { phone: '+1987654321' }
          }
        ],
        relatedEntityId: 'med1',
        relatedEntityType: 'medication',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        userId: 'user1',
        type: 'appointment',
        title: 'Annual Physical Exam',
        description: 'Your annual physical exam is due next month. Schedule with your primary care physician.',
        urgency: 'dueSoon',
        dueDate: new Date('2025-01-15'),
        isRecurring: true,
        recurringPattern: 'yearly',
        isDismissed: false,
        isSnoozed: false,
        actionRequired: true,
        actionButtons: [
          {
            id: 'schedule2',
            label: 'Schedule Physical',
            action: 'schedule',
            actionData: { type: 'physical', provider: 'Dr. Smith' }
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        userId: 'user1',
        type: 'test',
        title: 'Lab Results Available',
        description: 'Your recent blood work results are ready for review. Check with your doctor.',
        urgency: 'urgent',
        dueDate: new Date('2024-12-20'),
        isRecurring: false,
        isDismissed: false,
        isSnoozed: false,
        actionRequired: true,
        actionButtons: [
          {
            id: 'view1',
            label: 'View Results',
            action: 'navigate',
            actionData: { route: '/lab-results' }
          },
          {
            id: 'call3',
            label: 'Call Doctor',
            action: 'call',
            actionData: { phone: '+1234567890' }
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        userId: 'user1',
        type: 'medication',
        title: 'Vitamin D Supplement',
        description: 'Consider adding Vitamin D supplement based on your recent lab results.',
        urgency: 'dueSoon',
        isRecurring: false,
        isDismissed: false,
        isSnoozed: false,
        actionRequired: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    criticalCount: 1,
    urgentCount: 2,
    dueSoonCount: 2,
  };

  const filteredAlerts = healthAlertsData.alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.urgency === filter;
  });

  const handleAlertAction = async (alert: HealthAlert, action: AlertAction) => {
    setActioningAlert(alert.id);
    setLoading(true);

    try {
      switch (action.action) {
        case 'schedule':
          await handleScheduleAppointment(action.actionData);
          break;
        case 'refill':
          await handleOrderRefill(action.actionData);
          break;
        case 'call':
          await handleMakeCall(action.actionData);
          break;
        case 'navigate':
          await handleNavigate(action.actionData);
          break;
        case 'dismiss':
          await handleDismissAlert(alert.id);
          break;
        case 'snooze':
          await handleSnoozeAlert(alert.id);
          break;
      }
    } catch (error) {
      console.error('Action failed:', error);
      Alert.alert('Error', 'Failed to perform action. Please try again.');
    } finally {
      setLoading(false);
      setActioningAlert(null);
    }
  };

  const handleScheduleAppointment = async (data: any) => {
    // Simulate API call to scheduling system
    return new Promise(resolve => {
      setTimeout(() => {
        Alert.alert('Appointment Scheduled', `Your ${data.type} appointment has been scheduled.`);
        resolve(true);
      }, 1500);
    });
  };

  const handleOrderRefill = async (data: any) => {
    // Simulate API call to pharmacy system
    return new Promise(resolve => {
      setTimeout(() => {
        Alert.alert('Refill Ordered', `Your prescription refill has been ordered from ${data.pharmacy}.`);
        resolve(true);
      }, 1500);
    });
  };

  const handleMakeCall = async (data: any) => {
    // In real app, would use Linking.openURL(`tel:${data.phone}`)
    Alert.alert('Call', `Would call ${data.phone}`);
  };

  const handleNavigate = async (data: any) => {
    // In real app, would use router.push(data.route)
    Alert.alert('Navigate', `Would navigate to ${data.route}`);
  };

  const handleDismissAlert = async (alertId: string) => {
    // Simulate API call to dismiss alert
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Dismissed alert:', alertId);
        resolve(true);
      }, 500);
    });
  };

  const handleSnoozeAlert = async (alertId: string) => {
    // Simulate API call to snooze alert
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Snoozed alert:', alertId);
        resolve(true);
      }, 500);
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'medication': return Zap;
      case 'appointment': return Calendar;
      case 'refill': return ShoppingCart;
      case 'test': return Activity;
      case 'checkup': return Stethoscope;
      default: return AlertTriangle;
    }
  };

  const getAlertIconColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return BrandColors.critical;
      case 'urgent': return BrandColors.urgent;
      case 'dueSoon': return BrandColors.dueSoon;
      default: return BrandColors.neutral;
    }
  };

  const formatDueDate = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  return (
    <View style={styles.container}>
      <HealthPageHeader
        title="Health Alerts"
        subtitle={`${healthAlertsData.criticalCount + healthAlertsData.urgentCount} urgent items`}
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
              <AlertCircle size={24} color={BrandColors.critical} strokeWidth={2} />
              <Text style={[styles.summaryNumber, { color: BrandColors.critical }]}>
                {healthAlertsData.criticalCount}
              </Text>
              <Text style={styles.summaryLabel}>Critical</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: `${BrandColors.urgent}15` }]}>
              <Clock size={24} color={BrandColors.urgent} strokeWidth={2} />
              <Text style={[styles.summaryNumber, { color: BrandColors.urgent }]}>
                {healthAlertsData.urgentCount}
              </Text>
              <Text style={styles.summaryLabel}>Urgent</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: `${BrandColors.dueSoon}15` }]}>
              <Calendar size={24} color={BrandColors.dueSoon} strokeWidth={2} />
              <Text style={[styles.summaryNumber, { color: BrandColors.dueSoon }]}>
                {healthAlertsData.dueSoonCount}
              </Text>
              <Text style={styles.summaryLabel}>Due Soon</Text>
            </View>
          </View>
        </Animated.View>

        {/* Filter Buttons */}
        <Animated.View 
          entering={FadeInUp.delay(200).springify()}
          style={styles.filterContainer}>
          {['all', 'critical', 'urgent', 'dueSoon'].map((filterOption) => (
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
                {filterOption === 'dueSoon' ? 'Due Soon' : 
                 filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Alerts List */}
        <View style={styles.alertsContainer}>
          {filteredAlerts.map((alert, index) => {
            const AlertIcon = getAlertIcon(alert.type);
            const isActioning = actioningAlert === alert.id;
            
            return (
              <Animated.View
                key={alert.id}
                entering={FadeInUp.delay(300 + index * 100).springify()}
                style={styles.alertCard}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                  style={[
                    styles.alertGradient,
                    alert.urgency === 'critical' && styles.criticalBorder,
                    alert.urgency === 'urgent' && styles.urgentBorder,
                  ]}>
                  
                  {/* Alert Header */}
                  <View style={styles.alertHeader}>
                    <View style={styles.alertHeaderLeft}>
                      <View style={[
                        styles.alertIconContainer,
                        { backgroundColor: `${getAlertIconColor(alert.urgency)}15` }
                      ]}>
                        <AlertIcon 
                          size={20} 
                          color={getAlertIconColor(alert.urgency)} 
                          strokeWidth={2} 
                        />
                      </View>
                      <View style={styles.alertInfo}>
                        <Text style={styles.alertTitle}>{alert.title}</Text>
                        {alert.dueDate && (
                          <Text style={[
                            styles.alertDueDate,
                            { color: getAlertIconColor(alert.urgency) }
                          ]}>
                            {formatDueDate(alert.dueDate)}
                          </Text>
                        )}
                      </View>
                    </View>
                    <StatusBadge status={alert.urgency} size="small" />
                  </View>

                  {/* Alert Description */}
                  <Text style={styles.alertDescription}>{alert.description}</Text>

                  {/* Action Buttons */}
                  {alert.actionButtons && alert.actionButtons.length > 0 && (
                    <View style={styles.actionsContainer}>
                      <View style={styles.primaryActions}>
                        {alert.actionButtons.slice(0, 2).map((action) => (
                          <ActionButton
                            key={action.id}
                            title={action.label}
                            size="small"
                            variant={action.action === 'schedule' || action.action === 'refill' ? 'primary' : 'secondary'}
                            loading={isActioning && loading}
                            disabled={isActioning}
                            onPress={() => handleAlertAction(alert, action)}
                          />
                        ))}
                      </View>
                      
                      {/* Secondary Actions */}
                      <View style={styles.secondaryActions}>
                        <TouchableOpacity
                          style={styles.secondaryButton}
                          onPress={() => handleAlertAction(alert, { 
                            id: 'snooze', 
                            label: 'Snooze', 
                            action: 'snooze' 
                          })}
                          disabled={isActioning}>
                          <BellOff size={16} color={BrandColors.textSecondary} strokeWidth={2} />
                          <Text style={styles.secondaryButtonText}>Snooze</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.secondaryButton}
                          onPress={() => handleAlertAction(alert, { 
                            id: 'dismiss', 
                            label: 'Dismiss', 
                            action: 'dismiss' 
                          })}
                          disabled={isActioning}>
                          <X size={16} color={BrandColors.textSecondary} strokeWidth={2} />
                          <Text style={styles.secondaryButtonText}>Dismiss</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Recurring Indicator */}
                  {alert.isRecurring && (
                    <View style={styles.recurringIndicator}>
                      <Bell size={12} color={BrandColors.textSecondary} strokeWidth={2} />
                      <Text style={styles.recurringText}>
                        Recurring {alert.recurringPattern}
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </Animated.View>
            );
          })}
        </View>

        {/* Add Alert Button */}
        <Animated.View 
          entering={FadeInUp.delay(600).springify()}
          style={styles.addButtonContainer}>
          <ActionButton
            title="Create Custom Alert"
            icon={Plus}
            variant="outline"
            fullWidth
            onPress={() => console.log('Add custom alert')}
          />
        </Animated.View>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <Animated.View 
            entering={FadeInUp.delay(400).springify()}
            style={styles.emptyState}>
            <CheckCircle size={48} color={BrandColors.completed} strokeWidth={1.5} />
            <Text style={styles.emptyStateTitle}>All Clear!</Text>
            <Text style={styles.emptyStateText}>
              No {filter === 'all' ? '' : filter} alerts at the moment.
            </Text>
          </Animated.View>
        )}

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
    gap: 8,
  },
  summaryNumber: {
    ...Typography.metric.large,
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
  alertsContainer: {
    gap: 16,
  },
  alertCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  alertGradient: {
    padding: 20,
  },
  criticalBorder: {
    borderLeftWidth: 4,
    borderLeftColor: BrandColors.critical,
  },
  urgentBorder: {
    borderLeftWidth: 4,
    borderLeftColor: BrandColors.urgent,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertInfo: {
    flex: 1,
    gap: 4,
  },
  alertTitle: {
    ...Typography.heading.small,
    color: BrandColors.textPrimary,
  },
  alertDueDate: {
    ...Typography.body.small,
    fontFamily: 'Outfit-SemiBold',
  },
  alertDescription: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  primaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  secondaryButtonText: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  recurringIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  recurringText: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
    fontStyle: 'italic',
  },
  addButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateTitle: {
    ...Typography.heading.medium,
    color: BrandColors.completed,
  },
  emptyStateText: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});