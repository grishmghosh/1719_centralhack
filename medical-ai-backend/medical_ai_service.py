"""
Medical AI Service using LLMware
Provides patient-friendly summaries and insights for medical records
"""

from llmware.models import ModelCatalog
import json
import re

class MedicalAIService:
    def __init__(self):
        """Initialize the medical AI service with LLMware models"""
        self.summary_model = None
        self.extract_model = None
        self.loaded_models = set()
        
    def load_model(self, model_name):
        """Load a model if not already loaded"""
        if model_name not in self.loaded_models:
            print(f"Loading {model_name} model...")
            if model_name == "slim-summary-tool":
                self.summary_model = ModelCatalog().load_model("slim-summary-tool")
            elif model_name == "slim-extract-tool":
                self.extract_model = ModelCatalog().load_model("slim-extract-tool")
            self.loaded_models.add(model_name)
            print(f"✅ {model_name} loaded successfully!")
        
    def create_patient_friendly_summary(self, medical_text, record_type="Medical Record"):
        """
        Create a patient-friendly summary of medical text using LLMware
        """
        try:
            # Load the summary model
            self.load_model("slim-summary-tool")
            
            # Create a medical context prompt
            prompt = f"""
            Please provide a clear, patient-friendly summary of this {record_type.lower()}. 
            Explain medical terms in simple language and highlight the most important points.
            
            Medical Content: {medical_text}
            
            Summary:
            """
            
            # Generate summary using LLMware
            response = self.summary_model.function_call(prompt, function="summarize")
            
            # Extract the summary from the response
            if isinstance(response, dict) and 'llm_response' in response:
                summary = response['llm_response'].strip()
            elif isinstance(response, str):
                summary = response.strip()
            else:
                summary = str(response).strip()
                
            # Clean up the summary
            summary = self.clean_summary(summary)
            
            return {
                "success": True,
                "summary": summary,
                "record_type": record_type,
                "confidence": 0.85  # Default confidence score
            }
            
        except Exception as e:
            print(f"Error creating summary: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "summary": "Unable to generate AI summary at this time."
            }
    
    def extract_key_information(self, medical_text):
        """
        Extract key medical information using LLMware
        """
        try:
            # Load the extraction model
            self.load_model("slim-extract-tool")
            
            prompt = f"""
            Extract key medical information from this text:
            - Medications mentioned
            - Medical conditions
            - Important values or measurements
            - Dates mentioned
            - Healthcare providers
            
            Medical Text: {medical_text}
            
            Key Information:
            """
            
            response = self.extract_model.function_call(prompt, function="extract")
            
            if isinstance(response, dict) and 'llm_response' in response:
                extracted = response['llm_response']
            else:
                extracted = str(response)
                
            return {
                "success": True,
                "extracted_info": extracted,
                "raw_response": response
            }
            
        except Exception as e:
            print(f"Error extracting information: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def clean_summary(self, summary):
        """Clean and format the AI-generated summary"""
        # Remove common prefixes that models add
        prefixes_to_remove = [
            "Summary:", "Patient Summary:", "Medical Summary:", 
            "The summary is:", "Here is the summary:", "Summary of"
        ]
        
        for prefix in prefixes_to_remove:
            if summary.lower().startswith(prefix.lower()):
                summary = summary[len(prefix):].strip()
                
        # Ensure it starts with a capital letter
        if summary and not summary[0].isupper():
            summary = summary[0].upper() + summary[1:]
            
        # Limit length for UI display (aim for 2-3 sentences)
        sentences = summary.split('. ')
        if len(sentences) > 3:
            summary = '. '.join(sentences[:3]) + '.'
            
        return summary
    
    def generate_medical_insights(self, medical_content, record_type):
        """
        Generate comprehensive medical insights for a record
        """
        # Create patient-friendly summary
        summary_result = self.create_patient_friendly_summary(medical_content, record_type)
        
        # Extract key information
        extraction_result = self.extract_key_information(medical_content)
        
        # Create risk assessment based on record type
        risk_level = self.assess_risk_level(medical_content, record_type)
        
        return {
            "summary": summary_result,
            "key_info": extraction_result,
            "risk_assessment": risk_level,
            "processed_at": "2025-01-22T10:00:00Z"
        }
    
    def assess_risk_level(self, medical_content, record_type):
        """Simple risk assessment based on keywords and record type"""
        high_risk_keywords = [
            "abnormal", "elevated", "high", "low", "critical", 
            "urgent", "emergency", "severe", "acute"
        ]
        
        medium_risk_keywords = [
            "borderline", "mild", "moderate", "follow-up", 
            "monitor", "recheck", "concern"
        ]
        
        content_lower = medical_content.lower()
        
        high_risk_count = sum(1 for keyword in high_risk_keywords if keyword in content_lower)
        medium_risk_count = sum(1 for keyword in medium_risk_keywords if keyword in content_lower)
        
        if high_risk_count > 0:
            return {"level": "attention", "reason": "Contains values or conditions that may need attention"}
        elif medium_risk_count > 0:
            return {"level": "monitor", "reason": "Routine monitoring recommended"}
        else:
            return {"level": "normal", "reason": "No immediate concerns identified"}

# Test function
def test_medical_ai():
    """Test the medical AI service with sample data"""
    ai_service = MedicalAIService()
    
    # Sample medical text
    sample_text = """
    Complete Blood Count (CBC) Results:
    White Blood Cell Count: 7.2 x10³/μL (Normal range: 4.0-11.0)
    Red Blood Cell Count: 4.5 x10⁶/μL (Normal range: 4.0-5.5)
    Hemoglobin: 14.2 g/dL (Normal range: 12.0-16.0)
    Hematocrit: 42% (Normal range: 36-46%)
    Platelet Count: 250 x10³/μL (Normal range: 150-400)
    
    All values are within normal limits. Patient appears healthy.
    Recommend routine follow-up in 1 year.
    """
    
    print("🧪 Testing Medical AI Service...")
    result = ai_service.create_patient_friendly_summary(sample_text, "Lab Report")
    
    if result["success"]:
        print(f"✅ AI Summary: {result['summary']}")
    else:
        print(f"❌ Error: {result['error']}")
    
    return result

if __name__ == "__main__":
    # Test the service
    test_medical_ai()