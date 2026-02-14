/**
 * SATRONIS Type Definitions
 */

export interface ProcessingResult {
  id: string;
  documentType: DocumentType;
  summary: MedicalSummary;
  structuredData: StructuredData;
  confidence: ConfidenceScore;
  safetyCheck: SafetyCheck;
  citations: Citation[];
  processingTime: number;
  timestamp: string;
}

export interface MedicalSummary {
  patientFriendly: string;
  keyFindings: string[];
  abnormalValues: AbnormalValue[];
  recommendations: string[];
  disclaimer: string;
}

export interface StructuredData {
  dates: ExtractedDate[];
  medications: Medication[];
  testResults: TestResult[];
  diagnoses: string[];
  providers: Provider[];
  appointments: Appointment[];
}

export interface ConfidenceScore {
  overall: number; // 0-1
  summary: number;
  extraction: number;
  classification: number;
  reasoning: string;
}

export interface SafetyCheck {
  passed: boolean;
  warnings: string[];
  requiresHumanReview: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  reasons: string[];
}

export interface Citation {
  text: string;
  page?: number;
  section?: string;
  confidence: number;
  sourceType: 'original' | 'extracted' | 'inferred';
}

export interface AbnormalValue {
  test: string;
  value: string;
  normalRange: string;
  severity: 'mild' | 'moderate' | 'severe';
  explanation: string;
}

export interface ExtractedDate {
  date: string;
  type: 'test' | 'appointment' | 'prescription' | 'procedure';
  description: string;
  confidence: number;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  purpose: string;
  sideEffects: string[];
  interactions: string[];
  confidence: number;
}

export interface TestResult {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  date: string;
  confidence: number;
}

export interface Provider {
  name: string;
  specialty: string;
  contact?: string;
  confidence: number;
}

export interface Appointment {
  date: string;
  provider: string;
  type: string;
  notes?: string;
  confidence: number;
}

export type DocumentType = 
  | 'lab_report'
  | 'prescription'
  | 'radiology'
  | 'consultation_notes'
  | 'discharge_summary'
  | 'insurance_claim'
  | 'unknown';

export interface ProcessingOptions {
  enableSummary: boolean;
  enableExtraction: boolean;
  confidenceThreshold: number;
  maxProcessingTime: number;
  language: string;
}

export interface ProcessingStatus {
  stage: 'parsing' | 'analyzing' | 'summarizing' | 'extracting' | 'validating' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
  estimatedTimeRemaining?: number;
}