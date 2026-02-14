import requests
import json

def quick_test():
    print("🧪 Quick API Test...")
    
    # Test data similar to what's in our Supabase database
    test_record = {
        "content": "Blood glucose: 95 mg/dL (normal range: 70-100 mg/dL). Patient shows good glycemic control. Continue current diabetes management plan. Dr. Anderson recommends routine follow-up in 3 months.",
        "record_type": "Lab Test"
    }
    
    try:
        # Test the analyze endpoint
        response = requests.post(
            "http://localhost:5000/api/analyze",
            json=test_record,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                data = result['data']
                print("✅ API Test PASSED!")
                print(f"📝 Summary: {data['summary']['summary'][:100]}...")
                print(f"⚠️  Risk: {data['risk_assessment']['risk_level']}")
                return True
            else:
                print(f"❌ API Error: {result.get('error')}")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure Flask server is running")
        print("   Run: python api_server.py")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return False

if __name__ == "__main__":
    quick_test()