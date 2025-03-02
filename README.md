# Real-Time Health Data Ingestion & Analytics

Building a mini real-time ingestion and analytics service for wearable 
health data. The service should: 
1. Receive simulated health metrics (e.g., heart rate, steps, calories) in real time. 
2. Process and store these metrics in PostgreSQL. 
3. Expose an API endpoint to retrieve aggregated statistics (e.g., total steps, average 
heart rate) over a given time range.

## Solution
This project is a real-time health metrics ingestion and analytics system that:

1. Accepts live health metrics (heart rate, steps, and calories).
2. Stores these metrics in PostgreSQL via (celery + redis) for real-time ingestion handled in an asynchronous mechanism.
3. Exposes REST API endpoints to retrieve aggregated statistics over a given time range.
4. Provides a web-based dashboard to visualize real-time and aggregated data.
5. Uses WebSockets for real-time updates.
6. Supports testing via API queries and a simulated data ingestion script.

## ⚙️ Technology Stack & Approach
I have selected the technology stack based on the problem's requirements and alternative options mentioned in the original assignment:

![image](https://github.com/user-attachments/assets/a3a5c134-7831-4bc0-abde-9280815c220b)

## 📂 Project Structure
![image](https://github.com/user-attachments/assets/2dc1bd2e-ab7f-4670-b7c7-5cfa4ced4be8)

### Database schema :
Database : health_db <br />
Table : health_metrics <br />
The code will take care of creating the table.
#### Explanation of the Schema:
1. id SERIAL PRIMARY KEY → Auto-incrementing unique identifier for each record.
2. user_id INT NOT NULL → Stores the ID of the user associated with the health data.
3. timestamp TIMESTAMPTZ NOT NULL → Stores the timestamp of when the data was recorded (using TIMESTAMPTZ to support time zones).
4. heart_rate FLOAT NOT NULL → Stores the user’s heart rate in beats per minute (BPM).
5. steps INT NOT NULL → Stores the step count for that specific timestamp.
6. calories FLOAT NOT NULL → Stores the calories burned at that specific timestamp.




## Two testing Methods : 
### (1) Using API Endpoints: Query the FastAPI backend directly via localhost:8000.

#### Steps : 
  1. Pull this github repository.
     
  2. Run this command in the project directory :  <br />
     docker-compose up --build <br />
     (This would start the containers)
     
  3. Run this command in the project directory : <br />
      python simulate_data.py <br />
     This would run the python script which imitates real time health data ingestion continuously.Basically it is 
     hitting http://localhost:8000/ingest/ (POST) for the user_id 101 and 202 after every 8 seconds
     
  4. Test the API endpoint for aggregated data retrieval: <br />
     Example : http://localhost:8000/metrics?user_id=101&start=2025-03-02T18:00:00Z&end=2025-03-02T19:00:00Z
     
#### Result : 
![endpoint test](https://github.com/user-attachments/assets/3d8ec908-5675-4013-b33b-5e7812ef0d28)


### (2)  Real-Time Health Dashboard 

#### Steps :
  1. Pull this github repository.
     
  2. Run this command in the project directory :  <br />
     docker-compose up --build <br />
     (This would start the containers)
     
  3. Run this command in the project directory : <br />
      python simulate_data.py <br />
     This would run the python script which imitates real time health data ingestion continuously.Basically it is 
     hitting http://localhost:8000/ingest/ (POST) for the user_id 101 and 202 after every 8 seconds

  4. Hit http://localhost:3000/ <br />
     The real time heath metrics ingestion can be verified using the dashboard tiles for users 101 and 202.(Real Time Health Dashboard) <br />
     Also we can get the aggregated data for a user within a given time range using the UI (Fetch Health Metrics)

  #### Result : 
  ![preffect app test](https://github.com/user-attachments/assets/84441adf-98ac-40b4-b5de-960782caa484)

  ### 🏁 Conclusion : 
This project successfully demonstrates a real-time health data ingestion and analytics pipeline, integrating FastAPI, PostgreSQL, Celery, Redis, WebSockets, and React to efficiently process and visualize health metrics from wearable devices. <br />

By leveraging asynchronous processing, real-time streaming, and efficient data aggregation, the system allows users to:

1. Continuously ingest health data and store it in a structured manner.
2. Query aggregated statistics over a specified time range via a REST API.
3. Monitor real-time health insights on an interactive React-based dashboard.
4. Simulate live data ingestion and observe real-time updates.
5. This project not only meets the core requirements of scalable data ingestion and analytics but also provides an 
   extensible architecture that can be expanded with advanced analytics, predictive insights, and large-scale 
   processing using tools like Kafka or machine learning models in the future. <br />

Through this implementation, we showcase how modern web technologies can be combined to create efficient, scalable, and real-time data-driven applications, setting a strong foundation for future enhancements in health-tech solutions

    
