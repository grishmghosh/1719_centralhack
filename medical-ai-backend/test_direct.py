#!/usr/bin/env python3
"""
Direct test of LLMware AI service to see debug output
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from llmware_medical_ai import LLMwareMedicalAIService

def test_direct():
    print("🧪 Direct LLMware AI Service Test")
    print("=" * 50)
    
    # Initialize the service
    print("🚀 Initializing LLMware AI Service...")
    service = LLMwareMedicalAIService()
    
    # Test with metformin prescription
    test_text = "metformin 500mg daily"
    print(f"\n📝 Testing with: '{test_text}'")
    print("-" * 30)
    
    result = service.create_patient_friendly_summary(test_text)
    
    print("\n📋 Result:")
    print(result)

if __name__ == "__main__":
    test_direct()