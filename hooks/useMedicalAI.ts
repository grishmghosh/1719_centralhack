/**
 * Medical AI React Native Integration Hook
 */

import { useState, useCallback } from 'react';

// Configuration
const API_BASE_URL = 'http://localhost:5000'; // Change this to your server IP for device testing

export interface MedicalSummary {
  summary: string;
  confidence: number;
  processing_time?: string;
  model: string;
}

export interface KeyInformation {
  medications: string[];
  conditions: string[];
  dates: string[];
  doctors: string[];
  vital_signs: Record<string, string>;
  instructions: string[];
}

export interface RiskAssessment {
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
  explanation: string;
  indicators_found: {
    high: number;
    medium: number;
    low: number;
  };
  confidence: number;
  model: string;
}

export interface CompleteAnalysis {
  summary: MedicalSummary;
  key_information: {
    extracted_info: KeyInformation;
    confidence: number;
    model: string;
  };
  risk_assessment: RiskAssessment;
  analysis_timestamp: string;
  record_type: string;
}

export const useMedicalAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(async (endpoint: string, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown API error');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateSummary = useCallback(async (content: string, recordType: string = 'Medical Record'): Promise<MedicalSummary> => {
    return makeRequest('/api/summarize', { content, record_type: recordType });
  }, [makeRequest]);

  const extractKeyInformation = useCallback(async (content: string) => {
    return makeRequest('/api/extract', { content });
  }, [makeRequest]);

  const assessRisk = useCallback(async (content: string): Promise<RiskAssessment> => {
    return makeRequest('/api/assess-risk', { content });
  }, [makeRequest]);

  const analyzeComplete = useCallback(async (content: string, recordType: string = 'Medical Record'): Promise<CompleteAnalysis> => {
    return makeRequest('/api/analyze', { content, record_type: recordType });
  }, [makeRequest]);

  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  return {
    loading,
    error,
    generateSummary,
    extractKeyInformation,
    assessRisk,
    analyzeComplete,
    checkHealth,
  };
};