// src/pages/payrolls/PayrollEdit.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getPayrollById, updatePayroll } from "../../api/payrollApi";
import { getAllTrainers } from "../../api/trainerApi";
import { getAllUsers } from "../../api/userApi";

export default function PayrollEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const [data, ts, us] = await Promise.all([
        getPayrollById(id),
        getAllTrainers(),
        getAllUsers()
      ]);

      setForm(data);
      setTrainers(ts || []);
      setUsers(us || []);
    } catch (e) {
      Swal.fire("Error", "Failed to load payroll!", "error");
    } finally {
      setLoading(false);
    }
  };

  const change = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  // Resolve trainer safely
  const trainer = useMemo(() => {
    if (!form) return null;

    const t = trainers.find((x) => x.trainerId === form.trainerId);
    if (!t) {
      return {
        fullName: "Trainer not found",
        rate: 0,
      };
    }

    const u = users.find((x) => x.userId === t.userId);

    return {
      fullName: u ? `${u.firstName} ${u.lastName}` : "Unknown Trainer",
      rate: t.hourlyRate ?? 0,
    };
  }, [trainers, users, form?.trainerId]);

  // Auto calculate totalPay ONLY when hours change
  useEffect(() => {
    if (!form) return;

    const hours = Number(form.totalHours) || 0;
    const rate = trainer?.rate || 0;

    const newSalary = (hours * rate).toFixed(2);

    // Avoid infinite loop → only update if value changed
    if (form.totalPay !== newSalary) {
      setForm((prev) => ({ ...prev, totalPay: newSalary }));
    }
  }, [form?.totalHours, trainer?.rate]);

  // Saving
  const save = async () => {
    try {
      await updatePayroll(id, form);
      Swal.fire("Success!", "Payroll updated!", "success");

      nav("/payrolls");
    } catch (e) {
      Swal.fire("Error", "Update failed!", "error");
    }
  };

  if (loading || !form) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold mb-6 text-center dark:text-white">
          Edit Payroll
        </h2>

        {/* Trainer Info */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Trainer</p>
              <p className="text-lg font-semibold dark:text-white">
                {trainer.fullName}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-300">Rate/hr</p>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-300">
                ${trainer.rate}
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          <div>
            <label className="text-gray-700 dark:text-gray-300">Month</label>
            <input
              type="month"
              value={form.monthYear}
              onChange={(e) => change("monthYear", e.target.value)}
              className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-300">Total Hours</label>
            <input
              type="number"
              value={form.totalHours}
              onChange={(e) => change("totalHours", e.target.value)}
              className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-300">Total Salary ($)</label>
            <input
              readOnly
              value={form.totalPay}
              className="w-full p-3 rounded-xl border bg-gray-200 dark:bg-gray-700 font-bold"
            />
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={form.paidStatus}
              onChange={(e) => change("paidStatus", e.target.value)}
              className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={save}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              Save Changes
            </button>

            <button
              onClick={() => nav("/payrolls")}
              className="px-6 py-3 bg-gray-300 dark:bg-gray-700 rounded-xl"
            >
              Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
