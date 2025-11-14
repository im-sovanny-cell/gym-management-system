// src/pages/payrolls/PayrollCreate.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { createPayroll, getAutoHours } from "../../api/payrollApi";
import { getAllTrainers } from "../../api/trainerApi";
import { getAllUsers } from "../../api/userApi";
import { API } from "../../api/http";

export default function PayrollCreate() {
  const nav = useNavigate();

  const [trainers, setTrainers] = useState([]);
  const [users, setUsers] = useState([]);

  const [trainerId, setTrainerId] = useState("");

  // Default to current month YYYY-MM
  const [monthYear, setMonthYear] = useState(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${mm}`;
  });

  const [totalHours, setTotalHours] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [totalSalary, setTotalSalary] = useState("0.00");
  const [paidStatus, setPaidStatus] = useState("unpaid");

  const [loading, setLoading] = useState(true);
  const [loadingHours, setLoadingHours] = useState(false);
  const [saving, setSaving] = useState(false);

  // =========================================
  // Load all trainers + users
  // =========================================
  useEffect(() => {
    (async () => {
      try {
        const [ts, us] = await Promise.all([getAllTrainers(), getAllUsers()]);
        setTrainers(ts || []);
        setUsers(us || []);
      } catch (err) {
        Swal.fire("Error", "Failed to load trainers", "error");
      }
      setLoading(false);
    })();
  }, []);

  // =========================================
  // Merge trainer + user info (full name + rate)
  // =========================================
  const trainerList = useMemo(() => {
    const map = new Map(users.map((u) => [u.userId, u]));

    return trainers.map((t) => {
      const u = map.get(t.userId);
      return {
        ...t,
        fullName: u ? `${u.firstName} ${u.lastName}` : "Unknown",
        rate: t.hourlyRate ?? 0,
      };
    });
  }, [trainers, users]);

  const selectedTrainer = trainerList.find(
    (t) => t.trainerId === Number(trainerId)
  );

  // =========================================
  // Auto-update hourly rate
  // =========================================
  useEffect(() => {
    if (selectedTrainer) {
      setHourlyRate(selectedTrainer.rate || 0);
    } else {
      setHourlyRate(0);
    }
  }, [selectedTrainer]);

  // =========================================
  // Auto-load hours from backend
  // =========================================
  useEffect(() => {
    const loadHours = async () => {
      if (!trainerId || !monthYear) return;

      setLoadingHours(true);

      try {
        const res = await getAutoHours(trainerId, monthYear);
        setTotalHours(res?.totalHours ?? 0);
      } catch (err) {
        setTotalHours(0);
      }

      setLoadingHours(false);
    };

    loadHours();
  }, [trainerId, monthYear]);

  // =========================================
  // Auto calculate salary
  // =========================================
  useEffect(() => {
    const salary = Number(hourlyRate) * Number(totalHours);
    setTotalSalary(salary.toFixed(2));
  }, [hourlyRate, totalHours]);

  // =========================================
  // Save payroll
  // =========================================
  const save = async () => {
    if (!trainerId) return Swal.fire("Error", "Select trainer", "error");
    if (!monthYear) return Swal.fire("Error", "Select month", "error");

    setSaving(true);

    try {
      await createPayroll({
        trainerId: Number(trainerId),
        monthYear,
        totalHours: Number(totalHours),
        hourlyRate: Number(hourlyRate),
        totalSalary: Number(totalSalary),
        paidStatus,
      });

      Swal.fire("Success", "Payroll created!", "success");
      nav("/payrolls");
    } catch (err) {
      Swal.fire("Error", err.message || "Create failed", "error");
    }

    setSaving(false);
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-300">
        Loading…
      </div>
    );

  const num = (v) => Number(v).toLocaleString(undefined, { minimumFractionDigits: 0 });

  // =========================================
  // UI
  // =========================================
  return (
    <div className="p-6 min-h-screen flex justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Create Payroll
        </h2>

        {/* Trainer */}
        <div className="mb-6">
          <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
            Trainer *
          </label>

          <select
            value={trainerId}
            onChange={(e) => setTrainerId(e.target.value)}
            className="w-full p-3 rounded-xl border bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">Select trainer</option>
            {trainerList.map((t) => (
              <option key={t.trainerId} value={t.trainerId}>
                #{t.trainerId} — {t.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Trainer Info Card */}
        {selectedTrainer && (
          <div className="mb-6 p-4 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <div className="text-gray-500 dark:text-gray-400 text-sm">Trainer</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {selectedTrainer.fullName}
            </div>

            <div className="mt-3">
              <div className="text-gray-500 dark:text-gray-400 text-sm">Rate / hr</div>
              <div className="font-bold text-lg text-gray-900 dark:text-white">
                ${num(selectedTrainer.rate)}
              </div>
            </div>
          </div>
        )}

        {/* Month */}
        <div className="mb-6">
          <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
            Month & Year *
          </label>

          <input
            type="month"
            value={monthYear}
            onChange={(e) => setMonthYear(e.target.value)}
            className="w-full p-3 rounded-xl border bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
          />
        </div>

        {/* Hours */}
        <div className="mb-6">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            Total Hours — Auto
          </label>

          <input
            readOnly
            value={loadingHours ? "Loading…" : totalHours}
            className="w-full p-3 rounded-xl border bg-gray-200 dark:bg-gray-700 dark:text-gray-100 cursor-not-allowed font-semibold"
          />
        </div>

        {/* Rate */}
        <div className="mb-6">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            Rate per Hour ($)
          </label>

          <input
            readOnly
            value={hourlyRate}
            className="w-full p-3 rounded-xl border bg-gray-200 dark:bg-gray-700 dark:text-gray-100 cursor-not-allowed font-semibold"
          />
        </div>

        {/* Total Salary */}
        <div className="mb-8">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            Total Salary ($)
          </label>

          <input
            readOnly
            value={totalSalary}
            className="w-full p-3 rounded-xl border bg-gray-200 dark:bg-gray-700 dark:text-gray-100 cursor-not-allowed font-bold"
          />
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            Payment Status
          </label>

          <select
            value={paidStatus}
            onChange={(e) => setPaidStatus(e.target.value)}
            className="w-full p-3 rounded-xl border bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className={`px-6 py-3 rounded-xl text-white transition ${
              saving ? "bg-green-400 cursor-wait" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving ? "Saving…" : "Save Payroll"}
          </button>

          <button
            onClick={() => nav("/payrolls")}
            className="px-6 py-3 rounded-xl bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
