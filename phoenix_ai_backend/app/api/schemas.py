# Example Pydantic-like schema using marshmallow
from marshmallow import Schema, fields

class RiskAssessmentSchema(Schema):
    region = fields.Str(required=True)
    risk_level = fields.Str(required=True)
