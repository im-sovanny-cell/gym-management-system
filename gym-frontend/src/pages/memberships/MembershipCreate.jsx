// src/pages/memberships/MembershipCreate.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { createMembership } from "../../api/membershipApi";
import { getAllUsers } from "../../api/userApi";
import { getAllGyms } from "../../api/gymApi";

const PLAN_VALUES = ["daily", "monthly", "3-month", "yearly"]; // must match DB

export default function MembershipCreate() {
  const nav = useNavigate();

  const [users, setUsers] = useState([]);
  const [gyms, setGyms] = useState([]);

  const [userId, setUserId] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [gymId, setGymId] = useState("");
  const [planType, setPlanType] = useState("monthly");

  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [u, g] = await Promise.all([getAllUsers(), getAllGyms()]);
    setUsers(Array.isArray(u) ? u : []);
    setGyms(Array.isArray(g) ? g : []);
    recalcEnd(startDate, planType);
  };

  const trainers = useMemo(
    () => users.filter((u) => u.roleId === 3 || u.roleName === "TRAINER"),
    [users]
  );

  const recalcEnd = (start, plan) => {
    const s = new Date(start);
    let add = 30;
    if (plan === "daily") add = 1;
    if (plan === "3-month") add = 90;
    if (plan === "yearly") add = 365;
    const e = new Date(s);
    e.setDate(e.getDate() + add);
    setEndDate(e.toISOString().split("T")[0]);
  };

  const save = async () => {
    if (!userId) return Swal.fire("Error", "Please select member", "error");
    if (!PLAN_VALUES.includes(planType)) {
      return Swal.fire("Error", "Invalid plan type", "error");
    }

    try {
      await createMembership({
        userId: Number(userId),
        trainerId: trainerId === "" ? null : Number(trainerId),
        gymId: gymId === "" ? null : Number(gymId),
        planType,
        startDate,
        endDate,
        status,
      });

      Swal.fire("Success", "Membership created", "success");
      nav("/memberships");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message || "Create failed", "error");
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-bold mb-6">Create Membership</h2>

      {/* Member */}
      <label className="block text-sm text-gray-600 mb-1">Member *</label>
      <select
        className="border p-3 rounded w-full mb-4"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      >
        <option value="">Select member</option>
        {users.map((u) => (
          <option key={u.userId} value={u.userId}>
            #{u.userId} — {u.firstName} {u.lastName}
          </option>
        ))}
      </select>

      {/* Trainer */}
      <label className="block text-sm text-gray-600 mb-1">Trainer (optional)</label>
      <select
        className="border p-3 rounded w-full mb-4"
        value={trainerId}
        onChange={(e) => setTrainerId(e.target.value)}
      >
        <option value="">No trainer</option>
        {trainers.map((t) => (
          <option key={t.userId} value={t.userId}>
            {t.firstName} {t.lastName}
          </option>
        ))}
      </select>

      {/* Gym */}
      <label className="block text-sm text-gray-600 mb-1">Gym (optional)</label>
      <select
        className="border p-3 rounded w-full mb-4"
        value={gymId}
        onChange={(e) => setGymId(e.target.value)}
      >
        <option value="">No gym</option>
        {gyms.map((g) => (
          <option key={g.gymId} value={g.gymId}>{g.name}</option>
        ))}
      </select>

      {/* Plan */}
      <label className="block text-sm text-gray-600 mb-1">Plan</label>
      <select
        className="border p-3 rounded w-full mb-4"
        value={planType}
        onChange={(e) => { const v = e.target.value; setPlanType(v); recalcEnd(startDate, v); }}
      >
        <option value="daily">daily</option>
        <option value="monthly">monthly</option>
        <option value="3-month">3-month</option>
        <option value="yearly">yearly</option>
      </select>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            className="border p-3 rounded w-full"
            value={startDate}
            onChange={(e) => { const v = e.target.value; setStartDate(v); recalcEnd(v, planType); }}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            className="border p-3 rounded w-full bg-gray-100"
            value={endDate}
            readOnly
          />
        </div>
      </div>

      {/* Status */}
      <label className="block text-sm text-gray-600 mb-1">Status</label>
      <select
        className="border p-3 rounded w-full mb-6"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="active">active</option>
        <option value="inactive">inactive</option>
        <option value="expired">expired</option>
      </select>

      <div className="flex gap-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={save}>
          Save
        </button>
        <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onClick={() => nav("/memberships")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
