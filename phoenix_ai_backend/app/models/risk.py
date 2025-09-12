from sqlalchemy import Column, Integer, String
from geoalchemy2 import Geometry
from app import db

class Risk(db.Model):
    id = Column(Integer, primary_key=True)
    region = Column(String(128), nullable=False)
    risk_level = Column(String(32), nullable=False)
    geom = Column(Geometry('POLYGON'))
