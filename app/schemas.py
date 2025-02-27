from pydantic import BaseModel
from datetime import datetime

class MetricRequest(BaseModel):
    user_id: int
    timestamp: datetime
    heart_rate: int
    steps: int
    calories: float

class MetricResponse(BaseModel):
    average_heart_rate: float
    total_steps: int
    total_calories: float