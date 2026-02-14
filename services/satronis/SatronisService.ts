/**
 * SATRONIS Main Service
 * 
 * Orchestrates the entire medical document processing pipeline
 * with safety-first approach and LLMWare integration
 */

import { DocumentProcessor } from './DocumentProcessor';
import { MedicalSummarizer } from './MedicalSummarizer';
import { StructuredExtractor } from './StructuredExtractor';
import { SafetyValidator } from './SafetyValidator';
import type {
  ProcessingResult,
  ProcessingOptions,
  ProcessingStatus,
  DocumentType,
} from './types';

export class SatronisService {
  private documentProcessor: DocumentProcessor;
  private medicalSummarizer: MedicalSummarizer;
  private structuredExtractor: StructuredExtractor;
  private safetyValidator: SafetyValidator;
  private processingCallbacks: Map<string, (status: ProcessingStatus) => void> = new Map();

  constructor() {
    this.documentProcessor = new DocumentProcessor();
    this.medicalSummarizer = new MedicalSummarizer();
    this.structuredExtractor = new StructuredExtractor();
    this.safetyValidator = new SafetyValidator();
  }

  /**
   * Process a medical document with full SATRONIS pipeline
   */
  async processDocument(
    filePath: string,
    options: Partial<ProcessingOptions> = {},
    onProgress?: (status: ProcessingStatus) => void
  ): Promise<ProcessingResult> {
    const processingId = this.generateProcessingId();
    const startTime = Date.now();

    // Set up progress tracking
    if (onProgress) {
      this.processingCallbacks.set(processingId, onProgress);
    }

    try {
      // Default options
      const fullOptions: ProcessingOptions = {
        enableSummary: true,
        enableExtraction: true,
        confidenceThreshold: 0.5,
        maxProcessingTime: 30000, // 30 seconds
        language: 'en',
        ...options,
      };

      this.updateProgress(processingId, {
        stage: 'parsing',
        progress: 10,
        message: 'Parsing document...',
      });

      // Step 1: Parse and classify document
      const parsedDocument = await this.documentProcessor.parseDocument(filePath);
      const documentType = await this.documentProcessor.classifyDocument(parsedDocument.text);

      this.updateProgress(processingId, {
        stage: 'analyzing',
        progress: 30,
        message: 'Analyzing medical content...',
      });

      // Step 2: Initial safety check
      const initialSafetyCheck = await this.safetyValidator.validateDocument(
        parsedDocument.text,
        documentType
      );

      if (!initialSafetyCheck.passed) {
        return this.createFailedResult(processingId, initialSafetyCheck, startTime);
      }

      // Step 3: Generate summary (if enabled)
      let summary = null;
      if (fullOptions.enableSummary) {
        this.updateProgress(processingId, {
          stage: 'summarizing',
          progress: 50,
          message: 'Creating patient-friendly summary...',
        });

        summary = await this.medicalSummarizer.generateSummary(
          parsedDocument.text,
          documentType
        );
      }

      // Step 4: Extract structured data (if enabled)
      let structuredData = null;
      if (fullOptions.enableExtraction) {
        this.updateProgress(processingId, {
          stage: 'extracting',
          progress: 70,
          message: 'Extracting key information...',
        });

        structuredData = await this.structuredExtractor.extractData(
          parsedDocument.text,
          documentType
        );
      }

      this.updateProgress(processingId, {
        stage: 'validating',
        progress: 90,
        message: 'Validating results...',
      });

      // Step 5: Final safety validation
      const finalSafetyCheck = await this.safetyValidator.validateResults(
        summary,
        structuredData,
        fullOptions.confidenceThreshold
      );

      // Step 6: Compile results
      const result: ProcessingResult = {
        id: processingId,
        documentType,
        summary: summary || this.getDefaultSummary(),
        structuredData: structuredData || this.getDefaultStructuredData(),
        confidence: this.calculateOverallConfidence(summary, structuredData),
        safetyCheck: finalSafetyCheck,
        citations: parsedDocument.citations || [],
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };

      this.updateProgress(processingId, {
        stage: 'complete',
        progress: 100,
        message: 'Processing complete',
      });

      return result;

    } catch (error) {
      console.error('SATRONIS processing error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.updateProgress(processingId, {
        stage: 'error',
        progress: 0,
        message: `Processing failed: ${errorMessage}`,
      });

      throw new Error(`SATRONIS processing failed: ${errorMessage}`);
    } finally {
      // Clean up progress callback
      this.processingCallbacks.delete(processingId);
    }
  }

  /**
   * Quick document classification without full processing
   */
  async classifyDocument(filePath: string): Promise<DocumentType> {
    const parsedDocument = await this.documentProcessor.parseDocument(filePath);
    return this.documentProcessor.classifyDocument(parsedDocument.text);
  }

  /**
   * Get processing capabilities and supported formats
   */
  getCapabilities() {
    return {
      supportedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'txt'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      supportedDocumentTypes: [
        'lab_report',
        'prescription',
        'radiology',
        'consultation_notes',
        'discharge_summary',
      ],
      features: {
        summarization: true,
        structuredExtraction: true,
        confidenceScoring: true,
        safetyValidation: true,
        citationTracking: true,
        multiLanguage: false, // Future feature
      },
    };
  }

  /**
   * Validate if a file can be processed
   */
  async validateFile(filePath: string): Promise<{ valid: boolean; reason?: string }> {
    try {
      // Check file size, format, etc.
      const capabilities = this.getCapabilities();
      
      // Basic validation logic here
      // In real implementation, check file size, format, etc.
      
      return { valid: true };
    } catch (error) {
      return { valid: false, reason: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Private helper methods

  private generateProcessingId(): string {
    return `satronis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateProgress(processingId: string, status: ProcessingStatus) {
    const callback = this.processingCallbacks.get(processingId);
    if (callback) {
      callback(status);
    }
  }

  private createFailedResult(
    processingId: string,
    safetyCheck: any,
    startTime: number
  ): ProcessingResult {
    return {
      id: processingId,
      documentType: 'unknown',
      summary: {
        patientFriendly: 'Document requires human review for safety reasons.',
        keyFindings: [],
        abnormalValues: [],
        recommendations: ['Please consult with your healthcare provider for document interpretation.'],
        disclaimer: 'This document could not be safely processed by AI. Human review is required.',
      },
      structuredData: this.getDefaultStructuredData(),
      confidence: { overall: 0, summary: 0, extraction: 0, classification: 0, reasoning: 'Safety check failed' },
      safetyCheck,
      citations: [],
      processingTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }

  private getDefaultSummary() {
    return {
      patientFriendly: 'Summary not available.',
      keyFindings: [],
      abnormalValues: [],
      recommendations: [],
      disclaimer: 'This is not medical advice. Please consult your healthcare provider.',
    };
  }

  private getDefaultStructuredData() {
    return {
      dates: [],
      medications: [],
      testResults: [],
      diagnoses: [],
      providers: [],
      appointments: [],
    };
  }

  private calculateOverallConfidence(summary: any, structuredData: any) {
    // Simple confidence calculation
    const summaryConf = summary?.confidence || 0;
    const extractionConf = structuredData?.confidence || 0;
    
    return {
      overall: (summaryConf + extractionConf) / 2,
      summary: summaryConf,
      extraction: extractionConf,
      classification: 0.8, // Placeholder
      reasoning: 'Calculated from summary and extraction confidence scores',
    };
  }
}