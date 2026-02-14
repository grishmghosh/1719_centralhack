"""
Flask API for Medical AI Service
Provides REST endpoints for medical record summarization and analysis
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from medical_ai_service_demo import MedicalAIService as DemoService
from llmware_medical_ai import LLMwareMedicalAIService
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native requests

# Try to use real LLMware AI, fallback to demo if needed
try:
    print("🚀 Attempting to load Real LLMware AI Service...")
    medical_ai = LLMwareMedicalAIService()
    if medical_ai.model_loaded:
        print("✅ Real LLMware AI Service loaded successfully!")
        USE_REAL_AI = True
        AI_MODE = "Real LLMware AI"
    else:
        raise Exception("Real AI failed to load")
except Exception as e:
    print(f"⚠️  Real LLMware AI failed: {str(e)}")
    print("🔄 Falling back to Demo AI Service...")
    medical_ai = DemoService()
    USE_REAL_AI = False
    AI_MODE = "Demo Mode"

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Medical AI API',
        'version': '1.0.0',
        'mode': AI_MODE,
        'real_ai': USE_REAL_AI
    })

@app.route('/api/summarize', methods=['POST'])
def summarize_medical_record():
    """
    Generate patient-friendly summary for medical record
    
    Expected JSON payload:
    {
        "content": "medical record text",
        "record_type": "Blood Test" (optional)
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        content = data.get('content')
        if not content:
            return jsonify({'error': 'No content provided'}), 400
        
        record_type = data.get('record_type', 'Medical Record')
        
        # Generate summary using our AI service
        result = medical_ai.create_patient_friendly_summary(content, record_type)
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/extract', methods=['POST'])
def extract_key_information():
    """
    Extract key information from medical record
    
    Expected JSON payload:
    {
        "content": "medical record text"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        content = data.get('content')
        if not content:
            return jsonify({'error': 'No content provided'}), 400
        
        # Extract key information using our AI service
        result = medical_ai.extract_key_information(content)
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/assess-risk', methods=['POST'])
def assess_risk_level():
    """
    Assess risk level for medical record
    
    Expected JSON payload:
    {
        "content": "medical record text"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        content = data.get('content')
        if not content:
            return jsonify({'error': 'No content provided'}), 400
        
        # Assess risk using our AI service
        result = medical_ai.assess_risk_level(content)
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_medical_record():
    """
    Complete analysis of medical record (summary + extraction + risk assessment)
    
    Expected JSON payload:
    {
        "content": "medical record text",
        "record_type": "Blood Test" (optional)
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        content = data.get('content')
        if not content:
            return jsonify({'error': 'No content provided'}), 400
        
        record_type = data.get('record_type', 'Medical Record')
        
        # Perform complete analysis
        summary_result = medical_ai.create_patient_friendly_summary(content, record_type)
        extraction_result = medical_ai.extract_key_information(content)
        risk_result = medical_ai.assess_risk_level(content)
        
        return jsonify({
            'success': True,
            'data': {
                'summary': summary_result,
                'key_information': extraction_result,
                'risk_assessment': risk_result,
                'analysis_timestamp': str(data.get('timestamp', 'unknown')),
                'record_type': record_type
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/batch-analyze', methods=['POST'])
def batch_analyze_records():
    """
    Analyze multiple medical records in batch
    
    Expected JSON payload:
    {
        "records": [
            {
                "id": "record_1",
                "content": "medical record text",
                "record_type": "Blood Test"
            },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        records = data.get('records', [])
        if not records:
            return jsonify({'error': 'No records provided'}), 400
        
        results = []
        
        for record in records:
            record_id = record.get('id', 'unknown')
            content = record.get('content', '')
            record_type = record.get('record_type', 'Medical Record')
            
            if not content:
                results.append({
                    'id': record_id,
                    'success': False,
                    'error': 'No content provided for this record'
                })
                continue
            
            try:
                # Analyze each record
                summary_result = medical_ai.create_patient_friendly_summary(content, record_type)
                extraction_result = medical_ai.extract_key_information(content)
                risk_result = medical_ai.assess_risk_level(content)
                
                results.append({
                    'id': record_id,
                    'success': True,
                    'data': {
                        'summary': summary_result,
                        'key_information': extraction_result,
                        'risk_assessment': risk_result,
                        'record_type': record_type
                    }
                })
                
            except Exception as e:
                results.append({
                    'id': record_id,
                    'success': False,
                    'error': str(e)
                })
        
        return jsonify({
            'success': True,
            'results': results,
            'total_processed': len(results)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Starting Medical AI API Server...")
    print("📋 Available endpoints:")
    print("  GET  /health              - Health check")
    print("  POST /api/summarize       - Generate patient-friendly summary")
    print("  POST /api/extract         - Extract key information")
    print("  POST /api/assess-risk     - Assess risk level")
    print("  POST /api/analyze         - Complete analysis")
    print("  POST /api/batch-analyze   - Batch analysis")
    print("\n💡 Server running on http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)