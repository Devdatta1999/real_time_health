from fastapi import FastAPI, Depends, Query
from celery.result import AsyncResult
from app.database import init_db, get_db
from app.models import HealthMetric
from app.schemas import MetricRequest, MetricResponse
from app.worker import process_health_data
from sqlalchemy.orm import Session

app = FastAPI()

@app.on_event("startup")
async def startup():
    init_db()

@app.post("/ingest/")
async def ingest_metric(metric: MetricRequest):
    task = process_health_data.delay(metric.dict())
    return {"task_id": task.id}

@app.get("/task/{task_id}")
def get_task_status(task_id: str):
    result = AsyncResult(task_id)
    return {"status": result.status, "result": result.result}

@app.get("/metrics")
def get_metrics(
    user_id: int,
    start: str,
    end: str,
    db: Session = Depends(get_db)
):
    results = (
        db.query(HealthMetric)
        .filter(HealthMetric.user_id == user_id)
        .filter(HealthMetric.timestamp >= start)
        .filter(HealthMetric.timestamp <= end)
        .all()
    )
    if not results:
        return {"message": "No data found"}
    
    avg_hr = sum([r.heart_rate for r in results]) / len(results)
    total_steps = sum([r.steps for r in results])
    total_calories = sum([r.calories for r in results])
    
    return MetricResponse(
        average_heart_rate=avg_hr,
        total_steps=total_steps,
        total_calories=total_calories
    )
