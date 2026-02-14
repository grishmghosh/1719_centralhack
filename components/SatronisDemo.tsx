/**
 * SATRONIS Demo Component
 * 
 * Showcases SATRONIS AI capabilities for hackathon presentation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  Brain,
  FileText,
  Pill,
  Activity,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
} from 'lucide-react-native';
import { useSatronis } from '@/hooks/useSatronis';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  documentType: string;
  icon: any;
  color: string;
  mockFilePath: string;
}

const demoScenarios: DemoScenario[] = [
  {
    id: 'lab_report',
    title: 'Lab Report Analysis',
    description: 'Process blood test results with patient-friendly explanations',
    documentType: 'Laboratory Report',
    icon: Activity,
    color: '#0066CC',
    mockFilePath: 'demo_lab_report.pdf'
  },
  {
    id: 'prescription',
    title: 'Prescription Decoder',
    description: 'Explain medications, dosages, and potential side effects',
    documentType: 'Prescription',
    icon: Pill,
    color: '#10B981',
    mockFilePath: 'demo_prescription.pdf'
  },
  {
    id: 'radiology',
    title: 'Radiology Summary',
    description: 'Simplify imaging reports for better understanding',
    documentType: 'Radiology Report',
    icon: FileText,
    color: '#8B5CF6',
    mockFilePath: 'demo_xray_report.pdf'
  }
];

export function SatronisDemo() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const cardScale = useSharedValue(1);
  
  const { 
    isProcessing, 
    processingStatus, 
    result, 
    error, 
    processDocument, 
    clearResult,
    getCapabilities 
  } = useSatronis();

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handleCardPress = () => {
    cardScale.value = withSpring(0.95, { duration: 150 });
    setTimeout(() => {
      cardScale.value = withSpring(1, { duration: 150 });
    }, 150);
  };

  const runDemo = async (scenario: DemoScenario) => {
    setSelectedScenario(scenario.id);
    
    Alert.alert(
      'SATRONIS Demo',
      `Process ${scenario.title}?\n\nThis will demonstrate AI-powered medical document analysis with safety-first approach.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Run Demo', 
          onPress: async () => {
            try {
              await processDocument(scenario.mockFilePath, {
                enableSummary: true,
                enableExtraction: true,
                confidenceThreshold: 0.7
              });
            } catch (err) {
              Alert.alert('Demo Error', 'Failed to run demo scenario');
            }
          }
        }
      ]
    );
  };

  const capabilities = getCapabilities();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View 
        entering={FadeInUp.delay(100).springify()}
        style={styles.header}>
        <LinearGradient
          colors={['#8B5CF6', '#6366F1']}
          style={styles.headerGradient}>
          <Brain size={32} color="white" strokeWidth={2} />
          <Text style={styles.headerTitle}>SATRONIS</Text>
          <Text style={styles.headerSubtitle}>AI-Powered Medical Assistant</Text>
        </LinearGradient>
      </Animated.View>

      {/* Features Overview */}
      <Animated.View 
        entering={FadeInUp.delay(200).springify()}
        style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <Shield size={20} color="#10B981" strokeWidth={2} />
            <Text style={styles.featureText}>Safety First</Text>
          </View>
          <View style={styles.featureItem}>
            <CheckCircle size={20} color="#0066CC" strokeWidth={2} />
            <Text style={styles.featureText}>Source Citations</Text>
          </View>
          <View style={styles.featureItem}>
            <Zap size={20} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.featureText}>Fast Processing</Text>
          </View>
          <View style={styles.featureItem}>
            <Brain size={20} color="#8B5CF6" strokeWidth={2} />
            <Text style={styles.featureText}>AI Powered</Text>
          </View>
        </View>
      </Animated.View>

      {/* Demo Scenarios */}
      <Animated.View 
        entering={FadeInUp.delay(300).springify()}
        style={styles.scenariosContainer}>
        <Text style={styles.sectionTitle}>Demo Scenarios</Text>
        <View style={styles.scenariosList}>
          {demoScenarios.map((scenario, index) => (
            <Animated.View
              key={scenario.id}
              entering={FadeInUp.delay(400 + index * 100).springify()}>
              <AnimatedTouchableOpacity
                style={[styles.scenarioCard, animatedCardStyle]}
                onPress={() => {
                  handleCardPress();
                  runDemo(scenario);
                }}
                disabled={isProcessing}>
                <BlurView intensity={30} tint="light" style={styles.scenarioBlur}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                    style={styles.scenarioGradient}>
                    <View style={[styles.scenarioIcon, { backgroundColor: `${scenario.color}15` }]}>
                      <scenario.icon size={24} color={scenario.color} strokeWidth={2} />
                    </View>
                    <View style={styles.scenarioContent}>
                      <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                      <Text style={styles.scenarioDescription}>{scenario.description}</Text>
                      <Text style={styles.scenarioType}>{scenario.documentType}</Text>
                    </View>
                    {selectedScenario === scenario.id && isProcessing && (
                      <View style={styles.processingIndicator}>
                        <Clock size={16} color="#8B5CF6" strokeWidth={2} />
                      </View>
                    )}
                  </LinearGradient>
                </BlurView>
              </AnimatedTouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Processing Status */}
      {isProcessing && processingStatus && (
        <Animated.View 
          entering={FadeInUp.springify()}
          style={styles.statusContainer}>
          <BlurView intensity={35} tint="light" style={styles.statusBlur}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.05)']}
              style={styles.statusGradient}>
              <View style={styles.statusHeader}>
                <Brain size={20} color="#8B5CF6" strokeWidth={2} />
                <Text style={styles.statusTitle}>Processing with SATRONIS</Text>
              </View>
              <Text style={styles.statusMessage}>{processingStatus.message}</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressFill, { width: `${processingStatus.progress}%` }]} 
                  />
                </View>
                <Text style={styles.progressText}>{processingStatus.progress}%</Text>
              </View>
            </LinearGradient>
          </BlurView>
        </Animated.View>
      )}

      {/* Results Summary */}
      {result && (
        <Animated.View 
          entering={FadeInUp.springify()}
          style={styles.resultsContainer}>
          <BlurView intensity={40} tint="light" style={styles.resultsBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.8)']}
              style={styles.resultsGradient}>
              <View style={styles.resultsHeader}>
                <CheckCircle size={24} color="#10B981" strokeWidth={2} />
                <Text style={styles.resultsTitle}>Analysis Complete</Text>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>
                    {Math.round(result.confidence.overall * 100)}% Confidence
                  </Text>
                </View>
              </View>

              <View style={styles.resultsSummary}>
                <Text style={styles.summaryTitle}>AI Summary Generated</Text>
                <Text style={styles.summaryPreview}>
                  {result.summary.patientFriendly.substring(0, 150)}...
                </Text>
              </View>

              <View style={styles.resultsStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{result.summary.keyFindings.length}</Text>
                  <Text style={styles.statLabel}>Key Findings</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{result.structuredData.testResults.length}</Text>
                  <Text style={styles.statLabel}>Test Results</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{Math.round(result.processingTime / 1000)}s</Text>
                  <Text style={styles.statLabel}>Process Time</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  clearResult();
                  setSelectedScenario(null);
                }}>
                <Text style={styles.clearButtonText}>Clear Results</Text>
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>
        </Animated.View>
      )}

      {/* Error Display */}
      {error && (
        <Animated.View 
          entering={FadeInUp.springify()}
          style={styles.errorContainer}>
          <BlurView intensity={30} tint="light" style={styles.errorBlur}>
            <LinearGradient
              colors={['rgba(239, 68, 68, 0.1)', 'rgba(220, 38, 38, 0.05)']}
              style={styles.errorGradient}>
              <AlertTriangle size={20} color="#EF4444" strokeWidth={2} />
              <Text style={styles.errorText}>{error}</Text>
            </LinearGradient>
          </BlurView>
        </Animated.View>
      )}

      {/* Capabilities Info */}
      <Animated.View 
        entering={FadeInUp.delay(500).springify()}
        style={styles.capabilitiesContainer}>
        <Text style={styles.sectionTitle}>Technical Capabilities</Text>
        <BlurView intensity={25} tint="light" style={styles.capabilitiesBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']}
            style={styles.capabilitiesGradient}>
            <View style={styles.capabilityRow}>
              <Text style={styles.capabilityLabel}>Supported Formats:</Text>
              <Text style={styles.capabilityValue}>
                {capabilities.supportedFormats.join(', ').toUpperCase()}
              </Text>
            </View>
            <View style={styles.capabilityRow}>
              <Text style={styles.capabilityLabel}>Max File Size:</Text>
              <Text style={styles.capabilityValue}>
                {Math.round(capabilities.maxFileSize / (1024 * 1024))}MB
              </Text>
            </View>
            <View style={styles.capabilityRow}>
              <Text style={styles.capabilityLabel}>Document Types:</Text>
              <Text style={styles.capabilityValue}>
                {capabilities.supportedDocumentTypes.length} Types
              </Text>
            </View>
          </LinearGradient>
        </BlurView>
      </Animated.View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  
  header: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  headerGradient: {
    padding: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
  },

  featuresContainer: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 8,
  },

  scenariosContainer: {
    margin: 20,
  },
  scenariosList: {
    gap: 16,
  },
  scenarioCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  scenarioBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  scenarioGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  scenarioIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scenarioContent: {
    flex: 1,
  },
  scenarioTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  scenarioDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  scenarioType: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    textTransform: 'uppercase',
  },
  processingIndicator: {
    padding: 8,
  },

  statusContainer: {
    margin: 20,
  },
  statusBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  statusGradient: {
    padding: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  statusMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    minWidth: 35,
  },

  resultsContainer: {
    margin: 20,
  },
  resultsBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  resultsGradient: {
    padding: 24,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  resultsSummary: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  summaryPreview: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  resultsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  clearButton: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },

  errorContainer: {
    margin: 20,
  },
  errorBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  errorGradient: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
    textAlign: 'center',
    marginLeft: 8,
  },

  capabilitiesContainer: {
    margin: 20,
  },
  capabilitiesBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  capabilitiesGradient: {
    padding: 20,
  },
  capabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  capabilityLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  capabilityValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },

  bottomSpacing: {
    height: 40,
  },
});