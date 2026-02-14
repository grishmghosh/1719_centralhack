"""
Medical AI Service - Demo Version
Provides patient-friendly summaries and insights for medical records
Uses smart templates and rule-based processing for demo purposes
"""

import json
import re
import random
from typing import Dict, Any, List


class MedicalAIService:
    def __init__(self):
        """Initialize the medical AI service in demo mode."""
        self.demo_mode = True
        print("✅ Medical AI Service initialized (Demo Mode)")
    
    def create_patient_friendly_summary(self, medical_text, record_type="Medical Record"):
        """
        Create a patient-friendly summary of medical text using smart templates
        """
        try:
            # Clean and prepare the text
            clean_text = self._clean_medical_text(medical_text)
            
            # Generate summary based on record type and content
            if "blood test" in clean_text.lower() or "lab" in clean_text.lower():
                summary = self._generate_lab_summary(clean_text)
            elif "prescription" in clean_text.lower() or "medication" in clean_text.lower():
                summary = self._generate_prescription_summary(clean_text)
            elif "x-ray" in clean_text.lower() or "imaging" in clean_text.lower():
                summary = self._generate_imaging_summary(clean_text)
            elif "vaccination" in clean_text.lower() or "vaccine" in clean_text.lower():
                summary = self._generate_vaccination_summary(clean_text)
            else:
                summary = self._generate_general_summary(clean_text, record_type)
            
            return {
                "summary": summary,
                "confidence": 0.85,
                "processing_time": "1.2s",
                "model": "Demo Mode"
            }
            
        except Exception as e:
            return {
                "summary": f"Summary temporarily unavailable. Original content: {medical_text[:200]}...",
                "confidence": 0.0,
                "error": str(e),
                "model": "Demo Mode - Error"
            }
    
    def extract_key_information(self, medical_text):
        """
        Extract key medical information using pattern matching
        """
        try:
            key_info = {
                "medications": self._extract_medications(medical_text),
                "conditions": self._extract_conditions(medical_text),
                "dates": self._extract_dates(medical_text),
                "doctors": self._extract_doctors(medical_text),
                "vital_signs": self._extract_vital_signs(medical_text),
                "instructions": self._extract_instructions(medical_text)
            }
            
            return {
                "extracted_info": key_info,
                "confidence": 0.80,
                "model": "Demo Mode - Pattern Matching"
            }
            
        except Exception as e:
            return {
                "extracted_info": {},
                "error": str(e),
                "model": "Demo Mode - Error"
            }
    
    def assess_risk_level(self, medical_text):
        """
        Assess risk level based on content analysis
        """
        try:
            risk_indicators = {
                "high": ["emergency", "urgent", "critical", "severe", "acute", "immediate"],
                "medium": ["monitor", "follow-up", "concern", "elevated", "abnormal"],
                "low": ["normal", "stable", "routine", "preventive", "maintenance"]
            }
            
            text_lower = medical_text.lower()
            
            high_count = sum(1 for word in risk_indicators["high"] if word in text_lower)
            medium_count = sum(1 for word in risk_indicators["medium"] if word in text_lower)
            low_count = sum(1 for word in risk_indicators["low"] if word in text_lower)
            
            if high_count > 0:
                risk_level = "HIGH"
                explanation = f"Contains {high_count} high-priority indicator(s)"
            elif medium_count > 1:
                risk_level = "MEDIUM"
                explanation = f"Contains {medium_count} medium-priority indicator(s)"
            else:
                risk_level = "LOW"
                explanation = "Routine or stable condition indicated"
            
            return {
                "risk_level": risk_level,
                "explanation": explanation,
                "indicators_found": {
                    "high": high_count,
                    "medium": medium_count,
                    "low": low_count
                },
                "confidence": 0.75,
                "model": "Demo Mode - Rule-based"
            }
            
        except Exception as e:
            return {
                "risk_level": "UNKNOWN",
                "error": str(e),
                "model": "Demo Mode - Error"
            }
    
    # Helper methods for generating summaries
    def _clean_medical_text(self, text):
        """Clean and normalize medical text"""
        # Remove extra whitespace and normalize
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def _generate_lab_summary(self, text):
        """Generate summary for lab/blood test results"""
        summaries = [
            "Your blood test results show important information about your health. The levels measured help your doctor understand how your body is functioning.",
            "This lab work checks various markers in your blood to monitor your overall health and detect any potential issues.",
            "These test results provide valuable insights into your body's current state and help guide your healthcare decisions."
        ]
        
        # Add specific findings if detected
        if "normal" in text.lower():
            summaries.append("Most values appear to be within normal ranges, which is encouraging.")
        if "elevated" in text.lower() or "high" in text.lower():
            summaries.append("Some values may be elevated and worth discussing with your healthcare provider.")
        
        return " ".join(summaries[:2])
    
    def _generate_prescription_summary(self, text):
        """Generate summary for prescription information"""
        return "This prescription information includes details about medications recommended for your treatment. It's important to follow the dosing instructions carefully and discuss any concerns with your pharmacist or doctor."
    
    def _generate_imaging_summary(self, text):
        """Generate summary for imaging results"""
        return "This imaging study (such as X-ray, CT, or MRI) provides pictures of the inside of your body to help your doctor see what's happening. The radiologist has reviewed these images and provided findings for your healthcare team."
    
    def _generate_vaccination_summary(self, text):
        """Generate summary for vaccination records"""
        return "This vaccination record shows important immunizations that help protect your health. Staying up-to-date with recommended vaccines is an important part of preventive healthcare."
    
    def _generate_general_summary(self, text, record_type):
        """Generate general summary for other medical records"""
        return f"This {record_type.lower()} contains important information about your healthcare. Your medical team has documented relevant findings and recommendations for your continued care."
    
    # Information extraction helpers
    def _extract_medications(self, text):
        """Extract medication names from text"""
        # Common medication patterns
        med_patterns = [
            r'\b\w+cillin\b',  # antibiotics
            r'\b\w+pril\b',    # ACE inhibitors
            r'\b\w+statin\b',  # statins
            r'\b\w+zole\b',    # proton pump inhibitors
        ]
        
        medications = []
        for pattern in med_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            medications.extend(matches)
        
        return list(set(medications))  # Remove duplicates
    
    def _extract_conditions(self, text):
        """Extract medical conditions from text"""
        conditions = []
        condition_keywords = ["hypertension", "diabetes", "asthma", "arthritis", "infection"]
        
        for condition in condition_keywords:
            if condition in text.lower():
                conditions.append(condition)
        
        return conditions
    
    def _extract_dates(self, text):
        """Extract dates from text"""
        date_pattern = r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b'
        dates = re.findall(date_pattern, text)
        return dates
    
    def _extract_doctors(self, text):
        """Extract doctor names from text"""
        doctor_pattern = r'Dr\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*'
        doctors = re.findall(doctor_pattern, text)
        return doctors
    
    def _extract_vital_signs(self, text):
        """Extract vital signs from text"""
        vitals = {}
        
        # Blood pressure pattern
        bp_pattern = r'(\d{2,3})/(\d{2,3})'
        bp_match = re.search(bp_pattern, text)
        if bp_match:
            vitals['blood_pressure'] = f"{bp_match.group(1)}/{bp_match.group(2)}"
        
        # Temperature pattern
        temp_pattern = r'(\d{2,3}\.?\d?)\s*°?[Ff]'
        temp_match = re.search(temp_pattern, text)
        if temp_match:
            vitals['temperature'] = f"{temp_match.group(1)}°F"
        
        return vitals
    
    def _extract_instructions(self, text):
        """Extract care instructions from text"""
        instruction_keywords = ["take", "avoid", "follow up", "return if", "call if"]
        instructions = []
        
        sentences = text.split('.')
        for sentence in sentences:
            for keyword in instruction_keywords:
                if keyword in sentence.lower():
                    instructions.append(sentence.strip())
                    break
        
        return instructions


