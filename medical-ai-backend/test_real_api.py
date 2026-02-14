#!/usr/bin/env python3
"""
Test Real LLMware AI API Integration
Test the Flask API endpoints with real LLMware AI service
"""

import requests
import json
import time

# Wait for server to start
print("⏳ Waiting for API server to start...")
time.sleep(3)

API_BASE = "http://localhost:5000"

def test_health_check():
    """Test health check endpoint"""
    print("\n🏥 Testing health check...")
    try:
        response = requests.get(f"{API_BASE}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed!")
            print(f"📊 Status: {data.get('status')}")
            print(f"🤖 Mode: {data.get('mode')}")
            print(f"🔧 Real AI: {data.get('real_ai')}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_summarize():
    """Test medical summary generation"""
    print("\n📝 Testing medical summary generation...")
    
    test_data = {
        "content": "Patient presents with elevated blood pressure reading of 165/95 mmHg, reported chest pain, and shortness of breath during mild exertion. Patient has history of hypertension and is currently taking lisinopril 10mg daily. Recommends immediate cardiology consultation and possible medication adjustment."
    }
    
    try:
        response = requests.post(f"{API_BASE}/api/summarize", json=test_data)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Summary generated successfully!")
            print(f"🤖 AI Mode: {data.get('ai_mode', 'unknown')}")
            print(f"📊 Confidence: {data.get('confidence', 'N/A')}")
            print(f"📝 Summary: {data.get('summary', 'No summary')}")
            if 'semantic_analysis' in data:
                print(f"🧠 Semantic Analysis: {data['semantic_analysis']}")
            return True
        else:
            print(f"❌ Summary failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Summary error: {e}")
        return False

def test_risk_assessment():
    """Test risk assessment"""
    print("\n⚠️ Testing risk assessment...")
    
    test_data = {
        "content": "Patient has severe chest pain radiating to left arm, profuse sweating, nausea, and shortness of breath. Blood pressure 180/110, heart rate 95 bpm irregular. Immediate emergency department evaluation required."
    }
    
    try:
        response = requests.post(f"{API_BASE}/api/assess-risk", json=test_data)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Risk assessment completed!")
            print(f"🚨 Risk Level: {data.get('risk_level', 'unknown')}")
            print(f"🤖 AI Mode: {data.get('ai_mode', 'unknown')}")
            print(f"📊 Confidence: {data.get('confidence', 'N/A')}")
            print(f"💡 Explanation: {data.get('explanation', 'No explanation')}")
            return True
        else:
            print(f"❌ Risk assessment failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Risk assessment error: {e}")
        return False

def test_complete_analysis():
    """Test complete medical analysis"""
    print("\n🔬 Testing complete analysis...")
    
    test_data = {
        "content": "45-year-old male with type 2 diabetes mellitus, HbA1c 8.2%, fasting glucose 195 mg/dL. Patient reports increased thirst, frequent urination, and fatigue. Currently on metformin 1000mg twice daily. Blood pressure 140/85, BMI 32. Recommend diabetes education, dietary consultation, and consider adding second antidiabetic agent."
    }
    
    try:
        response = requests.post(f"{API_BASE}/api/analyze", json=test_data)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Complete analysis successful!")
            print(f"🤖 AI Mode: {data.get('ai_mode', 'unknown')}")
            print(f"📊 Overall Confidence: {data.get('confidence', 'N/A')}")
            
            # Print individual analysis components
            for key, value in data.items():
                if key not in ['ai_mode', 'confidence']:
                    print(f"📋 {key.replace('_', ' ').title()}: {value}")
            return True
        else:
            print(f"❌ Complete analysis failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Complete analysis error: {e}")
        return False

def main():
    """Run all API tests"""
    print("🚀 Testing Real LLMware AI Integration")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health_check),
        ("Medical Summary", test_summarize),
        ("Risk Assessment", test_risk_assessment),
        ("Complete Analysis", test_complete_analysis)
    ]
    
    results = []
    for test_name, test_func in tests:
        result = test_func()
        results.append((test_name, result))
    
    print("\n" + "=" * 50)
    print("🏁 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:20} | {status}")
        if result:
            passed += 1
    
    print(f"\n📊 Overall: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 ALL TESTS PASSED! Real LLMware AI is working correctly!")
        print("🏆 Ready for hackathon demo!")
    else:
        print("⚠️ Some tests failed. Check the output above for details.")

if __name__ == "__main__":
    main()