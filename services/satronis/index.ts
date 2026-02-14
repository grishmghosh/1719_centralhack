/**
 * SATRONIS - AI-Powered Medical Document Assistant
 * 
 * A responsible AI system for processing medical documents with:
 * - Privacy-first approach using LLMWare
 * - Confidence scoring and source citations
 * - Safety disclaimers and human-in-the-loop design
 * - Never provides medical diagnosis, only explanation
 */

export { SatronisService } from './SatronisService';
export { DocumentProcessor } from './DocumentProcessor';
export { MedicalSummarizer } from './MedicalSummarizer';
export { StructuredExtractor } from './StructuredExtractor';
export { SafetyValidator } from './SafetyValidator';

export type {
  ProcessingResult,
  MedicalSummary,
  StructuredData,
  ConfidenceScore,
  SafetyCheck,
  DocumentType,
} from './types';