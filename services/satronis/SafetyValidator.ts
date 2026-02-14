/**
 * Safety Validator - Ensures responsible AI behavior in healthcare
 * 
 * Implements multiple safety checks to prevent harmful AI responses
 */

import type { SafetyCheck, DocumentType, MedicalSummary, StructuredData } from './types';

export class SafetyValidator {
  private dangerousKeywords!: string[];
  private diagnosticLanguage!: string[];
  private medicalAdvicePatterns!: RegExp[];

  constructor() {
    this.initializeSafetyRules();
  }

  private initializeSafetyRules() {
    // Keywords that indicate dangerous content
    this.dangerousKeywords = [
      'emergency', 'urgent', 'critical', 'severe', 'life-threatening',
      'cancer', 'tumor', 'malignant', 'metastasis', 'stroke', 'heart attack',
      'overdose', 'poisoning', 'allergic reaction', 'anaphylaxis'
    ];

    // Language that sounds like medical diagnosis
    this.diagnosticLanguage = [
      'you have', 'diagnosed with', 'suffering from', 'condition is',
      'disease is', 'illness is', 'you are sick', 'medical condition'
    ];

    // Patterns that look like medical advice
    this.medicalAdvicePatterns = [
      /you should (take|stop|increase|decrease)/i,
      /i recommend (taking|stopping)/i,
      /the treatment is/i,
      /you need to (start|stop)/i,
      /this will cure/i,
      /this will treat/i
    ];
  }

  /**
   * Validate document before processing
   */
  async validateDocument(text: string, documentType: DocumentType): Promise<SafetyCheck> {
    const warnings: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let requiresHumanReview = false;

    // Check for dangerous keywords
    const dangerousContent = this.checkForDangerousContent(text);
    if (dangerousContent.found) {
      warnings.push('Document contains potentially urgent medical content');
      riskLevel = 'high';
      requiresHumanReview = true;
    }

    // Check document completeness
    const completeness = this.checkDocumentCompleteness(text);
    if (!completeness.complete) {
      warnings.push('Document appears incomplete or corrupted');
      riskLevel = riskLevel === 'high' ? 'high' : 'medium';
    }

    // Check for personal information
    const piiCheck = this.checkForPII(text);
    if (piiCheck.found) {
      warnings.push('Document contains personal information - ensure privacy compliance');
    }

    return {
      passed: riskLevel !== 'high',
      warnings,
      requiresHumanReview,
      riskLevel,
      reasons: this.generateSafetyReasons(warnings, riskLevel)
    };
  }

  /**
   * Validate AI-generated results
   */
  async validateResults(
    summary: MedicalSummary | null,
    structuredData: StructuredData | null,
    confidenceThreshold: number
  ): Promise<SafetyCheck> {
    const warnings: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let requiresHumanReview = false;

    // Check summary for safety issues
    if (summary) {
      const summaryCheck = this.validateSummary(summary);
      warnings.push(...summaryCheck.warnings);
      if (summaryCheck.riskLevel === 'high') {
        riskLevel = 'high';
        requiresHumanReview = true;
      }
    }

    // Check structured data for safety issues
    if (structuredData) {
      const dataCheck = this.validateStructuredData(structuredData);
      warnings.push(...dataCheck.warnings);
      if (dataCheck.riskLevel === 'high') {
        riskLevel = 'high';
        requiresHumanReview = true;
      }
    }

    // Check overall confidence
    if (summary && summary.patientFriendly) {
      // Mock confidence check - in real implementation, this would come from the AI model
      const mockConfidence = 0.75;
      if (mockConfidence < confidenceThreshold) {
        warnings.push(`AI confidence (${Math.round(mockConfidence * 100)}%) below threshold (${Math.round(confidenceThreshold * 100)}%)`);
        requiresHumanReview = true;
        riskLevel = riskLevel === 'high' ? 'high' : 'medium';
      }
    }

    return {
      passed: riskLevel !== 'high' && !requiresHumanReview,
      warnings,
      requiresHumanReview,
      riskLevel,
      reasons: this.generateSafetyReasons(warnings, riskLevel)
    };
  }

