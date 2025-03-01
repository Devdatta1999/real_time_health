import { useEffect, useState, useRef } from "react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center p-10">
      <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
        Real-Time Health Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {Object.keys(userMetrics).map((userId) => (
          <div key={userId} className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/20 transition hover:scale-105">
            <h2 className="text-2xl font-bold text-teal-300 mb-4 text-center">User {userId}</h2>

            <div className="space-y-4 text-lg">
              <p className="flex items-center space-x-2">
                <span className="text-red-400 text-xl">💓</span>
                <span className="text-gray-300 font-semibold">Heart Rate:</span>
                <span className="text-teal-200">{userMetrics[userId]?.heart_rate} BPM</span>
              </p>

              <p className="flex items-center space-x-2">
                <span className="text-yellow-400 text-xl">🚶</span>
                <span className="text-gray-300 font-semibold">Steps:</span>
                <span className="text-blue-300">{userMetrics[userId]?.steps}</span>
              </p>

              <p className="flex items-center space-x-2">
                <span className="text-orange-400 text-xl">🔥</span>
                <span className="text-gray-300 font-semibold">Calories:</span>
                <span className="text-orange-300">{userMetrics[userId]?.calories} kcal</span>
              </p>
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
