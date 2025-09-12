import os
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('POSTGRES_URI')
    MONGO_URI = os.getenv('MONGO_URI')
