import { useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';

export interface OCRResult {
  text: string;
  confidence: number;
  isManual?: boolean;
}

export interface MedicalDataExtracted {
  title?: string;
  date?: string;
  category?: string;
  provider?: string;
  values?: Array<{
    name: string;
    value: string;
    unit?: string;
    normalRange?: string;
  }>;
  medications?: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
  }>;
  findings?: string[];
  notes?: string;
}

// OCR.space API configuration
// IMPORTANT: Get your FREE API key at https://ocr.space/ocrapi/freekey
// The demo key 'helloworld' has limited functionality and should be replaced
const OCR_API_KEY = 'K81595345288957'; // Your personal OCR.space API key
const OCR_API_ENDPOINT = 'https://api.ocr.space/parse/image';

export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = async (imageUri: string): Promise<OCRResult | null> => {
    try {
      setIsProcessing(true);
      setError(null);

      console.log('Starting OCR processing for image:', imageUri);

      // Convert image to base64 using the legacy FileSystem API
      let base64: string;
      try {
        base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: 'base64',
        });
      } catch (legacyError) {
        // Fallback: try using the new FileSystem API with File class
        console.log('Legacy API failed, trying new FileSystem API...');
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Convert to base64 manually
        let binary = '';
        uint8Array.forEach(byte => binary += String.fromCharCode(byte));
        base64 = btoa(binary);
      }

      // Prepare the form data
      const formData = new FormData();
      formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true'); // Improves quality for low-res images
      formData.append('OCREngine', '2'); // Engine 2 is better for medical documents
      formData.append('isTable', 'true'); // Better for structured medical data

      console.log('Sending OCR request to API...');

      // Call OCR.space API
      const response = await fetch(OCR_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'apikey': OCR_API_KEY,
        },
        body: formData,
      });

      console.log('OCR API response status:', response.status);

      if (!response.ok) {
        console.error('OCR API error:', response.status, response.statusText);
        throw new Error(`OCR API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('OCR API response status:', data.OCRExitCode, 'IsErroredOnProcessing:', data.IsErroredOnProcessing);

      // Check if OCR was successful
      if (data.OCRExitCode === 1 || data.OCRExitCode === 2) {
        // Success (1) or Partial success (2)
        const parsedResults = data.ParsedResults;
        console.log('OCR parsed results count:', parsedResults?.length);
        
        if (parsedResults && parsedResults.length > 0) {
          const firstResult = parsedResults[0];
          
          if (firstResult.ParsedText) {
            const extractedText = firstResult.ParsedText.trim();
            console.log('Successfully extracted text length:', extractedText.length);
            
            return {
              text: extractedText,
              confidence: firstResult.FileParseExitCode === 1 ? 0.95 : 0.75,
              isManual: false,
            };
          }
        }
      }

      // Handle OCR errors
      let errorMessage = 'Failed to extract text from image';
      if (data.ErrorMessage) {
        errorMessage = data.ErrorMessage;
      } else if (data.ParsedResults?.[0]?.ErrorMessage) {
        errorMessage = data.ParsedResults[0].ErrorMessage;
      }

      console.error('OCR failed:', errorMessage);
      setError(`OCR Error: ${errorMessage}`);
      return null;
      
    } catch (err) {
      console.error('OCR processing error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown OCR error';
      setError(`Failed to process image: ${errorMsg}`);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const extractMedicalData = (ocrText: string): MedicalDataExtracted => {
    const data: MedicalDataExtracted = {};
    const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const fullText = ocrText.toLowerCase();

    // Enhanced title extraction - look for report types first
    const titlePatterns = [
      /(?:pap\s+and\s+molecular\s+pathology\s+report)/i,
      /(?:pathology\s+report)/i,
      /(?:lab\s+report)/i,
      /(?:blood\s+test\s+results?)/i,
      /(?:chemistry\s+panel)/i,
      /(?:lipid\s+profile)/i,
      /(?:cbc\s+with\s+differential)/i,
      /(?:prescription|rx)/i,
      /(?:discharge\s+summary)/i,
      /(?:consultation\s+note)/i,
      /(?:radiology\s+report)/i,
      /(?:mri\s+report)/i,
      /(?:ct\s+scan\s+report)/i,
      /(?:x-ray\s+report)/i,
    ];

    for (const pattern of titlePatterns) {
      const match = ocrText.match(pattern);
      if (match) {
        data.title = match[0].replace(/\s+/g, ' ').trim();
        break;
      }
    }

    // Enhanced date extraction with medical priority
    // Priority order: Generated > Reported > Collected > Registered > General dates
    const prioritizedDatePatterns = [
      // Highest priority: Generated/Report dates (final document dates)
      // Handle "Generated on: 02 Dec 2022" format with year
      { pattern: /(?:generated\s+on|report\s+date|final\s+report)[:\s]*(\d{1,2}[\/\-\.\s]+(?:dec|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|december|january|february|march|april|june|july|august|september|october|november)[\/\-\.\s,]*\d{4})/i, priority: 1 },
      // Handle "Generated on: 02 Dec" format without year
      { pattern: /(?:generated\s+on|report\s+date|final\s+report)[:\s]*(\d{1,2}[\/\-\.\s]+(?:dec|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|december|january|february|march|april|june|july|august|september|october|november))(?!\s*\d{4})/i, priority: 1 },
      { pattern: /(?:reported\s+on)[:\s]*(\d{1,2}[\/\-\.\s]*(?:dec|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|december|january|february|march|april|june|july|august|september|october|november)[\/\-\.\s,]*(?:\d{2,4})?)/i, priority: 2 },
      
      // Medium priority: Collection/Registration dates
      { pattern: /(?:collected\s+(?:at|on)|registration\s+date)[:\s]*(\d{1,2}[\/\-\.\s]*(?:dec|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|december|january|february|march|april|june|july|august|september|october|november)[\/\-\.\s,]*(?:\d{2,4})?)/i, priority: 3 },
      { pattern: /(?:registered\s+on)[:\s]*(\d{1,2}[\/\-\.\s]*(?:dec|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|december|january|february|march|april|june|july|august|september|october|november)[\/\-\.\s,]*(?:\d{2,4})?)/i, priority: 4 },
      
      // Lower priority: General date patterns
      { pattern: /(?:date|test\s+date)[:\s]*(\d{1,2}[\/\-\.\s]*(?:dec|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|december|january|february|march|april|june|july|august|september|october|november)[\/\-\.\s,]*(?:\d{2,4})?)/i, priority: 5 },
      { pattern: /\b(\d{1,2}\s+(?:dec|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|december|january|february|march|april|june|july|august|september|october|november)\s*[,\s]*(?:\d{2,4})?)\b/i, priority: 6 },
      { pattern: /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/g, priority: 7 },
    ];

    let bestDateMatch = null;
    let bestPriority = 999;

    for (const { pattern, priority } of prioritizedDatePatterns) {
      const match = ocrText.match(pattern);
      if (match && priority < bestPriority) {
        let dateStr = match[1];
        
        // Clean up the date string - remove time components
        dateStr = dateStr.replace(/\s+\d{1,2}:\d{2}\s*(?:am|pm)/i, '').trim();
        
        // Enhanced month name conversion (case insensitive)
        // Handle formats like "02 Dec 2022" -> "02/12/2022"
        dateStr = dateStr.replace(/(\d{1,2})\s+(?:dec|december)\s+(\d{4})/gi, '$1/12/$2')
                          .replace(/(\d{1,2})\s+(?:jan|january)\s+(\d{4})/gi, '$1/01/$2')
                          .replace(/(\d{1,2})\s+(?:feb|february)\s+(\d{4})/gi, '$1/02/$2')
                          .replace(/(\d{1,2})\s+(?:mar|march)\s+(\d{4})/gi, '$1/03/$2')
                          .replace(/(\d{1,2})\s+(?:apr|april)\s+(\d{4})/gi, '$1/04/$2')
                          .replace(/(\d{1,2})\s+(?:may)\s+(\d{4})/gi, '$1/05/$2')
                          .replace(/(\d{1,2})\s+(?:jun|june)\s+(\d{4})/gi, '$1/06/$2')
                          .replace(/(\d{1,2})\s+(?:jul|july)\s+(\d{4})/gi, '$1/07/$2')
                          .replace(/(\d{1,2})\s+(?:aug|august)\s+(\d{4})/gi, '$1/08/$2')
                          .replace(/(\d{1,2})\s+(?:sep|september)\s+(\d{4})/gi, '$1/09/$2')
                          .replace(/(\d{1,2})\s+(?:oct|october)\s+(\d{4})/gi, '$1/10/$2')
                          .replace(/(\d{1,2})\s+(?:nov|november)\s+(\d{4})/gi, '$1/11/$2')
                          // Handle formats without year like "02 Dec" -> "02/12"
                          .replace(/(\d{1,2})\s+(?:dec|december)(?!\s*\d{4})/gi, '$1/12')
                          .replace(/(\d{1,2})\s+(?:jan|january)(?!\s*\d{4})/gi, '$1/01')
                          .replace(/(\d{1,2})\s+(?:feb|february)(?!\s*\d{4})/gi, '$1/02')
                          .replace(/(\d{1,2})\s+(?:mar|march)(?!\s*\d{4})/gi, '$1/03')
                          .replace(/(\d{1,2})\s+(?:apr|april)(?!\s*\d{4})/gi, '$1/04')
                          .replace(/(\d{1,2})\s+(?:may)(?!\s*\d{4})/gi, '$1/05')
                          .replace(/(\d{1,2})\s+(?:jun|june)(?!\s*\d{4})/gi, '$1/06')
                          .replace(/(\d{1,2})\s+(?:jul|july)(?!\s*\d{4})/gi, '$1/07')
                          .replace(/(\d{1,2})\s+(?:aug|august)(?!\s*\d{4})/gi, '$1/08')
                          .replace(/(\d{1,2})\s+(?:sep|september)(?!\s*\d{4})/gi, '$1/09')
                          .replace(/(\d{1,2})\s+(?:oct|october)(?!\s*\d{4})/gi, '$1/10')
                          .replace(/(\d{1,2})\s+(?:nov|november)(?!\s*\d{4})/gi, '$1/11');
        
        // Add current year if missing (for formats like "02 Dec" or "02/12")
        if (!/\d{4}/.test(dateStr)) {
          const currentYear = new Date().getFullYear();
          // If it's day/month format, add year
          if (/^\d{1,2}\/\d{1,2}$/.test(dateStr)) {
            dateStr = dateStr + '/' + currentYear;
          }
          // If it's still just day month after conversion, add year
          else if (/^\d{1,2}\/\d{1,2}$/.test(dateStr) || dateStr.match(/^\d{1,2}\s+\w+$/)) {
            dateStr = dateStr + '/' + currentYear;
          }
        }
        
        // Clean up spacing and punctuation
        dateStr = dateStr.replace(/[,\s]+/g, '/').replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
        
        // Validate it's a reasonable date (not just numbers that happen to match)
        if (isValidMedicalDate(dateStr)) {
          bestDateMatch = dateStr;
          bestPriority = priority;
        }
      }
    }

    if (bestDateMatch) {
      data.date = bestDateMatch;
    }

    // Helper function to validate medical dates
    function isValidMedicalDate(dateStr: string): boolean {
      try {
        // Try to parse the date
        const date = new Date(dateStr);
        const now = new Date();
        const tenYearsAgo = new Date(now.getFullYear() - 10, 0, 1);
        const futureLimit = new Date(now.getFullYear() + 1, 11, 31);
        
        // Must be a valid date within reasonable medical record timeframe
        return !isNaN(date.getTime()) && 
               date >= tenYearsAgo && 
               date <= futureLimit &&
               dateStr.length >= 6; // Minimum reasonable date string length
      } catch {
        return false;
      }
    }

    // Enhanced provider/doctor extraction
    const providerPatterns = [
      // Hospital/Clinic names
      /(?:at|from)\s+([a-z\s&]+(?:hospital|medical center|clinic|lab|laboratory|pathology|health))/i,
      /([a-z\s&]+(?:hospital|medical center|clinic|lab|laboratory|pathology|health))/i,
      
      // Doctor names
      /(?:ref\.?\s*by|referred\s+by)[:\s]*([dr\.]*\s*[a-z\s]+(?:md|phd|do)?)/i,
      /(?:dr\.?\s+|doctor\s+)([a-z\s]+)/i,
      /(?:physician|pathologist)[:\s]*([a-z\s]+)/i,
      
      // Provider addresses (extract institution name)
      /([a-z\s&]+(?:medical|health))\s+\d+/i,
    ];

    for (const pattern of providerPatterns) {
      const match = ocrText.match(pattern);
      if (match && match[1]) {
        let provider = match[1].trim().replace(/\s+/g, ' ');
        // Clean up common artifacts
        provider = provider.replace(/^(at|from)\s+/i, '');
        provider = provider.replace(/\s+(inc|llc|corp)\.?$/i, '');
        if (provider.length > 3 && provider.length < 100) {
          data.provider = provider;
          break;
        }
      }
    }

    // Enhanced category detection with specific medical terms
    const categoryKeywords = {
      'Pathology Report': [
        'pathology', 'pap smear', 'pap and molecular', 'pap', 'cytology', 'cytologic', 
        'biopsy', 'histology', 'specimen', 'molecular pathology', 'atypical squamous',
        'cervical', 'hpv', 'high risk hpv', 'chlamydia', 'neisseria', 'thinprep'
      ],
      'Lab Results': [
        'lab', 'laboratory', 'blood test', 'urine', 'cbc', 'chemistry', 'lipid', 
        'glucose', 'cholesterol', 'hemoglobin', 'creatinine', 'panel'
      ],
      'Imaging Report': [
        'x-ray', 'mri', 'ct scan', 'ultrasound', 'mammogram', 'scan', 'radiology',
        'imaging', 'radiologic', 'sonogram'
      ],
      'Prescription': [
        'prescription', 'rx', 'medication', 'dosage', 'mg', 'tablets', 'pills',
        'daily', 'twice daily', 'capsules'
      ],
      'Doctor Notes': [
        'consultation', 'visit', 'examination', 'assessment', 'diagnosis', 'history',
        'chief complaint', 'physical exam', 'plan'
      ],
      'Vaccination Record': [
        'vaccine', 'vaccination', 'immunization', 'shot', 'hepatitis', 'covid',
        'pfizer', 'moderna', 'booster'
      ],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => fullText.includes(keyword))) {
        data.category = category;
        break;
      }
    }

    // Enhanced lab values extraction - be more selective
    const labValuePatterns = [
      // Traditional lab format: "Test Name: Value Unit (Normal: range)"
      /([a-zA-Z][a-zA-Z\s]{2,30})\s*:\s*(\d+\.?\d*)\s*([a-zA-Z\/\%]{1,10})?(?:\s*(?:\()?(?:normal|ref|reference)?[:\s]*(\d+\.?\d*\s*[-–]\s*\d+\.?\d*))?/gi,
      // Lab format: "Test Name   Value   Unit"
      /^([a-zA-Z][a-zA-Z\s]{2,30})\s+(\d+\.?\d*)\s+([a-zA-Z\/\%]{1,10})$/gm,
    ];

    data.values = [];
    for (const pattern of labValuePatterns) {
      let match;
      while ((match = pattern.exec(ocrText)) !== null) {
        const name = match[1]?.trim();
        const value = match[2];
        const unit = match[3]?.trim();
        const normalRange = match[4]?.trim();

        // Filter out non-medical values (like age, phone numbers, addresses)
        if (name && value && name.length > 2 && name.length < 40) {
          const nameLC = name.toLowerCase();
          const isValidMedical = !nameLC.includes('age') && 
                                !nameLC.includes('phone') && 
                                !nameLC.includes('collection') &&
                                !nameLC.includes('sample') &&
                                !/^\d+$/.test(name) && // Not just numbers
                                !name.includes('PM'); // Not time values
          
          if (isValidMedical) {
            data.values.push({
              name,
              value,
              unit: unit || undefined,
              normalRange: normalRange || undefined,
            });
          }
        }
      }
    }

    // Enhanced key findings extraction - focus on medical significance
    const findingPatterns = [
      /(?:\*{2,})(.*?)(?:\*{2,})/g, // Text between asterisks (like ***DETECTED***)
      /(?:high\s+risk|low\s+risk|positive|negative|abnormal|normal|elevated|decreased)\s+[a-z\s]+/gi,
      /(?:detected|not\s+detected|present|absent)/gi,
      /(?:findings?|impression|conclusion|diagnosis|result)[:\s]*([^\n\r.]{10,100})/gi,
    ];

    data.findings = [];
    for (const pattern of findingPatterns) {
      let match;
      while ((match = pattern.exec(ocrText)) !== null) {
        let finding = (match[1] || match[0])?.trim();
        if (finding && finding.length > 3 && finding.length < 150) {
          // Clean up the finding
          finding = finding.replace(/\s+/g, ' ').trim();
          if (!data.findings.includes(finding) && finding.length > 5) {
            data.findings.push(finding);
          }
        }
      }
    }

    // Smart auto-title generation
    if (!data.title || data.title === 'Lab Results') {
      if (data.category === 'Pathology Report') {
        data.title = 'Pathology Report';
        // Look for specific test types
        if (fullText.includes('pap')) data.title = 'PAP Smear Report';
        if (fullText.includes('biopsy')) data.title = 'Biopsy Report';
        if (fullText.includes('cytology')) data.title = 'Cytology Report';
      } else if (data.category && data.category !== 'Lab Results') {
        data.title = data.category;
      } else if (data.values && data.values.length > 0) {
        data.title = `Lab Results - ${data.values[0].name}`;
      } else if (data.findings && data.findings.length > 0) {
        data.title = 'Medical Report';
      } else {
        data.title = 'Medical Document';
      }
      
      // Add date to title if available
      if (data.date && !data.title.includes(data.date)) {
        data.title += ` - ${data.date}`;
      }
    }

    return data;
  };

  const clearError = () => {
    setError(null);
  };

  return {
    processImage,
    extractMedicalData,
    isProcessing,
    error,
    clearError,
  };
};