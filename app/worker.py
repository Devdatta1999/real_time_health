from celery import Celery
import redis
from app.database import SessionLocal
from app.models import HealthMetric

celery = Celery("tasks", broker="redis://redis:6379/0")
redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)

@celery.task
def process_health_data(metric_data):
    db = SessionLocal()

    if "timestamp" in metric_data and isinstance(metric_data["timestamp"], str) == False:
        metric_data["timestamp"] = metric_data["timestamp"].isoformat()

    metric = HealthMetric(**metric_data)
    db.add(metric)
    db.commit()
    db.close()
    redis_client.xadd("health_metrics", metric_data, '*')
    return "Metric ingested"