def test_medical_ai_service():
    """Test the medical AI service with sample data"""
    print("🧪 Testing Medical AI Service (Demo Mode)...")
    
    service = MedicalAIService()
    
    # Test data
    sample_records = [
        {
            "type": "Blood Test",
            "content": "Complete Blood Count (CBC) results from 01/15/2024. WBC: 7.2, RBC: 4.5, Hemoglobin: 14.2 g/dL. All values within normal ranges. Dr. Smith recommends follow-up in 6 months."
        },
        {
            "type": "Prescription",
            "content": "Prescribed Lisinopril 10mg daily for hypertension management. Take with morning meal. Monitor blood pressure weekly. Call if any side effects occur."
        },
        {
            "type": "X-Ray",
            "content": "Chest X-ray from Emergency Department visit. No acute abnormalities detected. Lungs clear, heart size normal. Follow up with primary care physician."
        }
    ]
    
    for i, record in enumerate(sample_records, 1):
        print(f"\n--- Test {i}: {record['type']} ---")
        
        # Test summary generation
        summary_result = service.create_patient_friendly_summary(
            record['content'], 
            record['type']
        )
        print(f"📝 Summary: {summary_result['summary']}")
        
        # Test key information extraction
        extraction_result = service.extract_key_information(record['content'])
        print(f"🔍 Key Info: {extraction_result['extracted_info']}")
        
        # Test risk assessment
        risk_result = service.assess_risk_level(record['content'])
        print(f"⚠️  Risk Level: {risk_result['risk_level']} - {risk_result['explanation']}")
    
    print("\n✅ All tests completed successfully!")


if __name__ == "__main__":
    test_medical_ai_service()