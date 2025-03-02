import json
import asyncio
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from celery.result import AsyncResult
from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db, get_db
from app.models import HealthMetric
from app.schemas import MetricRequest, MetricResponse
from app.worker import process_health_data
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
active_connections = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],  
    allow_headers=["*"],  
)

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
def get_metrics(user_id: int, start: str, end: str, db: Session = Depends(get_db)):
    results = (
        db.query(HealthMetric)
        .filter(HealthMetric.user_id == user_id)
        .filter(HealthMetric.timestamp.between(start, end))
        .all()
    )

    if not results:
        return {"message": "No data found"}

    avg_hr = sum(r.heart_rate for r in results) / len(results)
    total_steps = sum(r.steps for r in results)
    total_calories = sum(r.calories for r in results)

    return MetricResponse(
        average_heart_rate=avg_hr,
        total_steps=total_steps,
        total_calories=total_calories
    )

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await websocket.accept()
    active_connections[user_id] = websocket
    print(f"User {user_id} connected.")

    try:
        while True:
            db = SessionLocal()
            results = db.query(HealthMetric).filter(HealthMetric.user_id == user_id).all()
            db.close()

            avg_hr = sum(r.heart_rate for r in results) / len(results) if results else 0
            total_steps = sum(r.steps for r in results) if results else 0
            total_calories = sum(r.calories for r in results) if results else 0

            data = {
                "average_heart_rate": avg_hr,
                "total_steps": total_steps,
                "total_calories": total_calories,
            }

            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(5)

    except WebSocketDisconnect:
        print(f"User {user_id} disconnected.")
    finally:
        active_connections.pop(user_id, None)
        print(f"WebSocket handler for user {user_id} closed.")
