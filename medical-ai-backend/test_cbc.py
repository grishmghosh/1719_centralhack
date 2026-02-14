#!/usr/bin/env python3
"""
Test with real lab report data to see what the AI extracts
"""

import requests
import json

API_BASE = "http://localhost:5000"

def test_cbc_report():
    """Test with a realistic Complete Blood Count report"""
    print("🩸 Testing Complete Blood Count Analysis")
    print("=" * 60)
    
    # Realistic CBC report
    cbc_report = """
    Complete Blood Count (CBC) Report
    Patient: John Doe
    Date: September 22, 2025
    
    Hemoglobin: 11.2 g/dL (Normal: 13.5-17.5 g/dL) - LOW
    Hematocrit: 33.8% (Normal: 41-53%) - LOW  
    White Blood Cells: 12,500 /μL (Normal: 4,000-11,000 /μL) - HIGH
    Platelets: 150,000 /μL (Normal: 150,000-450,000 /μL) - NORMAL
    Red Blood Cells: 4.1 million/μL (Normal: 4.5-5.9 million/μL) - LOW
    
    Clinical Notes: Patient shows signs of mild anemia with elevated white cell count suggesting possible infection.
    """
    
    print(f"📝 Input CBC Report:")
    print(cbc_report[:200] + "...")
    
    # Test summary
    print("\n📋 Testing Summary Generation:")
    test_data = {"content": cbc_report}
    
    try:
        response = requests.post(f"{API_BASE}/api/summarize", json=test_data)
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'data' in data:
                result = data['data']
                print(f"✅ Summary: {result.get('summary', 'No summary')}")
            else:
                print(f"❌ Unexpected response: {data}")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test key information extraction
    print("\n🔍 Testing Key Information Extraction:")
    try:
        response = requests.post(f"{API_BASE}/api/extract", json=test_data)
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'data' in data:
                result = data['data']
                print("✅ Key Information Extracted:")
                extracted = result.get('extracted_info', {})
                for key, value in extracted.items():
                    print(f"  📊 {key}: {value}")
            else:
                print(f"❌ Unexpected response: {data}")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")

    # Test risk assessment
    print("\n⚠️ Testing Risk Assessment:")
    try:
        response = requests.post(f"{API_BASE}/api/assess-risk", json=test_data)
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'data' in data:
                result = data['data']
                print(f"✅ Risk Level: {result.get('risk_level', 'Unknown')}")
                print(f"📝 Explanation: {result.get('explanation', 'No explanation')}")
            else:
                print(f"❌ Unexpected response: {data}")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_cbc_report()