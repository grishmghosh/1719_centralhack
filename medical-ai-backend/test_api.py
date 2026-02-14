"""
Test client for Medical AI API
Tests all endpoints to ensure they're working correctly
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:5000"

def test_health_endpoint():
    """Test the health check endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_summarize_endpoint():
    """Test the summarize endpoint"""
    print("\n🔍 Testing summarize endpoint...")
    
    test_data = {
        "content": "Complete Blood Count (CBC) results from 01/15/2024. WBC: 7.2, RBC: 4.5, Hemoglobin: 14.2 g/dL. All values within normal ranges. Dr. Smith recommends follow-up in 6 months.",
        "record_type": "Blood Test"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/summarize", 
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Success: {result.get('success')}")
        if result.get('success'):
            print(f"Summary: {result['data']['summary']}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_analyze_endpoint():
    """Test the complete analysis endpoint"""
    print("\n🔍 Testing analyze endpoint...")
    
    test_data = {
        "content": "Prescribed Lisinopril 10mg daily for hypertension management. Take with morning meal. Monitor blood pressure weekly. Call if any side effects occur.",
        "record_type": "Prescription"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/analyze", 
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Success: {result.get('success')}")
        if result.get('success'):
            data = result['data']
            print(f"Summary: {data['summary']['summary']}")
            print(f"Risk Level: {data['risk_assessment']['risk_level']}")
            print(f"Key Info: {data['key_information']['extracted_info']}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all API tests"""
    print("🧪 Testing Medical AI API...")
    
    tests = [
        ("Health Check", test_health_endpoint),
        ("Summarize", test_summarize_endpoint), 
        ("Complete Analysis", test_analyze_endpoint)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        success = test_func()
        results.append((test_name, success))
        print(f"✅ {test_name}: {'PASSED' if success else 'FAILED'}")
    
    print(f"\n{'='*50}")
    print("📊 Test Results Summary:")
    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"  {test_name}: {status}")
    
    all_passed = all(success for _, success in results)
    print(f"\n🎯 Overall: {'ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")

if __name__ == "__main__":
    main()