import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BrandColors, Typography } from '@/constants/Typography';

// Consistent Design System (matching homepage)
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
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import {
  Search,
  Filter,
  FileText,
  Image as ImageIcon,
  Activity,
  Pill,
  Upload,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Heart,
  Scissors,
  Shield,
  Zap,
  User,
  Calendar,
  ChevronRight,
  Download,
  Share2,
  Star,
} from 'lucide-react-native';
import { useSatronis, useSatronisSafety } from '@/hooks/useSatronis';
import RecordDetailModal from '@/components/RecordDetailModal';
import { supabase, transformDatabaseRecord, DatabaseRecord } from '@/lib/supabase';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function RecordsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardScale = useSharedValue(1);

  // SATRONIS integration
  const { 
    isProcessing, 
    processingStatus, 
    result, 
    error: satronisError, 
    processDocument, 
    clearResult, 
    clearError 
  } = useSatronis();
  
  const { safetyAlerts, checkSafety, clearSafetyAlerts } = useSatronisSafety();

  // Comprehensive Medical Record Categories
  const recordCategories = [
    'All', 'Lab Reports', 'Imaging', 'Prescriptions', 'Consultations', 
    'Implants', 'Surgeries', 'Vaccines', 'Emergency'
  ];

  // Fetch medical records from Supabase
  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all records from Supabase, ordered by medical record date
      const { data, error: fetchError } = await supabase
        .from('medical_records')
        .select('*')
        .order('date', { ascending: false }); // Order by medical record date, not creation date

      if (fetchError) {
        throw fetchError;
      }

      if (!data || data.length === 0) {
        console.log('No records found in database');
        setRecords([]);
        return;
      }

      // Transform database records to UI format
      const transformedRecords = data.map((record, index) => {
        try {
          return transformDatabaseRecord(record);
        } catch (error) {
          console.error(`Error transforming record ${index}:`, error, record);
          return null;
        }
      }).filter(Boolean);
      
      // Additional client-side sorting by date to ensure proper chronological order
      const sortedRecords = transformedRecords.sort((a, b) => {
        if (!a || !b) return 0;
        
        // Parse dates for comparison (handle various date formats)
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // If dates are invalid, fallback to string comparison
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          return b.date.localeCompare(a.date);
        }
        
        // Most recent first (descending order)
        return dateB.getTime() - dateA.getTime();
      });
      
      setRecords(sortedRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch medical records');
      console.error('Error fetching medical records:', err);
    } finally {
      setLoading(false);
    }
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handleCardPress = (record: any) => {
    cardScale.value = withSpring(0.95, { duration: 150 });
    setTimeout(() => {
      cardScale.value = withSpring(1, { duration: 150 });
      setSelectedRecord(record);
    }, 150);
  };

  const closeRecordDetail = () => {
    setSelectedRecord(null);
  };

  const filteredRecords = records.filter((record: any) => {
    const matchesCategory = selectedCategory === 'All' || record.type === selectedCategory;
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'critical': return BrandColors.error;
      case 'attention': return BrandColors.warning;
      case 'monitor': return BrandColors.deepTeal;
      default: return BrandColors.primaryGreen;
    }
  };

  const handleUploadDocument = () => {
    router.push('/add-record');
  };

  return (
    <View style={[styles.container, { backgroundColor: BrandColors.cream }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.header}>
          <Text style={styles.title}>Medical Records</Text>
          <Text style={styles.subtitle}>Your complete health history</Text>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View 
          entering={FadeInUp.delay(200).springify()}
          style={styles.searchContainer}>
          <View style={styles.searchCard}>
            <View style={styles.searchInputContainer}>
              <Search size={IconSizes.medium} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search medical records..."
                placeholderTextColor={BrandColors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.filterButton}>
                <Filter size={IconSizes.medium} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Category Filter */}
        <Animated.View 
          entering={FadeInUp.delay(250).springify()}
          style={styles.categoryContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}>
            {recordCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category)}>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Upload Button */}
        <Animated.View 
          entering={FadeInUp.delay(300).springify()}
          style={styles.uploadContainer}>
          <AnimatedTouchableOpacity
            style={[styles.uploadButton, animatedCardStyle]}
            onPress={handleUploadDocument}
            disabled={isProcessing}>
            <View style={styles.uploadCard}>
              <LinearGradient
                colors={[`${BrandColors.primaryGreen}08`, `${BrandColors.mintGreen}05`]}
                style={styles.uploadGradient}>
                <Upload size={IconSizes.xlarge} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                <Text style={styles.uploadText}>Upload Medical Document</Text>
                <Text style={styles.uploadSubtext}>Enhanced with AI-powered insights</Text>
              </LinearGradient>
            </View>
          </AnimatedTouchableOpacity>
        </Animated.View>

        {/* Enhanced Processing Status */}
        {isProcessing && processingStatus && (
          <Animated.View 
            entering={FadeInUp.springify()}
            style={styles.processingContainer}>
            <View style={styles.processingCard}>
              <LinearGradient
                colors={[`${BrandColors.mintGreen}12`, `${BrandColors.mintGreen}06`]}
                style={styles.processingGradient}>
                <View style={styles.processingHeader}>
                  <View style={styles.processingIconContainer}>
                    <LinearGradient
                      colors={[BrandColors.deepTeal, BrandColors.primaryGreen, BrandColors.mintGreen]}
                      style={styles.processingIconGradient}>
                      <Activity size={IconSizes.medium} color="white" strokeWidth={STROKE_WIDTH} />
                    </LinearGradient>
                  </View>
                  <Text style={styles.processingTitle}>Processing Document</Text>
                </View>
                <Text style={styles.processingMessage}>{processingStatus.message}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[styles.progressFill, { width: `${processingStatus.progress}%` }]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{processingStatus.progress}%</Text>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        )}

        {/* Enhanced Analysis Results */}
        {result && (
          <Animated.View 
            entering={FadeInUp.springify()}
            style={styles.resultsContainer}>
            <View style={styles.resultsCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                style={styles.resultsGradient}>
                <View style={styles.resultsHeader}>
                  <View style={styles.resultsIconContainer}>
                    <LinearGradient
                      colors={[BrandColors.deepTeal, BrandColors.primaryGreen, BrandColors.mintGreen]}
                      style={styles.resultsIconGradient}>
                      <CheckCircle size={IconSizes.large} color="white" strokeWidth={STROKE_WIDTH} />
                    </LinearGradient>
                  </View>
                  <View style={styles.resultsHeaderText}>
                    <Text style={styles.resultsTitle}>Analysis Complete</Text>
                    <Text style={styles.resultsSubtitle}>AI-enhanced medical insights</Text>
                  </View>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>
                      {Math.round(result.confidence.overall * 100)}%
                    </Text>
                  </View>
                </View>

                {/* Safety Alerts */}
                {safetyAlerts.length > 0 && (
                  <View style={styles.safetyAlerts}>
                    {safetyAlerts.map((alert, index) => (
                      <View key={index} style={styles.safetyAlert}>
                        <AlertTriangle size={IconSizes.small} color={BrandColors.warning} strokeWidth={STROKE_WIDTH} />
                        <Text style={styles.safetyAlertText}>{alert}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* AI Summary */}
                <View style={styles.summarySection}>
                  <Text style={styles.sectionTitle}>Patient-Friendly Summary</Text>
                  <Text style={styles.summaryText}>{result.summary.patientFriendly}</Text>
                </View>

                {/* Key Findings */}
                {result.summary.keyFindings.length > 0 && (
                  <View style={styles.findingsSection}>
                    <Text style={styles.sectionTitle}>Key Findings</Text>
                    {result.summary.keyFindings.map((finding, index) => (
                      <View key={index} style={styles.findingItem}>
                        <CheckCircle size={IconSizes.small} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                        <Text style={styles.findingText}>{finding}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Abnormal Values */}
                {result.summary.abnormalValues.length > 0 && (
                  <View style={styles.abnormalSection}>
                    <Text style={styles.sectionTitle}>Values Outside Normal Range</Text>
                    {result.summary.abnormalValues.map((value, index) => (
                      <View key={index} style={styles.abnormalItem}>
                        <View style={styles.abnormalHeader}>
                          <Text style={styles.abnormalTest}>{value.test}</Text>
                          <Text style={styles.abnormalValue}>{value.value}</Text>
                        </View>
                        <Text style={styles.abnormalRange}>Normal: {value.normalRange}</Text>
                        <Text style={styles.abnormalExplanation}>{value.explanation}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Medical Disclaimer */}
                <View style={styles.disclaimerSection}>
                  <Text style={styles.disclaimerText}>{result.summary.disclaimer}</Text>
                </View>

                {/* Clear Results Button */}
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => {
                    clearResult();
                    clearSafetyAlerts();
                  }}>
                  <Text style={styles.clearButtonText}>Clear Results</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Animated.View>
        )}

        {/* Error Display */}
        {error && (
          <Animated.View 
            entering={FadeInUp.springify()}
            style={styles.errorContainer}>
            <View style={styles.errorCard}>
              <LinearGradient
                colors={[`${BrandColors.error}08`, `${BrandColors.error}04`]}
                style={styles.errorGradient}>
                <AlertTriangle size={IconSizes.medium} color={BrandColors.error} strokeWidth={STROKE_WIDTH} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                  style={styles.errorButton}
                  onPress={() => setError(null)}>
                  <Text style={styles.errorButtonText}>Dismiss</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Animated.View>
        )}

        {/* SATRONIS Error Display */}
        {satronisError && (
          <Animated.View 
            entering={FadeInUp.springify()}
            style={styles.errorContainer}>
            <View style={styles.errorCard}>
              <LinearGradient
                colors={[`${BrandColors.error}08`, `${BrandColors.error}04`]}
                style={styles.errorGradient}>
                <AlertTriangle size={IconSizes.medium} color={BrandColors.error} strokeWidth={STROKE_WIDTH} />
                <Text style={styles.errorText}>{satronisError}</Text>
                <TouchableOpacity 
                  style={styles.errorButton}
                  onPress={clearError}>
                  <Text style={styles.errorButtonText}>Dismiss</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Animated.View>
        )}

        {/* Loading State */}
        {loading ? (
          <Animated.View 
            entering={FadeInUp.springify()}
            style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={BrandColors.primaryGreen} />
            <Text style={styles.loadingText}>Loading medical records...</Text>
          </Animated.View>
        ) : (
          /* Records List */
          <Animated.View 
            entering={FadeInUp.delay(400).springify()}
            style={styles.recordsList}>
            {filteredRecords.map((record, index) => (
              <Animated.View
                key={record.id}
                entering={FadeInUp.delay(500 + index * 100).springify()}>
                <AnimatedTouchableOpacity
                  style={[styles.recordCard, animatedCardStyle]}
                  onPress={() => handleCardPress(record)}>
                  <View style={styles.recordCardInner}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                      style={styles.recordGradient}>
                      <View style={styles.recordHeader}>
                        <View style={styles.recordIconContainer}>
                          <record.icon size={IconSizes.large} color={getUrgencyColor(record.urgency)} strokeWidth={STROKE_WIDTH} />
                        </View>
                        <View style={styles.recordInfo}>
                          <View style={styles.recordTitleRow}>
                            <Text style={styles.recordTitle}>{record.title}</Text>
                            {record.urgency !== 'normal' && (
                              <View style={[styles.urgencyBadge, { backgroundColor: `${getUrgencyColor(record.urgency)}15` }]}>
                                <Text style={[styles.urgencyText, { color: getUrgencyColor(record.urgency) }]}>
                                  {record.urgency.toUpperCase()}
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.recordDate}>{record.date}</Text>
                          <View style={styles.recordMetadata}>
                            <Text style={styles.recordType}>{record.type}</Text>
                            <Text style={styles.recordProvider}>{record.provider}</Text>
                          </View>
                        </View>
                        <View style={styles.recordActions}>
                          <ChevronRight size={IconSizes.medium} color={BrandColors.textTertiary} strokeWidth={STROKE_WIDTH} />
                        </View>
                      </View>
                      {record.hasAiSummary && (
                        <View style={styles.aiSummary}>
                          <View style={styles.aiLabelContainer}>
                            <View style={styles.aiIndicatorIcon}>
                              <LinearGradient
                                colors={[BrandColors.deepTeal, BrandColors.primaryGreen]}
                                style={styles.aiIndicatorGradient}>
                                <Sparkles size={IconSizes.small} color="white" strokeWidth={STROKE_WIDTH} />
                              </LinearGradient>
                            </View>
                            <Text style={styles.aiLabel}>AI Insights</Text>
                          </View>
                          <Text style={styles.aiText}>
                            {record.aiSummary || (
                              record.type === 'Lab Reports' ? 'Lab values analyzed - see detailed breakdown for any concerning results.' :
                              record.type === 'Imaging' ? 'Image analysis complete - key findings highlighted for your review.' :
                              record.type === 'Consultations' ? 'Visit summary generated with key recommendations and follow-up actions.' :
                              record.type === 'Implants' ? 'Device status monitored - next maintenance check scheduled.' :
                              record.type === 'Surgeries' ? 'Procedure outcome documented - recovery timeline on track.' :
                              record.type === 'Emergency' ? 'Emergency visit summary - important follow-up care noted.' :
                              'AI analysis available for this record.'
                            )}
                          </Text>
                        </View>
                      )}
                      {record.medical_content && record.medical_content !== 'No additional notes provided' && (
                        <View style={styles.notesSection}>
                          <Text style={styles.notesLabel}>Notes</Text>
                          <Text style={styles.notesText}>{record.medical_content}</Text>
                        </View>
                      )}
                      {(record.record_data?.imageUri || record.record_data?.images) && (
                        <View style={styles.imageSection}>
                          <Text style={styles.imageLabel}>Attached Document</Text>
                          {record.record_data.imageUri ? (
                            <Image 
                              source={{ uri: record.record_data.imageUri }}
                              style={styles.attachedImage}
                              resizeMode="cover"
                            />
                          ) : record.record_data.images && record.record_data.images.length > 0 ? (
                            <Image 
                              source={{ uri: record.record_data.images[0] }}
                              style={styles.attachedImage}
                              resizeMode="cover"
                            />
                          ) : null}
                        </View>
                      )}
                    </LinearGradient>
                  </View>
                </AnimatedTouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Record Detail Modal */}
      <RecordDetailModal
        record={selectedRecord}
        visible={!!selectedRecord}
        onClose={closeRecordDetail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    ...Typography.heading.hero,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
  },
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  searchCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.md,
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    marginLeft: Spacing.sm,
    marginRight: Spacing.sm,
  },
  filterButton: {
    padding: 4,
  },
  uploadContainer: {
    marginBottom: Spacing.lg,
  },
  uploadButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  uploadCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  uploadGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  uploadText: {
    ...Typography.ui.label,
    fontSize: 18,
    color: BrandColors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  uploadSubtext: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  recordsList: {
    gap: Spacing.md,
  },
  recordCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  recordCardInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  recordGradient: {
    padding: Spacing.md,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recordIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${BrandColors.primaryGreen}08`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    ...Typography.ui.label,
    fontSize: 18,
    color: BrandColors.textPrimary,
    marginBottom: 0,
    flex: 1,
    minWidth: '60%',
  },
  recordDate: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
    marginBottom: 2,
  },
  recordType: {
    ...Typography.ui.labelSmall,
    color: BrandColors.primaryGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIndicatorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  aiIndicatorGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSummary: {
    marginTop: Spacing.md,
    backgroundColor: `${BrandColors.mintGreen}08`,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: BrandColors.primaryGreen,
  },
  aiLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  aiLabel: {
    ...Typography.ui.labelSmall,
    color: BrandColors.primaryGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: Spacing.sm,
  },
  aiText: {
    ...Typography.body.small,
    color: BrandColors.textPrimary,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 120,
  },

  // Category Filter Styles
  categoryContainer: {
    marginBottom: Spacing.lg,
  },
  categoryScrollContent: {
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: `${BrandColors.primaryGreen}20`,
  },
  categoryButtonActive: {
    backgroundColor: BrandColors.primaryGreen,
    borderColor: BrandColors.primaryGreen,
  },
  categoryText: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
    fontWeight: '600',
  },

  // Enhanced Record Card Styles
  recordTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  urgencyBadge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  urgencyText: {
    ...Typography.ui.labelSmall,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  recordMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  recordProvider: {
    ...Typography.body.small,
    color: BrandColors.textTertiary,
    fontStyle: 'italic',
  },
  recordActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  
  // Enhanced Processing Styles
  processingContainer: {
    marginBottom: Spacing.lg,
  },
  processingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.md,
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  processingGradient: {
    padding: Spacing.md,
  },
  processingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  processingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  processingIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingTitle: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
  },
  processingMessage: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    marginBottom: Spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: `${BrandColors.primaryGreen}20`,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BrandColors.primaryGreen,
    borderRadius: 3,
  },
  progressText: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textSecondary,
    minWidth: 32,
  },

  // Enhanced Results Styles
  resultsContainer: {
    marginBottom: Spacing.lg,
  },
  resultsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.lg,
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  resultsGradient: {
    padding: Spacing.lg,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  resultsIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsHeaderText: {
    flex: 1,
  },
  resultsTitle: {
    ...Typography.ui.label,
    fontSize: 18,
    color: BrandColors.textPrimary,
  },
  resultsSubtitle: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  confidenceBadge: {
    backgroundColor: `${BrandColors.primaryGreen}12`,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  confidenceText: {
    ...Typography.ui.labelSmall,
    color: BrandColors.primaryGreen,
    fontWeight: '600',
  },

  // Safety Alerts
  safetyAlerts: {
    marginBottom: Spacing.md,
  },
  safetyAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${BrandColors.warning}08`,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  safetyAlertText: {
    ...Typography.body.medium,
    color: BrandColors.warning,
    marginLeft: Spacing.sm,
    flex: 1,
  },

  // Summary Section
  summarySection: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  summaryText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    lineHeight: 20,
  },

  // Findings Section
  findingsSection: {
    marginBottom: Spacing.md,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  findingText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 18,
  },

  // Abnormal Values Section
  abnormalSection: {
    marginBottom: 20,
  },
  abnormalItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  abnormalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  abnormalTest: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  abnormalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
  },
  abnormalRange: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  abnormalExplanation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 18,
  },

  // Disclaimer Section
  disclaimerSection: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    lineHeight: 16,
    textAlign: 'center',
  },

  // Action Buttons
  clearButton: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },

  // Error Styles
  errorContainer: {
    marginBottom: Spacing.lg,
  },
  errorCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.md,
    shadowColor: BrandColors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorGradient: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  errorText: {
    ...Typography.body.medium,
    color: BrandColors.error,
    textAlign: 'center',
    marginVertical: Spacing.sm,
  },
  errorButton: {
    backgroundColor: `${BrandColors.error}12`,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  errorButtonText: {
    ...Typography.ui.labelSmall,
    color: BrandColors.error,
    fontWeight: '600',
  },

  // Loading Styles
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    marginTop: Spacing.md,
  },

  // Notes Section Styles
  notesSection: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: `${BrandColors.textTertiary}20`,
  },
  notesLabel: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  notesText: {
    ...Typography.body.small,
    color: BrandColors.textPrimary,
    lineHeight: 20,
  },

  // Image Section Styles
  imageSection: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: `${BrandColors.textTertiary}20`,
  },
  imageLabel: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  attachedImage: {
    width: '100%',
    height: 120,
    borderRadius: BorderRadius.sm,
    backgroundColor: `${BrandColors.textTertiary}10`,
  },
});