  /**
   * Check for dangerous medical content
   */
  private checkForDangerousContent(text: string): { found: boolean; keywords: string[] } {
    const foundKeywords: string[] = [];
    const lowerText = text.toLowerCase();

    this.dangerousKeywords.forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    });

    return {
      found: foundKeywords.length > 0,
      keywords: foundKeywords
    };
  }

  /**
   * Check document completeness
   */
  private checkDocumentCompleteness(text: string): { complete: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check minimum length
    if (text.length < 50) {
      issues.push('Document is too short');
    }

    // Check for common corruption indicators
    if (text.includes('���') || text.includes('?????')) {
      issues.push('Document may be corrupted or have encoding issues');
    }

    // Check for OCR errors (repeated characters, nonsense words)
    const ocrErrorPattern = /(.)\1{5,}/; // Same character repeated 6+ times
    if (ocrErrorPattern.test(text)) {
      issues.push('Document may have OCR errors');
    }

    return {
      complete: issues.length === 0,
      issues
    };
  }

  /**
   * Check for personally identifiable information
   */
  private checkForPII(text: string): { found: boolean; types: string[] } {
    const piiTypes: string[] = [];

    // Social Security Number pattern
    if (/\d{3}-\d{2}-\d{4}/.test(text)) {
      piiTypes.push('SSN');
    }

    // Phone number pattern
    if (/\(\d{3}\)\s*\d{3}-\d{4}/.test(text)) {
      piiTypes.push('Phone');
    }

    // Email pattern
    if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
      piiTypes.push('Email');
    }

    return {
      found: piiTypes.length > 0,
      types: piiTypes
    };
  }

  /**
   * Validate AI-generated summary for safety
   */
  private validateSummary(summary: MedicalSummary): { warnings: string[]; riskLevel: 'low' | 'medium' | 'high' } {
    const warnings: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Check for diagnostic language
    const diagnosticCheck = this.checkForDiagnosticLanguage(summary.patientFriendly);
    if (diagnosticCheck.found) {
      warnings.push('Summary contains language that sounds like medical diagnosis');
      riskLevel = 'high';
    }

    // Check for medical advice
    const adviceCheck = this.checkForMedicalAdvice(summary.patientFriendly);
    if (adviceCheck.found) {
      warnings.push('Summary contains language that sounds like medical advice');
      riskLevel = 'high';
    }

    // Check for proper disclaimers
    if (!summary.disclaimer || summary.disclaimer.length < 20) {
      warnings.push('Summary lacks proper medical disclaimer');
      riskLevel = riskLevel === 'high' ? 'high' : 'medium';
    }

    // Check recommendations for safety
    summary.recommendations.forEach(rec => {
      if (this.checkForMedicalAdvice(rec).found) {
        warnings.push('Recommendations contain inappropriate medical advice');
        riskLevel = 'high';
      }
    });

    return { warnings, riskLevel };
  }

  /**
   * Validate structured data for safety
   */
  private validateStructuredData(data: StructuredData): { warnings: string[]; riskLevel: 'low' | 'medium' | 'high' } {
    const warnings: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Check for critical test results
    data.testResults.forEach(test => {
      if (test.status === 'critical') {
        warnings.push(`Critical test result detected: ${test.name}`);
        riskLevel = 'high';
      }
    });

    // Check medication interactions
    if (data.medications.length > 1) {
      warnings.push('Multiple medications detected - interaction checking recommended');
    }

    // Check for high-risk medications
    data.medications.forEach(med => {
      const highRiskMeds = ['warfarin', 'insulin', 'digoxin', 'lithium'];
      if (highRiskMeds.some(risk => med.name.toLowerCase().includes(risk))) {
        warnings.push(`High-risk medication detected: ${med.name}`);
        riskLevel = riskLevel === 'high' ? 'high' : 'medium';
      }
    });

    return { warnings, riskLevel };
  }

  /**
   * Check text for diagnostic language
   */
  private checkForDiagnosticLanguage(text: string): { found: boolean; phrases: string[] } {
    const foundPhrases: string[] = [];
    const lowerText = text.toLowerCase();

    this.diagnosticLanguage.forEach(phrase => {
      if (lowerText.includes(phrase.toLowerCase())) {
        foundPhrases.push(phrase);
      }
    });

    return {
      found: foundPhrases.length > 0,
      phrases: foundPhrases
    };
  }

  /**
   * Check text for medical advice patterns
   */
  private checkForMedicalAdvice(text: string): { found: boolean; patterns: string[] } {
    const foundPatterns: string[] = [];

    this.medicalAdvicePatterns.forEach(pattern => {
      if (pattern.test(text)) {
        foundPatterns.push(pattern.source);
      }
    });

    return {
      found: foundPatterns.length > 0,
      patterns: foundPatterns
    };
  }

  /**
   * Generate human-readable safety reasons
   */
  private generateSafetyReasons(warnings: string[], riskLevel: 'low' | 'medium' | 'high'): string[] {
    const reasons: string[] = [];

    if (riskLevel === 'high') {
      reasons.push('High-risk content detected that requires human medical expertise');
    }

    if (riskLevel === 'medium') {
      reasons.push('Medium-risk content that should be verified by healthcare provider');
    }

    if (warnings.length > 0) {
      reasons.push('Multiple safety warnings triggered during processing');
    }

    if (reasons.length === 0) {
      reasons.push('Content appears safe for AI processing with appropriate disclaimers');
    }

    return reasons;
  }

  /**
   * Get safety configuration
   */
  getSafetyConfig() {
    return {
      confidenceThreshold: 0.7,
      requireHumanReviewForCritical: true,
      enableDiagnosticLanguageCheck: true,
      enableMedicalAdviceCheck: true,
      enablePIIDetection: true,
      maxProcessingTime: 30000, // 30 seconds
      supportedLanguages: ['en'],
      disclaimerRequired: true
    };
  }

  /**
   * Update safety rules (for future configuration)
   */
  updateSafetyRules(newRules: Partial<{
    dangerousKeywords: string[];
    diagnosticLanguage: string[];
    confidenceThreshold: number;
  }>) {
    if (newRules.dangerousKeywords) {
      this.dangerousKeywords = [...this.dangerousKeywords, ...newRules.dangerousKeywords];
    }
    
    if (newRules.diagnosticLanguage) {
      this.diagnosticLanguage = [...this.diagnosticLanguage, ...newRules.diagnosticLanguage];
    }
  }
}