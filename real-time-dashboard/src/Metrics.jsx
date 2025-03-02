import { useState } from "react";
import "./styles.css"; // Using the same CSS file

export default function Metrics() {
  const [formData, setFormData] = useState({ userId: "", start: "", end: "" });
  const [queryMetrics, setQueryMetrics] = useState(null);

  // Fetch metrics from API
  const fetchMetrics = async () => {
    const { userId, start, end } = formData;
    if (!userId || !start || !end) {
      alert("Please enter all fields!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/metrics?user_id=${userId}&start=${start}&end=${end}`
      );
      const data = await response.json();
      setQueryMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  return (
    <div className="metrics-container">
      <h2 className="metrics-title">Fetch Health Metrics</h2>

      {/* 🌟 Query Form */}
      <div className="query-form">
        <input
          type="number"
          placeholder="User ID"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="Start Date"
          value={formData.start}
          onChange={(e) => setFormData({ ...formData, start: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="End Date"
          value={formData.end}
          onChange={(e) => setFormData({ ...formData, end: e.target.value })}
        />
        <button onClick={fetchMetrics}>Fetch Metrics</button>
      </div>

      {/* 📊 Display Fetched Metrics */}
      {queryMetrics && (
        <div className="query-result">
          <h3>Metrics for User {formData.userId}</h3>
          <p><strong>💓 Avg Heart Rate:</strong> {queryMetrics.average_heart_rate || "N/A"} BPM</p>
          <p><strong>🚶 Total Steps:</strong> {queryMetrics.total_steps || "N/A"}</p>
          <p><strong>🔥 Total Calories:</strong> {queryMetrics.total_calories || "N/A"} kcal</p>
        </div>
      )}
    </div>
  );
}