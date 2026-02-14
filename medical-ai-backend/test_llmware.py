#!/usr/bin/env python3
"""
Test LLMware model loading and basic functionality
"""

import time
from llmware.models import ModelCatalog

def test_model_loading():
    """Test loading and using a lightweight LLMware model"""
    print("🧪 Testing LLMware model loading...")
    
    # Try lightweight models in order of preference
    models_to_try = [
        "bling-tiny-llama-ov",      # Very lightweight
        "slim-sentiment-tool",       # Specialized tool
        "bling-phi-3-onnx",         # Phi-3 based
        "slim-extract-tiny-ov"      # Extraction focused
    ]
    
    catalog = ModelCatalog()
    
    for model_name in models_to_try:
        try:
            print(f"\n📦 Attempting to load: {model_name}")
            start_time = time.time()
            
            # Load the model
            model = catalog.load_model(model_name)
            load_time = time.time() - start_time
            
            print(f"✅ Model loaded successfully in {load_time:.2f} seconds")
            print(f"📋 Model info: {type(model)}")
            
            # Test basic inference
            print("\n🔬 Testing medical text summarization...")
            
            medical_text = """
            Patient: John Smith, Age: 45
            Chief Complaint: Chest pain and shortness of breath
            Vital Signs: BP 140/90, HR 95, Temp 98.6°F
            Assessment: Hypertension, possible cardiac workup needed
            Plan: EKG, chest X-ray, follow up in 1 week
            """
            
            # Try different prompting approaches
            prompts = [
                f"Summarize this medical record in simple terms: {medical_text}",
                f"Explain this medical information to a patient: {medical_text}",
                f"Create a brief summary: {medical_text}"
            ]
            
            for i, prompt in enumerate(prompts, 1):
                try:
                    print(f"\n🔸 Test {i}: Testing prompt...")
                    start_time = time.time()
                    
                    # Try different inference methods
                    if hasattr(model, 'inference'):
                        response = model.inference(prompt, add_context="", add_prompt_engineering="")
                    elif hasattr(model, 'function_call'):
                        response = model.function_call(prompt)
                    elif hasattr(model, '__call__'):
                        response = model(prompt)
                    else:
                        print(f"❌ No suitable inference method found for {model_name}")
                        continue
                    
                    inference_time = time.time() - start_time
                    print(f"⏱️  Inference completed in {inference_time:.2f} seconds")
                    print(f"🤖 Response: {response}")
                    
                    # If we get here, the model is working!
                    return model_name, model, response
                    
                except Exception as e:
                    print(f"❌ Inference failed: {str(e)}")
                    continue
            
        except Exception as e:
            print(f"❌ Failed to load {model_name}: {str(e)}")
            continue
    
    print("\n❌ No models could be loaded successfully")
    return None, None, None

def test_model_with_medical_content():
    """Test the model with various medical content types"""
    model_name, model, _ = test_model_loading()
    
    if not model:
        print("❌ No working model found for medical content testing")
        return False
    
    print(f"\n🏥 Testing {model_name} with different medical content types...")
    
    test_cases = [
        {
            "type": "Lab Results",
            "content": "CBC: WBC 7.2, RBC 4.5, Hemoglobin 14.2 g/dL. All values normal."
        },
        {
            "type": "Prescription", 
            "content": "Lisinopril 10mg daily for hypertension. Take with food."
        },
        {
            "type": "Discharge Summary",
            "content": "Patient treated for mild pneumonia. Prescribed antibiotics. Follow up in 5 days."
        }
    ]
    
    working_examples = 0
    
    for test_case in test_cases:
        try:
            print(f"\n📋 Testing {test_case['type']}...")
            prompt = f"Explain this {test_case['type']} in simple terms for a patient: {test_case['content']}"
            
            if hasattr(model, 'inference'):
                response = model.inference(prompt)
            elif hasattr(model, 'function_call'):
                response = model.function_call(prompt)
            else:
                response = model(prompt)
            
            print(f"✅ Success: {response}")
            working_examples += 1
            
        except Exception as e:
            print(f"❌ Failed: {str(e)}")
    
    success_rate = working_examples / len(test_cases)
    print(f"\n📊 Success rate: {working_examples}/{len(test_cases)} ({success_rate*100:.1f}%)")
    
    return success_rate > 0.5  # Consider successful if >50% work

if __name__ == "__main__":
    success = test_model_with_medical_content()
    print(f"\n🎯 Overall test result: {'SUCCESS' if success else 'NEEDS MORE WORK'}")