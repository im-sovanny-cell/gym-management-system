// src/pages/dashboard/DashboardHome.jsx
import { useEffect, useState } from "react";
import {
  fetchCounts,
  fetchTodayTotal,
  fetchAllPaymentsTotal,
  fetchRecentPayments,
  fetchUpcomingClasses,
} from "../../api/dashboardApi";

import {
  Users,
  Building2,
  Dumbbell,
  DollarSign,
  Wallet,
  CalendarDays,
  Clock,
} from "lucide-react";

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

  // Loading Skeleton
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Icon Map
  const iconMap = {
    users: <Users size={26} />,
    gyms: <Building2 size={26} />,
    trainers: <Dumbbell size={26} />,
    todayPayments: <Wallet size={26} />,
    allPayments: <DollarSign size={26} />,
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 space-y-8">

      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {[
          { label: "Total Users", key: "users", color: "blue" },
          { label: "Total Gyms", key: "gyms", color: "green" },
          { label: "Trainers", key: "trainers", color: "purple" },
          { label: "Today Payments", key: "todayPayments", color: "yellow" },
          { label: "All Payments", key: "allPayments", color: "indigo" },
        ].map((card) => (
          <div
            key={card.key}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer flex items-center gap-4"
          >
            <div
              className={`p-3 rounded-xl bg-${card.color}-100 dark:bg-${card.color}-900 text-${card.color}-700 dark:text-${card.color}-300`}
            >
              {iconMap[card.key]}
            </div>

            <div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">{card.label}</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {card.key === "todayPayments" || card.key === "allPayments"
                  ? `$${counts[card.key].toLocaleString()}`
                  : counts[card.key]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Payments */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Recent Payments
          </h2>

          {payments.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-700 dark:text-gray-300">
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Method</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p) => (
                  <tr key={p.paymentId} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <td className="p-2">{p.userName}</td>
                    <td className="p-2 font-medium">${p.amount}</td>
                    <td className="p-2">{p.method}</td>
                    <td className="p-2">{p.paymentDate}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
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
            <p className="py-6 text-center text-gray-500 dark:text-gray-400">
              No recent payments
            </p>
          )}
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Upcoming Classes
          </h2>

          {classes.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-700 dark:text-gray-300">
                  <th className="p-2 text-left">Class</th>
                  <th className="p-2 text-left">Trainer</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">Capacity</th>
                </tr>
              </thead>

              <tbody>
                {classes.map((c) => (
                  <tr key={c.classId} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition">
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
            <p className="py-6 text-center text-gray-500 dark:text-gray-400">
              No upcoming classes
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
