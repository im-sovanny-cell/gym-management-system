// src/pages/dashboard/DashboardHome.jsx
import { useEffect, useState } from "react";
import {
  fetchCounts,
  fetchTodayTotal,
  fetchAllPaymentsTotal,
  fetchRecentPayments,
  fetchUpcomingClasses,
} from "../../api/dashboardApi";

export default function DashboardHome() {
  const [counts, setCounts] = useState({
    users: 0,
    gyms: 0,
    trainers: 0,
    todayPayments: 0,
    allPayments: 0,
  });
  const [payments, setPayments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [c, today, allTotal, pay, cls] = await Promise.all([
        fetchCounts(),
        fetchTodayTotal(),
        fetchAllPaymentsTotal(),
        fetchRecentPayments(6),
        fetchUpcomingClasses(6),
      ]);
      setCounts({
        users: c.users || 0,
        gyms: c.gyms || 0,
        trainers: c.trainers || 0,
        todayPayments: today || 0,
        allPayments: allTotal || 0,
      });
      setPayments(pay || []);
      setClasses(cls || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Users", value: counts.users, color: "blue" },
          { label: "Total Gyms", value: counts.gyms, color: "green" },
          { label: "Trainers", value: counts.trainers, color: "purple" },
          { label: "Today Payments", value: `$${counts.todayPayments}`, color: "yellow" },
          { label: "All Payments", value: `$${counts.allPayments.toLocaleString()}`, color: "indigo" },
        ].map((card, i) => (
          <div
            key={i}
            className="border p-5 rounded-xl bg-white shadow-sm hover:shadow transition-shadow"
          >
            <div className="text-sm text-gray-500">{card.label}</div>
            <div className={`text-3xl font-bold text-${card.color}-600`}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-3 text-lg">Recent Payments</h2>
          {payments.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="p-2">User</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Method</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.paymentId} className="border-b hover:bg-gray-50">
                    <td className="p-2">{p.userName || "-"}</td>
                    <td className="p-2 font-medium">${p.amount}</td>
                    <td className="p-2">{p.method}</td>
                    <td className="p-2">{p.paymentDate}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          p.status === "paid"
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-400 py-6">No recent payments</p>
          )}
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-3 text-lg">Upcoming Classes</h2>
          {classes.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="p-2">Class</th>
                  <th className="p-2">Trainer</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.classId} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{c.className}</td>
                    <td className="p-2">{c.trainerName}</td>
                    <td className="p-2">{c.classDate}</td>
                    <td className="p-2">{c.startTime}</td>
                    <td className="p-2">{c.capacity} spots</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-400 py-6">No upcoming classes</p>
          )}
        </div>
      </div>
    </div>
  );
}