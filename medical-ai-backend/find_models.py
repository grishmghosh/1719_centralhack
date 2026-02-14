#!/usr/bin/env python3
"""
Find suitable LLMware models for medical AI integration
"""

from llmware.models import ModelCatalog

def find_medical_models():
    """Find models suitable for medical text processing"""
    print("🔍 Searching for suitable LLMware models...")
    
    catalog = ModelCatalog()
    all_models = catalog.list_all_models()
    
    print(f"📋 Total models available: {len(all_models)}")
    
    # Look for specific model types
    categories = {
        "Medical": [],
        "Summary": [],
        "Function Calling": [],
        "General Text": []
    }
    
    for model in all_models:
        if isinstance(model, dict) and 'model_name' in model:
            model_name = model['model_name'].lower()
            model_category = model.get('model_category', '').lower()
            
            # Medical models
            if 'medical' in model_name or 'healthcare' in model_name:
                categories["Medical"].append(model)
            
            # Summary models  
            elif 'summary' in model_name or 'slim' in model_name:
                categories["Summary"].append(model)
            
            # Function calling models
            elif 'function' in model_name or 'tool' in model_name:
                categories["Function Calling"].append(model)
            
            # General text generation models
            elif model_category in ['generative_local', 'chat']:
                categories["General Text"].append(model)
    
    # Print results
    for category, models in categories.items():
        print(f"\n📂 {category} Models ({len(models)} found):")
        for model in models[:5]:  # Show first 5
            name = model.get('model_name', 'Unknown')
            family = model.get('model_family', 'Unknown')
            category = model.get('model_category', 'Unknown')
            print(f"  • {name} ({family}, {category})")
    
    # Recommend specific models to try
    print("\n🎯 Recommended models for medical AI:")
    
    # Look for specific models we know work well
    recommended = []
    for model in all_models:
        if isinstance(model, dict) and 'model_name' in model:
            name = model['model_name']
            if any(keyword in name.lower() for keyword in [
                'llama', 'mistral', 'phi', 'dragon', 'slim-summary', 
                'slim-extract', 'bling', 'tiny'
            ]):
                recommended.append(model)
    
    for model in recommended[:10]:
        name = model.get('model_name', 'Unknown')
        size = model.get('model_size', 'Unknown')
        location = model.get('model_location', 'Unknown')
        print(f"  ✅ {name} (Size: {size}, Location: {location})")

if __name__ == "__main__":
    find_medical_models()