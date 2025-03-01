import asyncio
import requests
import random
from datetime import datetime

API_URL = "http://localhost:8000/ingest/"
USER_IDS = [101, 202]

def generate_sample_data(user_id):
    return {
        "user_id": user_id,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "heart_rate": random.randint(60, 100),
        "steps": random.randint(100, 500),
        "calories": round(random.uniform(5.0, 20.0), 2)
    }

def send_data_to_api(data):
    try:
        response = requests.post(API_URL, json=data)
        print(f"Sent: {data} | Response: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error sending data: {e}")

async def send_data_loop():
    while True:
        for user_id in USER_IDS:
            data = generate_sample_data(user_id)
            send_data_to_api(data)
        await asyncio.sleep(8)

if __name__ == "__main__":
    asyncio.run(send_data_loop())
