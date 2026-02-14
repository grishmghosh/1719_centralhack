#!/usr/bin/env python3
"""
Test with exact model names we discovered
"""

from llmware.models import ModelCatalog
import time

def test_working_models():
    """Test models we know exist from our earlier discovery"""
    print("🔍 Testing with exact model names...")
    
    # Use the exact names from our model discovery
    exact_models = [
        "bling-tiny-llama-onnx",    # ONNX model (should work)
        "bling-phi-3-onnx",         # Phi-3 ONNX
        "phi-3-onnx",               # Pure Phi-3 ONNX
    ]
    
    catalog = ModelCatalog()
    
    for model_name in exact_models:
        try:
            print(f"\n📦 Trying exact model: {model_name}")
            
            # Load model
            start_time = time.time()
            model = catalog.load_model(model_name)
            load_time = time.time() - start_time
            
            print(f"✅ Model loaded in {load_time:.2f}s: {type(model)}")
            
            # Test medical inference
            medical_prompt = "Explain this medical result in simple terms: Blood pressure 140/90, which is elevated and may indicate hypertension."
            
            print(f"🧪 Testing medical prompt...")
            response = model.inference(medical_prompt, add_context="", add_prompt_engineering="")
            
            print(f"🤖 AI Response: {response}")
            print(f"🎉 SUCCESS! Model {model_name} is working!")
            
            return model_name, model
            
        except Exception as e:
            print(f"❌ Failed {model_name}: {str(e)}")
            continue
    
    return None, None

def test_embedding_fallback():
    """If generative models fail, try embedding models for similarity"""
    print("\n🔄 Trying embedding models as fallback...")
    
    embedding_models = [
        "all-MiniLM-L6-v2",
        "all-mpnet-base-v2"
    ]
    
    catalog = ModelCatalog()
    
    for model_name in embedding_models:
        try:
            print(f"📦 Trying embedding model: {model_name}")
            model = catalog.load_model(model_name)
            print(f"✅ Embedding model loaded: {model_name}")
            
            # Test embedding
            text = "Patient has high blood pressure"
            embedding = model.embedding(text)
            print(f"🔢 Embedding shape: {len(embedding) if embedding else 'None'}")
            
            return model_name, model
            
        except Exception as e:
            print(f"❌ Embedding failed {model_name}: {str(e)}")
            continue
    
    return None, None

if __name__ == "__main__":
    print("🚀 Testing LLMware with exact model names...")
    
    # Try generative models first
    model_name, model = test_working_models()
    
    if model:
        print(f"\n🎯 SOLUTION FOUND: Use model '{model_name}'")
    else:
        # Fallback to embedding models
        print("\n⚠️ Generative models failed, trying embeddings...")
        emb_name, emb_model = test_embedding_fallback()
        
        if emb_model:
            print(f"🎯 FALLBACK SOLUTION: Use embedding model '{emb_name}' with template responses")
        else:
            print("❌ No models working - need alternative approach")