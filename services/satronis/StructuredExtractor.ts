/**
 * Structured Data Extractor
 * 
 * Extracts structured information from medical documents for timeline and data integration
 */

import type { 
  StructuredData, 
  DocumentType, 
  ExtractedDate, 
  Medication, 
  TestResult, 
  Provider, 
  Appointment 
} from './types';

export class StructuredExtractor {
  private model: any; // Will be LLMWare model instance

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    try {
      // Mock initialization for development
      console.log('Structured Extractor model initialized');
    } catch (error) {
      console.error('Failed to initialize extractor model:', error);
    }
  }

  /**
   * Extract structured data from medical document
   */
  async extractData(text: string, documentType: DocumentType): Promise<StructuredData> {
    try {
      // Mock implementation for development
      return this.mockExtractData(text, documentType);
      
      // Real LLMWare implementation would use structured prompts:
      /*
      const extractionPrompt = this.createExtractionPrompt(text, documentType);
      
      const response = await this.model.prompt_main(extractionPrompt, {
        temperature: 0.0, // Very low temperature for structured extraction
        max_tokens: 800
      });

      return this.parseStructuredResponse(response.llm_response, documentType);
      */
    } catch (error) {
      console.error('Structured extraction failed:', error);
      return this.getEmptyStructuredData();
    }
  }

  /**
   * Create extraction prompts for different document types
   */
  private createExtractionPrompt(text: string, documentType: DocumentType): string {
    const baseInstructions = `
      Extract structured information from this medical document.
      Return ONLY valid JSON with the requested fields.
      Use "unknown" for missing information.
      Include confidence scores (0.0-1.0) for each extracted item.
    `;

    const documentSpecificPrompts = {
      lab_report: `
        ${baseInstructions}
        
        Extract:
        {
          "dates": [{"date": "YYYY-MM-DD", "type": "test", "description": "test name", "confidence": 0.0-1.0}],
          "testResults": [{"name": "test name", "value": "result", "unit": "unit", "normalRange": "range", "status": "normal|abnormal|critical", "date": "YYYY-MM-DD", "confidence": 0.0-1.0}],
          "providers": [{"name": "doctor name", "specialty": "specialty", "confidence": 0.0-1.0}]
        }
        
        Document: ${text}
        
        JSON:
      `,
      
      prescription: `
        ${baseInstructions}
        
        Extract:
        {
          "dates": [{"date": "YYYY-MM-DD", "type": "prescription", "description": "prescription date", "confidence": 0.0-1.0}],
          "medications": [{"name": "drug name", "dosage": "amount", "frequency": "how often", "duration": "how long", "purpose": "what for", "sideEffects": ["effect1"], "interactions": ["interaction1"], "confidence": 0.0-1.0}],
          "providers": [{"name": "prescriber name", "specialty": "specialty", "confidence": 0.0-1.0}]
        }
        
        Document: ${text}
        
        JSON:
      `,
      
      radiology: `
        ${baseInstructions}
        
        Extract:
        {
          "dates": [{"date": "YYYY-MM-DD", "type": "procedure", "description": "imaging type", "confidence": 0.0-1.0}],
          "providers": [{"name": "radiologist name", "specialty": "radiology", "confidence": 0.0-1.0}]
        }
        
        Document: ${text}
        
        JSON:
      `
    };

    return (documentSpecificPrompts as any)[documentType] || documentSpecificPrompts.lab_report;
  }

  /**
   * Parse structured response from AI
   */
  private parseStructuredResponse(response: string, documentType: DocumentType): StructuredData {
    try {
      // This would parse the JSON response from the AI
      const parsed = JSON.parse(response);
      return this.validateAndCleanStructuredData(parsed);
    } catch (error) {
      console.error('Failed to parse structured response:', error);
      return this.mockExtractData('', documentType);
    }
  }

  /**
   * Validate and clean extracted structured data
   */
  private validateAndCleanStructuredData(data: any): StructuredData {
    return {
      dates: Array.isArray(data.dates) ? data.dates : [],
      medications: Array.isArray(data.medications) ? data.medications : [],
      testResults: Array.isArray(data.testResults) ? data.testResults : [],
      diagnoses: Array.isArray(data.diagnoses) ? data.diagnoses : [],
      providers: Array.isArray(data.providers) ? data.providers : [],
      appointments: Array.isArray(data.appointments) ? data.appointments : [],
    };
  }

  // Mock implementations for development

  private mockExtractData(text: string, documentType: DocumentType): StructuredData {
    switch (documentType) {
      case 'lab_report':
        return this.getMockLabData();
      case 'prescription':
        return this.getMockPrescriptionData();
      case 'radiology':
        return this.getMockRadiologyData();
      case 'consultation_notes':
        return this.getMockConsultationData();
      case 'discharge_summary':
        return this.getMockDischargeData();
      default:
        return this.getEmptyStructuredData();
    }
  }

  private getMockLabData(): StructuredData {
    return {
      dates: [
        {
          date: '2025-01-15',
          type: 'test',
          description: 'Laboratory blood work',
          confidence: 0.95
        }
      ],
      
      medications: [], // Lab reports typically don't contain medications
      
      testResults: [
        {
          name: 'White Blood Cells',
          value: '7.2',
          unit: 'K/uL',
          normalRange: '4.0-11.0',
          status: 'normal',
          date: '2025-01-15',
          confidence: 0.98
        },
        {
          name: 'Hemoglobin',
          value: '14.2',
          unit: 'g/dL',
          normalRange: '12.0-16.0',
          status: 'normal',
          date: '2025-01-15',
          confidence: 0.98
        },
        {
          name: 'Glucose',
          value: '95',
          unit: 'mg/dL',
          normalRange: '70-100',
          status: 'normal',
          date: '2025-01-15',
          confidence: 0.97
        },
        {
          name: 'Total Cholesterol',
          value: '185',
          unit: 'mg/dL',
          normalRange: '<200',
          status: 'normal',
          date: '2025-01-15',
          confidence: 0.96
        },
        {
          name: 'LDL Cholesterol',
          value: '110',
          unit: 'mg/dL',
          normalRange: '<100',
          status: 'abnormal',
          date: '2025-01-15',
          confidence: 0.97
        }
      ],
      
      diagnoses: [], // Lab reports typically don't contain diagnoses
      
      providers: [
        {
          name: 'Dr. Michael Johnson',
          specialty: 'Internal Medicine',
          confidence: 0.92
        }
      ],
      
      appointments: []
    };
  }

  private getMockPrescriptionData(): StructuredData {
    return {
      dates: [
        {
          date: '2025-01-15',
          type: 'prescription',
          description: 'Prescription written',
          confidence: 0.96
        }
      ],
      
      medications: [
        {
          name: 'Metformin HCl',
          dosage: '500mg',
          frequency: 'twice daily',
          duration: 'ongoing',
          purpose: 'Blood sugar control (typically for diabetes management)',
          sideEffects: [
            'Nausea or stomach upset (especially when starting)',
            'Diarrhea',
            'Metallic taste in mouth',
            'Decreased appetite'
          ],
          interactions: [
            'Alcohol (can increase risk of lactic acidosis)',
            'Contrast dyes used in imaging studies',
            'Certain blood pressure medications'
          ],
          confidence: 0.98
        },
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'once daily',
          duration: 'ongoing',
          purpose: 'Blood pressure control',
          sideEffects: [
            'Dry cough (most common)',
            'Dizziness or lightheadedness',
            'Fatigue',
            'Headache'
          ],
          interactions: [
            'Potassium supplements',
            'NSAIDs (like ibuprofen)',
            'Diuretics (water pills)'
          ],
          confidence: 0.97
        }
      ],
      
      testResults: [],
      
      diagnoses: [], // Prescriptions may imply conditions but don't explicitly diagnose
      
      providers: [
        {
          name: 'Dr. Michael Johnson',
          specialty: 'Internal Medicine',
          confidence: 0.94
        }
      ],
      
      appointments: []
    };
  }

  private getMockRadiologyData(): StructuredData {
    return {
      dates: [
        {
          date: '2025-01-15',
          type: 'procedure',
          description: 'Chest X-Ray (PA and Lateral)',
          confidence: 0.97
        }
      ],
      
      medications: [],
      
      testResults: [], // Radiology reports don't typically have numerical test results
      
      diagnoses: [], // Radiology reports describe findings, not diagnoses
      
      providers: [
        {
          name: 'Dr. Lisa Wang',
          specialty: 'Radiology',
          confidence: 0.95
        }
      ],
      
      appointments: []
    };
  }

  private getMockConsultationData(): StructuredData {
    return {
      dates: [
        {
          date: '2025-01-15',
          type: 'appointment',
          description: 'Medical consultation',
          confidence: 0.85
        }
      ],
      
      medications: [],
      testResults: [],
      diagnoses: [],
      
      providers: [
        {
          name: 'Healthcare Provider',
          specialty: 'Unknown',
          confidence: 0.70
        }
      ],
      
      appointments: [
        {
          date: '2025-01-15',
          provider: 'Healthcare Provider',
          type: 'Consultation',
          notes: 'Medical consultation visit',
          confidence: 0.80
        }
      ]
    };
  }

  private getMockDischargeData(): StructuredData {
    return {
      dates: [
        {
          date: '2025-01-15',
          type: 'procedure',
          description: 'Hospital discharge',
          confidence: 0.90
        }
      ],
      
      medications: [],
      testResults: [],
      diagnoses: [],
      
      providers: [
        {
          name: 'Hospital Medical Team',
          specialty: 'Various',
          confidence: 0.75
        }
      ],
      
      appointments: []
    };
  }

  private getEmptyStructuredData(): StructuredData {
    return {
      dates: [],
      medications: [],
      testResults: [],
      diagnoses: [],
      providers: [],
      appointments: []
    };
  }

  /**
   * Extract dates using regex patterns
   */
  private extractDatesFromText(text: string): ExtractedDate[] {
    const dates: ExtractedDate[] = [];
    
    // Common date patterns in medical documents
    const datePatterns = [
      /(\d{1,2}\/\d{1,2}\/\d{4})/g, // MM/DD/YYYY
      /(\d{4}-\d{2}-\d{2})/g,       // YYYY-MM-DD
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/gi
    ];

    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          dates.push({
            date: this.normalizeDate(match),
            type: 'test', // Default type
            description: 'Extracted date',
            confidence: 0.8
          });
        });
      }
    });

    return dates;
  }

  /**
   * Normalize date to YYYY-MM-DD format
   */
  private normalizeDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  }

  /**
   * Extract medications using pattern matching
   */
  private extractMedicationsFromText(text: string): Medication[] {
    const medications: Medication[] = [];
    
    // Simple medication extraction patterns
    const medicationPatterns = [
      /(\w+)\s+(\d+mg)/gi, // Drug name + dosage
      /Rx:\s*([^\n]+)/gi   // Prescription format
    ];

    // This is a simplified version - real implementation would be more sophisticated
    return medications;
  }
}