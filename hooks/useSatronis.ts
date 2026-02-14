/**
 * SATRONIS React Native Hook
 * 
 * Provides easy integration of SATRONIS AI features in React Native components
 */

import { useState, useCallback, useRef } from 'react';
import { SatronisService } from '@/services/satronis';
import type { 
  ProcessingResult, 
  ProcessingStatus, 
  ProcessingOptions,
  DocumentType 
} from '@/services/satronis/types';

interface UseSatronisReturn {
  // State
  isProcessing: boolean;
  processingStatus: ProcessingStatus | null;
  result: ProcessingResult | null;
  error: string | null;
  
  // Actions
  processDocument: (filePath: string, options?: Partial<ProcessingOptions>) => Promise<ProcessingResult | null>;
  classifyDocument: (filePath: string) => Promise<DocumentType | null>;
  clearResult: () => void;
  clearError: () => void;
  
  // Utilities
  getCapabilities: () => any;
  validateFile: (filePath: string) => Promise<{ valid: boolean; reason?: string }>;
}

export function useSatronis(): UseSatronisReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const satronisService = useRef(new SatronisService()).current;

  /**
   * Process a medical document with SATRONIS
   */
  const processDocument = useCallback(async (
    filePath: string, 
    options?: Partial<ProcessingOptions>
  ): Promise<ProcessingResult | null> => {
    try {
      setIsProcessing(true);
      setError(null);
      setResult(null);
      setProcessingStatus({
        stage: 'parsing',
        progress: 0,
        message: 'Starting document processing...'
      });

      const processingResult = await satronisService.processDocument(
        filePath,
        options,
        (status: ProcessingStatus) => {
          setProcessingStatus(status);
        }
      );

      setResult(processingResult);
      setProcessingStatus({
        stage: 'complete',
        progress: 100,
        message: 'Processing complete'
      });

      return processingResult;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setProcessingStatus({
        stage: 'error',
        progress: 0,
        message: errorMessage
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [satronisService]);

  /**
   * Classify document type without full processing
   */
  const classifyDocument = useCallback(async (filePath: string): Promise<DocumentType | null> => {
    try {
      setError(null);
      return await satronisService.classifyDocument(filePath);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Classification failed';
      setError(errorMessage);
      return null;
    }
  }, [satronisService]);

  /**
   * Clear processing result
   */
  const clearResult = useCallback(() => {
    setResult(null);
    setProcessingStatus(null);
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get SATRONIS capabilities
   */
  const getCapabilities = useCallback(() => {
    return satronisService.getCapabilities();
  }, [satronisService]);

  /**
   * Validate if file can be processed
   */
  const validateFile = useCallback(async (filePath: string) => {
    try {
      return await satronisService.validateFile(filePath);
    } catch (err) {
      return { 
        valid: false, 
        reason: err instanceof Error ? err.message : 'Validation failed' 
      };
    }
  }, [satronisService]);

  return {
    // State
    isProcessing,
    processingStatus,
    result,
    error,
    
    // Actions
    processDocument,
    classifyDocument,
    clearResult,
    clearError,
    
    // Utilities
    getCapabilities,
    validateFile
  };
}

/**
 * Hook for getting SATRONIS processing statistics
 */
export function useSatronisStats() {
  const [stats, setStats] = useState({
    totalProcessed: 0,
    successRate: 0,
    averageProcessingTime: 0,
    mostCommonDocumentType: 'unknown' as DocumentType
  });

  // In a real app, this would fetch from local storage or API
  const updateStats = useCallback((result: ProcessingResult) => {
    setStats(prevStats => ({
      ...prevStats,
      totalProcessed: prevStats.totalProcessed + 1,
      averageProcessingTime: (prevStats.averageProcessingTime + result.processingTime) / 2
    }));
  }, []);

  return { stats, updateStats };
}

/**
 * Hook for SATRONIS safety features
 */
export function useSatronisSafety() {
  const [safetyAlerts, setSafetyAlerts] = useState<string[]>([]);
  
  const checkSafety = useCallback((result: ProcessingResult) => {
    const alerts: string[] = [];
    
    if (result.safetyCheck.requiresHumanReview) {
      alerts.push('This document requires human medical review');
    }
    
    if (result.confidence.overall < 0.7) {
      alerts.push('AI confidence is below recommended threshold');
    }
    
    if (result.safetyCheck.riskLevel === 'high') {
      alerts.push('High-risk medical content detected');
    }
    
    setSafetyAlerts(alerts);
    return alerts;
  }, []);

  const clearSafetyAlerts = useCallback(() => {
    setSafetyAlerts([]);
  }, []);

  return {
    safetyAlerts,
    checkSafety,
    clearSafetyAlerts
  };
}