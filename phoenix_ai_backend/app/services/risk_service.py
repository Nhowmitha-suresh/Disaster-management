def assess_risk(region):
    # Simple rule-based risk assessment for demo
    region = region.lower()
    if 'river' in region or 'downtown' in region:
        risk = 'high'
    elif 'suburb' in region:
        risk = 'low'
    else:
        risk = 'medium'
    return {'region': region, 'risk_level': risk}
