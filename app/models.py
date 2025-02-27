from sqlalchemy import Column, Integer, DateTime, Float
from app.database import Base

class HealthMetric(Base):
    __tablename__ = "health_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    timestamp = Column(DateTime, index=True)
    heart_rate = Column(Integer)
    steps = Column(Integer)
    calories = Column(Float)