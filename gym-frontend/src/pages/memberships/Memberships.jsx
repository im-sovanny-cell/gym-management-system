// src/pages/memberships/Memberships.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getAllMemberships, deleteMembership } from "../../api/membershipApi";
import { getAllUsers } from "../../api/userApi";
import { getAllGyms } from "../../api/gymApi";

export default function Memberships() {
  const nav = useNavigate();

  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [ms, u, g] = await Promise.all([
        getAllMemberships(),
        getAllUsers(),
        getAllGyms(),
      ]);
      setItems(Array.isArray(ms) ? ms : []);
      setUsers(Array.isArray(u) ? u : []);
      setGyms(Array.isArray(g) ? g : []);
    } finally {
      setLoading(false);
    }
  };

  const userById = (id) => users.find((x) => x.userId === id);
  const gymById = (id) => gyms.find((x) => x.gymId === id);

  const getMemberLabel = (id) => {
    const u = userById(id);
    if (!u) return `#${id ?? "-"}`;
    return `#${u.userId} — ${u.firstName} ${u.lastName}`;
  };

  const getTrainerLabel = (id) => {
    if (!id) return "—";
    const u = userById(id);
    return u ? `${u.firstName} ${u.lastName}` : "—";
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "Delete this membership?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!isConfirmed) return;
    await deleteMembership(id);
    await load();
    Swal.fire("Deleted!", "", "success");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Memberships</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => nav("/memberships/create")}
        >
          + Create Membership
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-700 border-b">
              <tr>
                <th className="p-3">Member</th>
                <th className="p-3">Trainer</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                <th className="p-3">Status</th>
                <th className="p-3">Gym</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={8}>
                    No memberships found.
                  </td>
                </tr>
              ) : (
                items.map((m) => (
                  <tr key={m.membershipId} className="border-b hover:bg-gray-50">
                    <td className="p-3">{getMemberLabel(m.userId)}</td>
                    <td className="p-3">{getTrainerLabel(m.trainerId)}</td>
                    <td className="p-3">{m.planType}</td>
                    <td className="p-3">{m.startDate}</td>
                    <td className="p-3">{m.endDate}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        m.status === "active"
                          ? "bg-green-100 text-green-700"
                          : m.status === "expired"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3">{gymById(m.gymId)?.name || "—"}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                        onClick={() => nav(`/memberships/${m.membershipId}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                        onClick={() => handleDelete(m.membershipId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
