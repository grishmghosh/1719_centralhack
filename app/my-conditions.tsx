import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  Pill,
  FileText,
  Plus,
  Edit3,
  Search,
  Filter,
  BarChart3,
  AlertTriangle,
  Activity,
  Brain,
  Stethoscope,
  Thermometer,
  Scale,
  Eye,
  Zap,
  Shield,
  ChevronRight,
  Star,
  Target
} from 'lucide-react-native';
import { BrandColors, Typography } from '@/constants/Typography';
import { HealthPageHeader, StatusBadge, ActionButton, LoadingState } from '@/components/shared';
import { HealthCondition, MyConditionsData, SymptomLog } from '@/types/health';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function MyConditionsScreen() {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'monitoring' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

  // Mock data - in real app, this would come from API/state management
  const conditionsData: MyConditionsData = {
    conditions: [
      {
        id: 'condition1',
        userId: 'user1',
        name: 'Hypertension',
        type: 'chronic',
        severity: 'moderate',
        status: 'active',
        diagnosedDate: new Date('2023-06-15'),
        lastUpdated: new Date('2024-12-18'),
        description: 'High blood pressure requiring ongoing monitoring and medication management.',
        symptoms: ['headaches', 'dizziness', 'fatigue'],
        relatedMedications: ['med1', 'med2'],
        medications: ['med1', 'med2'],
        specialists: ['Dr. Johnson - Cardiologist'],
        notes: 'Blood pressure well controlled with current medication regimen. Monitor weekly.',
        nextAppointment: new Date('2025-01-10'),
        riskFactors: ['family history', 'sedentary lifestyle', 'stress'],
        lifestyle: {
          dietRestrictions: ['low sodium', 'low fat'],
          exerciseRecommendations: ['30min cardio daily', 'strength training 2x/week'],
          monitoring: ['daily BP readings', 'weekly weight check']
        },
        emergencyActions: [
          'If BP >180/120: Seek immediate medical attention',
          'Check medication compliance',
          'Monitor for chest pain or shortness of breath'
        ],
        relatedConditions: ['condition3'],
        relatedAlerts: [],
        recentSymptoms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'condition2',
        userId: 'user1',
        name: 'Type 2 Diabetes',
        type: 'chronic',
        severity: 'moderate',
        status: 'active',
        diagnosedDate: new Date('2022-03-20'),
        lastUpdated: new Date('2024-12-16'),
        description: 'Type 2 diabetes managed with metformin and lifestyle modifications.',
        symptoms: ['increased thirst', 'frequent urination', 'fatigue'],
        relatedMedications: ['med3'],
        medications: ['med3'],
        specialists: ['Dr. Smith - Endocrinologist'],
        notes: 'HbA1c stable at 7.2%. Continue current management plan.',
        nextAppointment: new Date('2025-01-05'),
        riskFactors: ['obesity', 'family history', 'sedentary lifestyle'],
        lifestyle: {
          dietRestrictions: ['low carb', 'sugar-free'],
          exerciseRecommendations: ['post-meal walks', 'resistance training'],
          monitoring: ['blood glucose 2x daily', 'HbA1c quarterly']
        },
        emergencyActions: [
          'If glucose >400: Seek immediate care',
          'Monitor for DKA symptoms',
          'Check feet daily for wounds'
        ],
        relatedAlerts: [],
        recentSymptoms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'condition3',
        userId: 'user1',
        name: 'Hyperlipidemia',
        type: 'chronic',
        severity: 'mild',
        status: 'monitoring',
        diagnosedDate: new Date('2023-08-10'),
        lastUpdated: new Date('2024-11-20'),
        description: 'Elevated cholesterol levels managed with statin therapy.',
        symptoms: [],
        relatedMedications: ['med4'],
        medications: ['med4'],
        specialists: ['Dr. Johnson - Cardiologist'],
        notes: 'LDL improved from 180 to 120 mg/dL. Continue current statin dose.',
        nextAppointment: new Date('2025-02-15'),
        riskFactors: ['family history', 'diet'],
        lifestyle: {
          dietRestrictions: ['low cholesterol', 'heart healthy'],
          exerciseRecommendations: ['aerobic exercise 150min/week'],
          monitoring: ['lipid panel every 6 months']
        },
        relatedAlerts: [],
        recentSymptoms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'condition4',
        userId: 'user1',
        name: 'Seasonal Allergies',
        type: 'allergic',
        severity: 'mild',
        status: 'active',
        diagnosedDate: new Date('2020-04-01'),
        lastUpdated: new Date('2024-09-15'),
        description: 'Spring and fall allergies affecting eyes and respiratory system.',
        symptoms: ['sneezing', 'watery eyes', 'runny nose'],
        relatedMedications: ['med5'],
        medications: ['med5'],
        specialists: ['Dr. Wilson - Allergist'],
        notes: 'Symptoms well controlled with antihistamines during allergy season.',
        riskFactors: ['environmental allergens'],
        lifestyle: {
          monitoring: ['pollen count tracking', 'symptom diary']
        },
        relatedAlerts: [],
        recentSymptoms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'condition5',
        userId: 'user1',
        name: 'Lower Back Pain',
        type: 'musculoskeletal',
        severity: 'mild',
        status: 'resolved',
        diagnosedDate: new Date('2024-08-01'),
        lastUpdated: new Date('2024-11-30'),
        description: 'Acute lower back strain from lifting. Resolved with physical therapy.',
        symptoms: ['back pain', 'muscle stiffness'],
        relatedMedications: [],
        specialists: ['Dr. Brown - Orthopedist', 'Physical Therapist'],
        notes: 'Completed 8 weeks of PT. Pain resolved. Maintain exercise routine.',
        lifestyle: {
          exerciseRecommendations: ['core strengthening', 'proper lifting technique'],
          monitoring: ['pain level tracking']
        },
        relatedAlerts: [],
        recentSymptoms: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    recentSymptoms: [
      {
        id: 'symptom1',
        conditionId: 'condition1',
        userId: 'user1',
        symptoms: ['headaches'],
        severity: 2,
        notes: 'Mild morning headache, resolved after medication',
        loggedAt: new Date('2024-12-18T10:30:00'),
        createdAt: new Date('2024-12-18T10:30:00'),
      },
      {
        id: 'symptom2',
        conditionId: 'condition2',
        userId: 'user1',
        symptoms: ['fatigue'],
        severity: 3,
        notes: 'Afternoon fatigue, blood sugar was 180',
        loggedAt: new Date('2024-12-17T15:00:00'),
        createdAt: new Date('2024-12-17T15:00:00'),
      }
    ],
    activeCount: 3,
    managedCount: 0,
    monitoringCount: 1,
    resolvedCount: 1,
  };

  const filteredConditions = conditionsData.conditions.filter(condition => {
    const matchesFilter = filter === 'all' || condition.status === filter;
    const matchesSearch = condition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (condition.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  const getConditionIcon = (type: string) => {
    switch (type) {
      case 'chronic': return Heart;
      case 'acute': return Zap;
      case 'allergic': return Shield;
      case 'musculoskeletal': return Activity;
      case 'mental': return Brain;
      case 'cardiovascular': return Heart;
      case 'endocrine': return Target;
      default: return Stethoscope;
    }
  };

  const getConditionColor = (severity: string, status: string) => {
    if (status === 'resolved') return BrandColors.completed;
    switch (severity) {
      case 'severe': return BrandColors.critical;
      case 'moderate': return BrandColors.urgent;
      case 'mild': return BrandColors.dueSoon;
      default: return BrandColors.neutral;
    }
  };

  const getSeverityColor = (severity: string | number) => {
    const severityStr = typeof severity === 'number' ? 
      (severity <= 2 ? 'mild' : severity <= 3 ? 'moderate' : 'severe') : 
      severity;
    switch (severityStr) {
      case 'severe': return BrandColors.critical;
      case 'moderate': return BrandColors.urgent;
      case 'mild': return BrandColors.dueSoon;
      default: return BrandColors.neutral;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTimeSince = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleAddSymptom = (conditionId: string) => {
    console.log('Add symptom for:', conditionId);
    // In real app, would open symptom tracking modal
    Alert.alert('Add Symptom', 'Symptom tracking feature coming soon!');
  };

  const handleViewTrends = (conditionId: string) => {
    console.log('View trends for:', conditionId);
    // In real app, would navigate to detailed analytics
    Alert.alert('View Trends', 'Detailed analytics feature coming soon!');
  };

  const handleEditCondition = (conditionId: string) => {
    console.log('Edit condition:', conditionId);
    // In real app, would open edit modal
    Alert.alert('Edit Condition', 'Edit functionality coming soon!');
  };

  return (
    <View style={styles.container}>
      <HealthPageHeader
        title="My Conditions"
        subtitle={`${conditionsData.activeCount} active conditions`}
        rightElement={
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="white" strokeWidth={2} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <Animated.View 
          entering={FadeInUp.delay(100).springify()}
          style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={BrandColors.textSecondary} strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conditions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={BrandColors.textSecondary}
            />
          </View>
        </Animated.View>

        {/* Summary Stats */}
        <Animated.View 
          entering={FadeInUp.delay(200).springify()}
          style={styles.summaryContainer}>
          <View style={styles.summaryCards}>
            <View style={[styles.summaryCard, { backgroundColor: `${BrandColors.urgent}15` }]}>
              <Activity size={24} color={BrandColors.urgent} strokeWidth={2} />
              <Text style={[styles.summaryNumber, { color: BrandColors.urgent }]}>
                {conditionsData.activeCount}
              </Text>
              <Text style={styles.summaryLabel}>Active</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: `${BrandColors.dueSoon}15` }]}>
              <Eye size={24} color={BrandColors.dueSoon} strokeWidth={2} />
              <Text style={[styles.summaryNumber, { color: BrandColors.dueSoon }]}>
                {conditionsData.monitoringCount}
              </Text>
              <Text style={styles.summaryLabel}>Monitoring</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: `${BrandColors.completed}15` }]}>
              <Shield size={24} color={BrandColors.completed} strokeWidth={2} />
              <Text style={[styles.summaryNumber, { color: BrandColors.completed }]}>
                {conditionsData.resolvedCount}
              </Text>
              <Text style={styles.summaryLabel}>Resolved</Text>
            </View>
          </View>
        </Animated.View>

        {/* Filter Buttons */}
        <Animated.View 
          entering={FadeInUp.delay(300).springify()}
          style={styles.filterContainer}>
          {['all', 'active', 'monitoring', 'resolved'].map((filterOption) => (
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

        {/* Recent Symptoms Quick View */}
        {conditionsData.recentSymptoms.length > 0 && (
          <Animated.View 
            entering={FadeInUp.delay(400).springify()}
            style={styles.recentSymptomsContainer}>
            <Text style={styles.sectionTitle}>Recent Symptoms</Text>
            <View style={styles.symptomsRow}>
              {conditionsData.recentSymptoms.slice(0, 2).map((symptom, index) => (
                <View key={symptom.id} style={styles.symptomCard}>
                  <View style={styles.symptomHeader}>
                    <Thermometer size={16} color={getSeverityColor(symptom.severity)} strokeWidth={2} />
                    <Text style={styles.symptomName}>{symptom.symptoms[0] || 'Symptom'}</Text>
                  </View>
                  <Text style={styles.symptomTime}>{formatTimeSince(symptom.loggedAt)}</Text>
                  <StatusBadge status={symptom.severity <= 2 ? 'mild' : symptom.severity <= 3 ? 'moderate' : 'severe'} size="small" />
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Conditions List */}
        <View style={styles.conditionsContainer}>
          <Text style={styles.sectionTitle}>All Conditions</Text>
          {filteredConditions.map((condition, index) => {
            const ConditionIcon = getConditionIcon(condition.type);
            const isExpanded = selectedCondition === condition.id;
            
            return (
              <Animated.View
                key={condition.id}
                entering={FadeInUp.delay(500 + index * 100).springify()}
                style={styles.conditionCard}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                  style={[
                    styles.conditionGradient,
                    condition.severity === 'severe' && styles.severeBorder,
                    condition.severity === 'moderate' && styles.moderateBorder,
                  ]}>
                  
                  {/* Condition Header */}
                  <TouchableOpacity
                    style={styles.conditionHeader}
                    onPress={() => setSelectedCondition(isExpanded ? null : condition.id)}>
                    <View style={styles.conditionHeaderLeft}>
                      <View style={[
                        styles.conditionIconContainer,
                        { backgroundColor: `${getConditionColor(condition.severity, condition.status)}15` }
                      ]}>
                        <ConditionIcon 
                          size={20} 
                          color={getConditionColor(condition.severity, condition.status)} 
                          strokeWidth={2} 
                        />
                      </View>
                      <View style={styles.conditionInfo}>
                        <Text style={styles.conditionName}>{condition.name}</Text>
                        <Text style={styles.conditionDiagnosed}>
                          Diagnosed {condition.diagnosedDate ? formatDate(condition.diagnosedDate) : 'Unknown'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.conditionHeaderRight}>
                      <StatusBadge status={condition.status} size="small" />
                      <ChevronRight 
                        size={16} 
                        color={BrandColors.textSecondary} 
                        strokeWidth={2}
                        style={{ 
                          transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] 
                        }}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Condition Description */}
                  <Text style={styles.conditionDescription}>{condition.description}</Text>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <Animated.View 
                      entering={FadeInDown.springify()}
                      style={styles.expandedContent}>
                      
                      {/* Medications */}
                      {condition.medications && condition.medications.length > 0 && (
                        <View style={styles.detailSection}>
                          <View style={styles.detailHeader}>
                            <Pill size={16} color={BrandColors.primaryGreen} strokeWidth={2} />
                            <Text style={styles.detailTitle}>Medications</Text>
                          </View>
                          <Text style={styles.detailText}>
                            {condition.medications.length} active prescription{condition.medications.length > 1 ? 's' : ''}
                          </Text>
                        </View>
                      )}

                      {/* Symptoms */}
                      {condition.symptoms && condition.symptoms.length > 0 && (
                        <View style={styles.detailSection}>
                          <View style={styles.detailHeader}>
                            <Thermometer size={16} color={BrandColors.urgent} strokeWidth={2} />
                            <Text style={styles.detailTitle}>Common Symptoms</Text>
                          </View>
                          <Text style={styles.detailText}>
                            {condition.symptoms.join(', ')}
                          </Text>
                        </View>
                      )}

                      {/* Next Appointment */}
                      {condition.nextAppointment && (
                        <View style={styles.detailSection}>
                          <View style={styles.detailHeader}>
                            <Calendar size={16} color={BrandColors.dueSoon} strokeWidth={2} />
                            <Text style={styles.detailTitle}>Next Appointment</Text>
                          </View>
                          <Text style={styles.detailText}>
                            {formatDate(condition.nextAppointment)}
                          </Text>
                        </View>
                      )}

                      {/* Lifestyle Recommendations */}
                      {condition.lifestyle && (
                        <View style={styles.detailSection}>
                          <View style={styles.detailHeader}>
                            <Star size={16} color={BrandColors.primaryGreen} strokeWidth={2} />
                            <Text style={styles.detailTitle}>Lifestyle</Text>
                          </View>
                          {condition.lifestyle.dietRestrictions && (
                            <Text style={styles.detailText}>
                              Diet: {condition.lifestyle.dietRestrictions.join(', ')}
                            </Text>
                          )}
                          {condition.lifestyle.exerciseRecommendations && (
                            <Text style={styles.detailText}>
                              Exercise: {condition.lifestyle.exerciseRecommendations.join(', ')}
                            </Text>
                          )}
                        </View>
                      )}

                      {/* Action Buttons */}
                      <View style={styles.conditionActions}>
                        <ActionButton
                          title="Log Symptom"
                          icon={Plus}
                          size="small"
                          variant="primary"
                          onPress={() => handleAddSymptom(condition.id)}
                        />
                        <ActionButton
                          title="View Trends"
                          icon={BarChart3}
                          size="small"
                          variant="secondary"
                          onPress={() => handleViewTrends(condition.id)}
                        />
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleEditCondition(condition.id)}>
                          <Edit3 size={16} color={BrandColors.textSecondary} strokeWidth={2} />
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  )}
                </LinearGradient>
              </Animated.View>
            );
          })}
        </View>

        {/* Add Condition Button */}
        <Animated.View 
          entering={FadeInUp.delay(800).springify()}
          style={styles.addButtonContainer}>
          <ActionButton
            title="Add New Condition"
            icon={Plus}
            variant="outline"
            fullWidth
            onPress={() => console.log('Add new condition')}
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
  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
  },
  summaryContainer: {
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
  recentSymptomsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.heading.small,
    color: BrandColors.textPrimary,
    marginBottom: 12,
  },
  symptomsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  symptomCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  symptomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  symptomName: {
    ...Typography.body.small,
    color: BrandColors.textPrimary,
    fontFamily: 'Outfit-SemiBold',
  },
  symptomTime: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  conditionsContainer: {
    gap: 16,
  },
  conditionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  conditionGradient: {
    padding: 20,
  },
  severeBorder: {
    borderLeftWidth: 4,
    borderLeftColor: BrandColors.critical,
  },
  moderateBorder: {
    borderLeftWidth: 4,
    borderLeftColor: BrandColors.urgent,
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  conditionHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  conditionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  conditionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionInfo: {
    flex: 1,
    gap: 4,
  },
  conditionName: {
    ...Typography.heading.small,
    color: BrandColors.textPrimary,
  },
  conditionDiagnosed: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  conditionDescription: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  expandedContent: {
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  detailSection: {
    gap: 6,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailTitle: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    fontFamily: 'Outfit-SemiBold',
  },
  detailText: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
    marginLeft: 22,
    lineHeight: 18,
  },
  conditionActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  addButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});