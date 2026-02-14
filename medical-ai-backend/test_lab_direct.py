#!/usr/bin/env python3
"""
Test the lab analysis function directly
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from llmware_medical_ai import LLMwareMedicalAIService

def test_lab_analysis():
    print("🧪 Direct Lab Analysis Test")
    print("=" * 50)
    
    # Initialize the service
    service = LLMwareMedicalAIService()
    
    # Test CBC data
    cbc_text = """
    Complete Blood Count (CBC) Report
    Hemoglobin: 11.2 g/dL (Normal: 13.5-17.5 g/dL) - LOW
    Hematocrit: 33.8% (Normal: 41-53%) - LOW  
    White Blood Cells: 12,500 /μL (Normal: 4,000-11,000 /μL) - HIGH
    Platelets: 150,000 /μL (Normal: 150,000-450,000 /μL) - NORMAL
    """
    
    print(f"📝 Testing lab analysis with:")
    print(cbc_text)
    
    # Test the lab analysis function directly
    print("\n🔬 Lab Analysis Results:")
    lab_analysis = service._analyze_lab_values(cbc_text)
    for i, analysis in enumerate(lab_analysis, 1):
        print(f"  {i}. {analysis}")
    
    # Test full summary
    print("\n📄 Full Summary:")
    result = service.create_patient_friendly_summary(cbc_text)
    print(result)

if __name__ == "__main__":
    test_lab_analysis()