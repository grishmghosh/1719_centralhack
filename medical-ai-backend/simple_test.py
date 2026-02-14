#!/usr/bin/env python3
"""
Simple test with just one GGUF model that should work
"""

from llmware.models import ModelCatalog
import time

def test_simple_gguf():
    """Test the simplest GGUF model we can find"""
    print("🔍 Testing simplest GGUF model...")
    
    # Try the tiniest model first
    model_name = "bling-tiny-llama-v0"  # Very small model
    
    try:
        print(f"📦 Loading {model_name}...")
        catalog = ModelCatalog()
        
        # Load model
        model = catalog.load_model(model_name)
        print(f"✅ Model loaded: {type(model)}")
        
        # Simple test
        prompt = "Summarize: Patient has high blood pressure and needs medication."
        print(f"🧪 Testing with prompt: {prompt}")
        
        # Try inference
        response = model.inference(prompt, add_context="", add_prompt_engineering="")
        print(f"🤖 Response: {response}")
        
        return True, model, response
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False, None, None

def test_without_cuda():
    """Test specifically without CUDA requirements"""
    print("🔧 Testing CPU-only models...")
    
    # Models that should work on CPU
    cpu_models = [
        "bling-tiny-llama-v0",
        "bling-1b-0.1", 
        "dragon-mistral-7b-v0",
        "slim-sentiment-tool"
    ]
    
    catalog = ModelCatalog()
    
    for model_name in cpu_models:
        try:
            print(f"\n📦 Trying {model_name}...")
            model = catalog.load_model(model_name)
            
            # Simple medical test
            response = model.inference("What is hypertension?", add_context="", add_prompt_engineering="")
            print(f"✅ SUCCESS: {response}")
            return model_name, model
            
        except Exception as e:
            print(f"❌ Failed {model_name}: {str(e)}")
            continue
    
    return None, None

if __name__ == "__main__":
    print("🚀 Starting simple LLMware test...")
    
    # First try the simple test
    success, model, response = test_simple_gguf()
    
    if not success:
        print("\n🔄 Trying alternative approach...")
        model_name, model = test_without_cuda()
        
        if model:
            print(f"\n🎉 SUCCESS! Working model: {model_name}")
        else:
            print("\n❌ No models working - need to debug further")
    else:
        print(f"\n🎉 SUCCESS! Model working with response: {response}")