import { useEffect, useState, useRef } from "react";
import "./styles.css";
export default function Dashboard() {
  const [userMetrics, setUserMetrics] = useState({});
  const socketsRef = useRef({});
  const userIds = [101, 202];

  useEffect(() => {
    const createWebSocket = (userId) => {
      if (socketsRef.current[userId]) return;

      const socket = new WebSocket(`ws://localhost:8000/ws/${userId}`);
      socketsRef.current[userId] = socket;

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.message !== "heartbeat") {
            setUserMetrics((prev) => ({
              ...prev,
              [userId]: {
                heart_rate: data.average_heart_rate?.toFixed(1) || 0,
                steps: data.total_steps || 0,
                calories: data.total_calories?.toFixed(2) || 0,
                timestamp: new Date().toLocaleTimeString(),
              },
            }));
          }
        } catch (error) {
          console.error(`Error parsing WebSocket message for user ${userId}:`, error);
        }
      };

      socket.onclose = (event) => {
        delete socketsRef.current[userId];
        if (event.code === 1006) setTimeout(() => createWebSocket(userId), 5000);
      };
    };

    userIds.forEach(createWebSocket);

    return () => {
      Object.values(socketsRef.current).forEach((socket) => socket.close());
      socketsRef.current = {};
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Real-Time Health Dashboard</h1>
      <div className="dashboard-grid">
        {Object.keys(userMetrics).map((userId) => (
          <div key={userId} className="dashboard-card">
            <h2 className="card-title">User {userId}</h2>
            <div className="data-item">
              <span>💓 Heart Rate:</span>
              <span>{userMetrics[userId]?.heart_rate} BPM</span>
            </div>
            <div className="data-item">
              <span>🚶 Steps:</span>
              <span>{userMetrics[userId]?.steps}</span>
            </div>
            <div className="data-item">
              <span>🔥 Calories:</span>
              <span>{userMetrics[userId]?.calories} kcal</span>
            </div>
            <p className="text-sm text-gray-400 mt-6 text-center">
              Last Update: {userMetrics[userId]?.timestamp || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}