from flask import Blueprint, jsonify, request
import random

from app.services.risk_service import assess_risk
from app.services.data_ingestion import create_report, get_all_reports

api_bp = Blueprint('api', __name__)


@api_bp.route('/status', methods=['GET'])
def status():
    return jsonify({'status': 'Phoenix AI backend running'})


# Resource prediction endpoint
@api_bp.route('/v1/resource-prediction', methods=['POST'])
def resource_prediction():
    # Simulate resource prediction output
    return jsonify({
        'region': 'Central City',
        'resources': [
            {'type': 'Water', 'quantity': 500,
                'unit': 'liters', 'location': 'Depot A'},
            {'type': 'Medical Kits', 'quantity': 100,
                'unit': 'kits', 'location': 'Hospital B'},
            {'type': 'Food', 'quantity': 300, 'unit': 'meals', 'location': 'School C'}
        ]
    })

# Vulnerability mapping endpoint
@api_bp.route('/v1/vulnerability-map', methods=['GET'])
def vulnerability_map():
    # Simulate vulnerability map data
    return jsonify({
        'areas': [
            {'name': 'Zone 1', 'risk': 'high', 'vulnerable_pop': 1200,
                'critical_infra': ['Hospital', 'Power Station']},
            {'name': 'Zone 2', 'risk': 'medium',
                'vulnerable_pop': 800, 'critical_infra': ['School']},
            {'name': 'Zone 3', 'risk': 'low',
                'vulnerable_pop': 300, 'critical_infra': []}
        ]
    })

# Economic impact analysis endpoint
@api_bp.route('/v1/economic-impact', methods=['POST'])
def economic_impact():
    # Simulate economic impact output
    return jsonify({
        'estimated_loss_usd': 2500000,
        'businesses_affected': 42,
        'summary': 'Severe impact on retail and transport sectors.'
    })

# Predictive feedback loop endpoint
@api_bp.route('/v1/feedback-loop', methods=['POST'])
def feedback_loop():
    # Simulate feedback loop output
    return jsonify({
        'improvement': 'Model accuracy improved by 7% after last event.',
        'recommendation': 'Increase sensor density in high-risk zones.'
    })


# Simulated social media analysis endpoint
@api_bp.route('/v1/social', methods=['GET'])
def social_media():
    # Simulate actionable social posts
    posts = [
        {'id': 1, 'lat': 28.615, 'lon': 77.215,
            'text': 'Flooded road near Connaught Place! #help'},
        {'id': 2, 'lat': 28.605, 'lon': 77.225, 'text': 'Power outage in Karol Bagh.'},
        {'id': 3, 'lat': 28.625, 'lon': 77.205,
            'text': 'People trapped in building, need rescue!'}
    ]
    return jsonify({'posts': posts})


# Simulated AI chatbot endpoint
@api_bp.route('/v1/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    question = data.get('question', '').lower()
    # Simple rule-based answers for demo
    if 'shelter' in question:
        answer = 'The nearest shelter is at City Hall, 2km from your location.'
    elif 'evacuation' in question:
        answer = 'Evacuation route: Main St -> River Rd -> Safe Zone.'
    elif 'aid' in question:
        answer = 'Aid distribution center is at Central Park.'
    else:
        answer = 'Sorry, I do not have information on that. Please contact local authorities.'
    return jsonify({'answer': answer})


# Dynamic risk modeling endpoint (accepts real-time data)
@api_bp.route('/v1/dynamic-risk', methods=['POST'])
def dynamic_risk():
    data = request.get_json()
    rainfall = data.get('rainfall', 0)
    river_level = data.get('river_level', 0)
    # Simple logic: high risk if rainfall > 100mm or river_level > 5m
    if rainfall > 100 or river_level > 5:
        risk = 'high'
    elif rainfall > 50 or river_level > 3:
        risk = 'medium'
    else:
        risk = 'low'
    return jsonify({'risk_level': risk, 'rainfall': rainfall, 'river_level': river_level})


# Automated damage assessment endpoint (simulated)
@api_bp.route('/v1/damage-assessment', methods=['POST'])
def damage_assessment():
    # For demo, just return a simulated damage report
    return jsonify({
        'damage_score': 0.7,
        'summary': 'Severe damage detected in 3 buildings. Roads partially blocked.'
    })


# Citizen self-reporting endpoint
@api_bp.route('/v1/report', methods=['POST'])
def citizen_report():
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')
    description = data.get('description')
    # For demo, photo upload is not handled, just description and location
    report = create_report(lat, lon, description)
    return jsonify({'success': True, 'report': report})


# Get all reports
@api_bp.route('/v1/reports', methods=['GET'])
def get_reports():
    reports = get_all_reports()
    return jsonify({'reports': reports})


# Risk assessment endpoint
@api_bp.route('/v1/risk-assessment', methods=['POST'])
def risk_assessment():
    data = request.get_json()
    location = data.get('location', 'Unknown')
    # Simulate risk score
    risk_result = assess_risk(location)
    # Add explanation
    explanation = (f"Risk for {location}: {risk_result['risk_level'].capitalize()} risk due to "
                   "proximity to river, outdated drainage infrastructure, and recent heavy rainfall.")
    return jsonify({
        'location': location,
        'risk_level': risk_result['risk_level'],
        'explanation': explanation
    })


# Simulated vehicle location endpoint
@api_bp.route('/v1/vehicles', methods=['GET'])
def vehicles():
    # Simulate 3 vehicles with random locations
    vehicles = [
        {'id': 1, 'type': 'Ambulance', 'lat': 28.61 + random.uniform(-0.05, 0.05), 'lon': 77.21 + random.uniform(-0.05, 0.05)},
        {'id': 2, 'type': 'Fire Truck', 'lat': 28.62 + random.uniform(-0.05, 0.05), 'lon': 77.22 + random.uniform(-0.05, 0.05)},
        {'id': 3, 'type': 'Rescue Van', 'lat': 28.63 + random.uniform(-0.05, 0.05), 'lon': 77.23 + random.uniform(-0.05, 0.05)},
    ]
    return jsonify({'vehicles': vehicles})
