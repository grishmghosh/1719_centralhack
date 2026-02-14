/**
 * AI Summary Component for Medical Records
 * Provides patient-friendly summaries and key insights
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandColors, Typography } from '@/constants/Typography';
import Animated, { 
  FadeInUp,
} from 'react-native-reanimated';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { useMedicalAI, type CompleteAnalysis } from '@/hooks/useMedicalAI';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface AISummaryComponentProps {
  record: any;
  expanded?: boolean;
}

export default function AISummaryComponent({ record, expanded = false }: AISummaryComponentProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [analysis, setAnalysis] = useState<CompleteAnalysis | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  const { loading, error, analyzeComplete, checkHealth } = useMedicalAI();

  const performAnalysis = async () => {
    if (hasAnalyzed || !record) return;
    
    try {
      // Check if AI service is available
      const isHealthy = await checkHealth();
      if (!isHealthy) {
        Alert.alert(
          'AI Service Unavailable',
          'The AI analysis service is currently offline. Please try again later.'
        );
        return;
      }

      // Analyze the medical record
      const result = await analyzeComplete(record.content || record.title, record.type);
      setAnalysis(result);
      setHasAnalyzed(true);
    } catch (err) {
      console.error('AI Analysis Error:', err);
      Alert.alert(
        'Analysis Error',
        'Unable to generate AI analysis at this time. Please try again later.'
      );
    }
  };

  useEffect(() => {
    if (isExpanded && !hasAnalyzed) {
      performAnalysis();
    }
  }, [isExpanded]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return BrandColors.error;
      case 'MEDIUM': return BrandColors.warning;
      case 'LOW': return BrandColors.primaryGreen;
      default: return BrandColors.textTertiary;
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return AlertTriangle;
      case 'MEDIUM': return Info;
      case 'LOW': return CheckCircle;
      default: return Info;
    }
  };

  return (
    <Animated.View entering={FadeInUp.duration(600)} style={styles.container}>
      {/* AI Summary Header */}
      <AnimatedTouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <LinearGradient
          colors={[BrandColors.deepTeal, BrandColors.primaryGreen]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Sparkles size={20} color="white" strokeWidth={2} />
              <Text style={styles.headerTitle}>AI Health Insights</Text>
            </View>
            <View style={styles.headerRight}>
              {loading && <ActivityIndicator size="small" color="white" />}
              {isExpanded ? (
                <ChevronUp size={20} color="white" strokeWidth={2} />
              ) : (
                <ChevronDown size={20} color="white" strokeWidth={2} />
              )}
            </View>
          </View>
        </LinearGradient>
      </AnimatedTouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.content}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={BrandColors.deepTeal} />
              <Text style={styles.loadingText}>Analyzing medical record...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <AlertTriangle size={24} color={BrandColors.error} strokeWidth={2} />
              <Text style={styles.errorText}>Analysis temporarily unavailable</Text>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={() => {
                  setHasAnalyzed(false);
                  performAnalysis();
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {analysis && !loading && (
            <View style={styles.analysisContainer}>
              {/* Risk Assessment */}
              <View style={styles.riskContainer}>
                <View style={styles.riskHeader}>
                  {React.createElement(getRiskIcon(analysis.risk_assessment.risk_level), {
                    size: 20,
                    color: getRiskColor(analysis.risk_assessment.risk_level),
                    strokeWidth: 2
                  })}
                  <Text style={[styles.riskLevel, { color: getRiskColor(analysis.risk_assessment.risk_level) }]}>
                    {analysis.risk_assessment.risk_level} PRIORITY
                  </Text>
                </View>
                <Text style={styles.riskExplanation}>
                  {analysis.risk_assessment.explanation}
                </Text>
              </View>

              {/* Patient-Friendly Summary */}
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>What This Means for You</Text>
                <Text style={styles.summaryText}>
                  {analysis.summary.summary}
                </Text>
              </View>

              {/* Key Information */}
              {analysis.key_information.extracted_info && (
                <View style={styles.keyInfoContainer}>
                  <Text style={styles.keyInfoTitle}>Key Information</Text>
                  
                  {analysis.key_information.extracted_info.medications.length > 0 && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Medications:</Text>
                      <Text style={styles.infoValue}>
                        {analysis.key_information.extracted_info.medications.join(', ')}
                      </Text>
                    </View>
                  )}
                  
                  {analysis.key_information.extracted_info.conditions.length > 0 && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Conditions:</Text>
                      <Text style={styles.infoValue}>
                        {analysis.key_information.extracted_info.conditions.join(', ')}
                      </Text>
                    </View>
                  )}
                  
                  {analysis.key_information.extracted_info.instructions.length > 0 && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Instructions:</Text>
                      <Text style={styles.infoValue}>
                        {analysis.key_information.extracted_info.instructions.join('; ')}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Confidence Indicator */}
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceText}>
                  Analysis Confidence: {Math.round((analysis.summary.confidence || 0.8) * 100)}%
                </Text>
                <Text style={styles.modelText}>
                  Powered by {analysis.summary.model}
                </Text>
              </View>
            </View>
          )}

          {!loading && !error && !hasAnalyzed && (
            <View style={styles.promptContainer}>
              <Text style={styles.promptText}>
                Tap to generate AI-powered insights for this medical record
              </Text>
              <TouchableOpacity style={styles.analyzeButton} onPress={performAnalysis}>
                <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.body.medium,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    ...Typography.ui.caption,
    color: BrandColors.textSecondary,
    marginTop: 8,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  errorText: {
    ...Typography.body.medium,
    color: BrandColors.error,
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: BrandColors.error,
    borderRadius: 8,
  },
  retryButtonText: {
    ...Typography.ui.caption,
    color: 'white',
    fontWeight: '600',
  },
  analysisContainer: {
    gap: 16,
  },
  riskContainer: {
    padding: 12,
    backgroundColor: BrandColors.softMint,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: BrandColors.primaryGreen,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  riskLevel: {
    ...Typography.ui.caption,
    fontWeight: '700',
    marginLeft: 6,
  },
  riskExplanation: {
    ...Typography.ui.caption,
    color: BrandColors.textSecondary,
  },
  summaryContainer: {
    padding: 12,
    backgroundColor: BrandColors.mintGreen,
    borderRadius: 12,
  },
  summaryTitle: {
    ...Typography.body.medium,
    fontWeight: '600',
    color: BrandColors.deepTeal,
    marginBottom: 8,
  },
  summaryText: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    lineHeight: 20,
  },
  keyInfoContainer: {
    padding: 12,
    backgroundColor: BrandColors.cream,
    borderRadius: 12,
  },
  keyInfoTitle: {
    ...Typography.body.medium,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    marginBottom: 8,
  },
  infoRow: {
    marginBottom: 6,
  },
  infoLabel: {
    ...Typography.ui.caption,
    fontWeight: '600',
    color: BrandColors.deepTeal,
  },
  infoValue: {
    ...Typography.ui.caption,
    color: BrandColors.textSecondary,
    marginLeft: 8,
  },
  confidenceContainer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BrandColors.textTertiary,
  },
  confidenceText: {
    ...Typography.ui.caption,
    color: BrandColors.textSecondary,
  },
  modelText: {
    ...Typography.ui.caption,
    color: BrandColors.textTertiary,
    fontSize: 10,
  },
  promptContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  promptText: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  analyzeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: BrandColors.deepTeal,
    borderRadius: 12,
  },
  analyzeButtonText: {
    ...Typography.body.medium,
    color: 'white',
    fontWeight: '600',
  },
});