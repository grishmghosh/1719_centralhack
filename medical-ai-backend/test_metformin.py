#!/usr/bin/env python3
"""
Test the improved AI with specific metformin prescription
"""

import requests
import json
import time

API_BASE = "http://localhost:5000"

def test_metformin_prescription():
    """Test with the specific metformin case the user mentioned"""
    print("💊 Testing Metformin Prescription Analysis")
    print("=" * 50)
    
    # The user's example: metformin, dosage 500ml (should be 500mg)
    test_data = {
        "content": "metformin 500mg daily"
    }
    
    print(f"📝 Input: '{test_data['content']}'")
    print("\n🔍 Testing summary generation...")
    
    try:
        response = requests.post(f"{API_BASE}/api/summarize", json=test_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Summary generated!")
            
            # The API returns data in a nested structure
            if data.get('success') and 'data' in data:
                result = data['data']
                print(f"📄 Summary: {result.get('summary', 'No summary')}")
                print(f"🤖 AI Mode: {result.get('ai_mode', 'unknown')}")
                print(f"📊 Confidence: {result.get('confidence', 'N/A')}")
                if 'semantic_analysis' in result:
                    print(f"🧠 Semantic Analysis: {result['semantic_analysis']}")
            else:
                print(f"❌ Unexpected response structure: {data}")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_detailed_prescription():
    """Test with a more detailed prescription"""
    print("\n💊 Testing Detailed Prescription")
    print("=" * 50)
    
    test_data = {
        "content": "Metformin 500mg twice daily for diabetes management. Take with meals to reduce stomach upset."
    }
    
    print(f"📝 Input: '{test_data['content']}'")
    print("\n🔍 Testing summary generation...")
    
    try:
        response = requests.post(f"{API_BASE}/api/summarize", json=test_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Summary generated!")
            if data.get('success') and 'data' in data:
                result = data['data']
                print(f"📄 Summary: {result.get('summary', 'No summary')}")
            else:
                print(f"❌ Unexpected response: {data}")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_complex_prescription():
    """Test with multiple medications"""
    print("\n💊 Testing Complex Prescription")
    print("=" * 50)
    
    test_data = {
        "content": "Lisinopril 10mg once daily for blood pressure. Metformin 500mg twice daily with meals. Follow up in 3 months."
    }
    
    print(f"📝 Input: '{test_data['content']}'")
    print("\n🔍 Testing summary generation...")
    
    try:
        response = requests.post(f"{API_BASE}/api/summarize", json=test_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Summary generated!")
            if data.get('success') and 'data' in data:
                result = data['data']
                print(f"📄 Summary: {result.get('summary', 'No summary')}")
            else:
                print(f"❌ Unexpected response: {data}")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🧪 Testing Improved AI with Real Medical Content")
    print("=" * 60)
    
    # Wait a moment for any server changes
    time.sleep(2)
    
    test_metformin_prescription()
    test_detailed_prescription()
    test_complex_prescription()
    
    print("\n🏁 Testing Complete!")
    print("Check the debug output in the server terminal for detailed analysis.")