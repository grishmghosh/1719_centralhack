/**
 * Medical Summarizer - AI-Powered Document Summarization
 * 
 * Creates patient-friendly summaries with safety-first approach
 */

import type { MedicalSummary, DocumentType, AbnormalValue } from './types';

export class MedicalSummarizer {
  private model: any; // Will be LLMWare model instance

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    try {
      // Mock initialization for development
      // Real implementation:
      // const { Prompt } = require('llmware');
      // this.model = new Prompt().load_model("llmware/bling-1b-0.1");
      
      console.log('Medical Summarizer model initialized');
    } catch (error) {
      console.error('Failed to initialize summarizer model:', error);
    }
  }

  /**
   * Generate patient-friendly medical summary
   */
  async generateSummary(text: string, documentType: DocumentType): Promise<MedicalSummary> {
    try {
      // Mock implementation for development
      return this.mockGenerateSummary(text, documentType);
      
      // Real LLMWare implementation:
      /*
      const prompt = this.createSummarizationPrompt(text, documentType);
      
      const response = await this.model.prompt_main(prompt, {
        temperature: 0.1, // Low temperature for medical accuracy
        max_tokens: 500,
        top_p: 0.9
      });

      return this.parseSummaryResponse(response.llm_response, documentType);
      */
    } catch (error) {
      console.error('Summary generation failed:', error);
      return this.getFailsafeSummary();
    }
  }

  /**
   * Create specialized prompts for different document types
   */
  private createSummarizationPrompt(text: string, documentType: DocumentType): string {
    const baseRules = `
      CRITICAL SAFETY RULES:
      1. NEVER provide medical diagnosis or medical advice
      2. NEVER interpret results as "good" or "bad" - use "normal" or "outside normal range"
      3. ALWAYS recommend consulting healthcare providers
      4. Focus on explanation, not interpretation
      5. Use simple, patient-friendly language
      6. Include confidence indicators
      7. Cite specific document sections
    `;

    const documentSpecificPrompts = {
      lab_report: `
        ${baseRules}
        
        For this laboratory report, provide:
        1. A brief explanation of what tests were performed
        2. Which values are within normal ranges and which are outside normal ranges
        3. Simple explanations of what each test measures
        4. Clear statement that results should be discussed with healthcare provider
        
        Document: ${text}
        
        Patient-friendly summary:
      `,
      
      prescription: `
        ${baseRules}
        
        For this prescription, provide:
        1. List of medications prescribed
        2. Simple explanation of what each medication is typically used for
        3. Basic dosing instructions in plain language
        4. Reminder to follow prescriber's instructions exactly
        5. Suggestion to ask pharmacist about side effects
        
        Document: ${text}
        
        Patient-friendly summary:
      `,
      
      radiology: `
        ${baseRules}
        
        For this radiology report, provide:
        1. What type of imaging was performed
        2. What body parts were examined
        3. Simple explanation of key findings in non-technical terms
        4. Clear statement that images should be reviewed with healthcare provider
        
        Document: ${text}
        
        Patient-friendly summary:
      `,
      
      consultation_notes: `
        ${baseRules}
        
        For these consultation notes, provide:
        1. Summary of the visit purpose
        2. Key points discussed in simple terms
        3. Any follow-up instructions mentioned
        4. Reminder to follow healthcare provider's guidance
        
        Document: ${text}
        
        Patient-friendly summary:
      `,
      
      discharge_summary: `
        ${baseRules}
        
        For this discharge summary, provide:
        1. Reason for hospital stay in simple terms
        2. Key treatments received
        3. Important discharge instructions
        4. Follow-up care recommendations
        
        Document: ${text}
        
        Patient-friendly summary:
      `
    };

    return (documentSpecificPrompts as any)[documentType] || documentSpecificPrompts.lab_report;
  }

  /**
   * Parse AI response into structured summary
   */
  private parseSummaryResponse(response: string, documentType: DocumentType): MedicalSummary {
    // This would parse the AI response and structure it
    // For now, return mock structured data
    return this.mockGenerateSummary(response, documentType);
  }

  /**
   * Extract abnormal values from text
   */
  private extractAbnormalValues(text: string): AbnormalValue[] {
    const abnormalValues: AbnormalValue[] = [];
    
    // Mock extraction logic
    if (text.toLowerCase().includes('borderline high') || text.toLowerCase().includes('elevated')) {
      abnormalValues.push({
        test: 'LDL Cholesterol',
        value: '110 mg/dL',
        normalRange: '<100 mg/dL',
        severity: 'mild',
        explanation: 'LDL cholesterol is slightly above the recommended level. This is often manageable with diet and lifestyle changes.'
      });
    }

    return abnormalValues;
  }

  // Mock implementations for development

  private mockGenerateSummary(text: string, documentType: DocumentType): MedicalSummary {
    switch (documentType) {
      case 'lab_report':
        return this.getMockLabSummary(text);
      case 'prescription':
        return this.getMockPrescriptionSummary(text);
      case 'radiology':
        return this.getMockRadiologySummary(text);
      case 'consultation_notes':
        return this.getMockConsultationSummary(text);
      case 'discharge_summary':
        return this.getMockDischargeSummary(text);
      default:
        return this.getFailsafeSummary();
    }
  }

  private getMockLabSummary(text: string): MedicalSummary {
    return {
      patientFriendly: `This laboratory report shows the results of blood tests that check various aspects of your health. Most of your test results are within the normal ranges, which is good news. Your blood count, kidney function, and most cholesterol levels look normal. However, your LDL cholesterol (sometimes called "bad" cholesterol) is slightly higher than the recommended level at 110 mg/dL when it should be below 100 mg/dL.`,
      
      keyFindings: [
        'Blood count and kidney function tests are normal',
        'Most cholesterol levels are within healthy ranges',
        'LDL cholesterol is slightly elevated at 110 mg/dL',
        'Overall results suggest good general health'
      ],
      
      abnormalValues: [
        {
          test: 'LDL Cholesterol',
          value: '110 mg/dL',
          normalRange: '<100 mg/dL',
          severity: 'mild',
          explanation: 'This is only slightly above the recommended level and can often be improved with diet and exercise changes.'
        }
      ],
      
      recommendations: [
        'Discuss these results with your healthcare provider',
        'Ask about dietary changes to help lower LDL cholesterol',
        'Consider following up in 3 months as suggested',
        'Continue any current medications as prescribed'
      ],
      
      disclaimer: 'This summary is for educational purposes only and is not medical advice. Please discuss all results with your healthcare provider who can provide personalized medical guidance based on your complete health picture.'
    };
  }

  private getMockPrescriptionSummary(text: string): MedicalSummary {
    return {
      patientFriendly: `You have been prescribed two medications. Metformin is commonly used to help control blood sugar levels, typically for diabetes management. Lisinopril is often prescribed to help manage blood pressure. Both medications should be taken exactly as prescribed by your doctor.`,
      
      keyFindings: [
        'Metformin 500mg - typically used for blood sugar control',
        'Lisinopril 10mg - commonly prescribed for blood pressure',
        'Both medications have refills available',
        'Specific timing instructions are provided for each medication'
      ],
      
      abnormalValues: [], // Prescriptions don't have abnormal values
      
      recommendations: [
        'Take medications exactly as prescribed by your doctor',
        'Take Metformin with meals as directed to reduce stomach upset',
        'Take Lisinopril at the same time each day for best results',
        'Ask your pharmacist about potential side effects',
        'Don\'t stop taking medications without consulting your doctor',
        'Keep track of refills and schedule appointments as needed'
      ],
      
      disclaimer: 'This information is for educational purposes only. Always follow your prescriber\'s instructions exactly. Contact your healthcare provider or pharmacist if you have questions about your medications.'
    };
  }

  private getMockRadiologySummary(text: string): MedicalSummary {
    return {
      patientFriendly: `You had a chest X-ray taken, which includes pictures of your lungs, heart, and surrounding structures. The radiologist found everything to look normal. Your lungs appear clear with no signs of infection or other problems, and your heart appears normal in size and shape.`,
      
      keyFindings: [
        'Chest X-ray shows clear, healthy-looking lungs',
        'Heart appears normal in size and shape',
        'No signs of infection or fluid in the lungs',
        'No broken bones or other structural problems detected'
      ],
      
      abnormalValues: [], // Radiology reports don't typically have numerical abnormal values
      
      recommendations: [
        'Discuss these normal results with your healthcare provider',
        'Continue with any routine care as recommended by your doctor',
        'Keep this report for your medical records',
        'Follow up as scheduled with your healthcare provider'
      ],
      
      disclaimer: 'This summary explains the radiology report in simple terms but is not a substitute for medical interpretation. Your healthcare provider can best explain what these results mean for your specific health situation.'
    };
  }

  private getMockConsultationSummary(text: string): MedicalSummary {
    return {
      patientFriendly: `This appears to be notes from a medical consultation or visit. The document contains information about your health discussion with a healthcare provider.`,
      
      keyFindings: [
        'Medical consultation documentation',
        'Contains healthcare provider observations',
        'May include treatment recommendations',
        'Part of your ongoing medical care record'
      ],
      
      abnormalValues: [],
      
      recommendations: [
        'Review these notes with your healthcare provider',
        'Follow any specific instructions given during the visit',
        'Ask questions about anything that\'s unclear',
        'Keep this as part of your medical records'
      ],
      
      disclaimer: 'Consultation notes are best understood in the context of your complete medical care. Please discuss the contents with your healthcare provider for proper interpretation and guidance.'
    };
  }

  private getMockDischargeSummary(text: string): MedicalSummary {
    return {
      patientFriendly: `This is a summary of your hospital stay, including why you were admitted, what treatments you received, and instructions for your care after leaving the hospital.`,
      
      keyFindings: [
        'Hospital discharge documentation',
        'Contains treatment summary',
        'Includes follow-up care instructions',
        'Important for continuing care coordination'
      ],
      
      abnormalValues: [],
      
      recommendations: [
        'Follow all discharge instructions carefully',
        'Take medications exactly as prescribed',
        'Attend all scheduled follow-up appointments',
        'Contact your healthcare provider if you have concerns',
        'Keep this summary for your medical records'
      ],
      
      disclaimer: 'Discharge instructions are specific to your medical situation. Follow them exactly as written and contact your healthcare team with any questions or concerns.'
    };
  }

  private getFailsafeSummary(): MedicalSummary {
    return {
      patientFriendly: 'This document could not be safely summarized by our AI system. For your safety, please review the original document with your healthcare provider.',
      
      keyFindings: [
        'Document requires human review for safety',
        'AI processing was not confident enough to provide summary',
        'Original document should be reviewed by healthcare provider'
      ],
      
      abnormalValues: [],
      
      recommendations: [
        'Schedule an appointment with your healthcare provider',
        'Bring the original document to your appointment',
        'Ask your provider to explain the contents',
        'Request a copy for your personal records'
      ],
      
      disclaimer: 'For your safety, this document requires human medical expertise for proper interpretation. Please consult with your healthcare provider.'
    };
  }
}