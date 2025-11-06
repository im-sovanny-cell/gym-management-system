// src/pages/memberships/MembershipEdit.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getMembershipById, updateMembership, deleteMembership } from "../../api/membershipApi";
import { getAllUsers } from "../../api/userApi";
import { getAllGyms } from "../../api/gymApi";

const PLAN_VALUES = ["daily", "monthly", "3-month", "yearly"];

export default function MembershipEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [users, setUsers] = useState([]);
  const [gyms, setGyms] = useState([]);

  const [userId, setUserId] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [gymId, setGymId] = useState("");

  const [planType, setPlanType] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");

  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    try {
      setLoading(true);
      const [m, u, g] = await Promise.all([
        getMembershipById(id),
        getAllUsers(),
        getAllGyms(),
      ]);

      setUsers(Array.isArray(u) ? u : []);
      setGyms(Array.isArray(g) ? g : []);

      setUserId(m.userId ?? "");
      setTrainerId(m.trainerId ?? "");
      setGymId(m.gymId ?? "");
      setPlanType(m.planType ?? "monthly");
      setStartDate(m.startDate ?? "");
      setEndDate(m.endDate ?? "");
      setStatus(m.status ?? "active");
    } finally {
      setLoading(false);
    }
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

    await updateMembership(id, {
      userId: Number(userId),
      trainerId: trainerId === "" ? null : Number(trainerId),
      gymId: gymId === "" ? null : Number(gymId),
      planType,
      startDate,
      endDate,
      status,
    });

    Swal.fire("Saved", "Membership updated", "success");
    nav("/memberships");
  };

  const remove = async () => {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "Delete this membership?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!isConfirmed) return;
    await deleteMembership(id);
    Swal.fire("Deleted!", "", "success");
    nav("/memberships");
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-bold mb-6">Edit Membership #{id}</h2>

      {/* Member */}
      <label className="block text-sm text-gray-600 mb-1">Member *</label>
      <select
        className="border p-3 rounded w-full mb-4"
        value={userId === null ? "" : userId}
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
        value={trainerId === null ? "" : trainerId}
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
        value={gymId === null ? "" : gymId}
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
        onChange={(e) => { const v = e.target.value; setPlanType(v); if (startDate) recalcEnd(startDate, v); }}
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
            value={startDate || ""}
            onChange={(e) => { const v = e.target.value; setStartDate(v); recalcEnd(v, planType); }}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            className="border p-3 rounded w-full bg-gray-100"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
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
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={remove}>
          Delete
        </button>
      </div>
    </div>
  );
}
