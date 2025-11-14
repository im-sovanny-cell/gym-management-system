// src/pages/memberships/Memberships.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  SortAsc,
  SortDesc,
  User,
  CalendarDays,
  Activity,
  Edit,
} from "lucide-react";

import { getAllMemberships } from "../../api/membershipApi";
import { getAllUsers } from "../../api/userApi";
import { getAllGyms } from "../../api/gymApi";

// Format dates
const formatDate = (str) => {
  if (!str) return "—";
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export default function Memberships() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("membershipId");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const [ms, us, gs] = await Promise.all([
        getAllMemberships(),
        getAllUsers(),
        getAllGyms(),
      ]);

      const userMap = new Map(us.map((u) => [u.userId, u]));
      const gymMap = new Map(gs.map((g) => [g.gymId, g.name]));

      const result = ms.map((m) => ({
        membershipId: m.membershipId,
        planType: m.planType,
        startDate: m.startDate,
        endDate: m.endDate,
        status: m.status,
        memberName: userMap.get(m.userId)
          ? `${userMap.get(m.userId).firstName} ${userMap.get(m.userId).lastName}`
          : "—",
        trainerName: userMap.get(m.trainerId)
          ? `${userMap.get(m.trainerId).firstName} ${userMap.get(m.trainerId).lastName}`
          : "—",
        gymName: gymMap.get(m.gymId) || "—",
      }));

      setRows(result);
      setFiltered(result);
    } finally {
      setLoading(false);
    }
  };

  // Search + Sort
  useEffect(() => {
    let data = [...rows];

    if (search.trim()) {
      const k = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.memberName.toLowerCase().includes(k) ||
          r.trainerName.toLowerCase().includes(k) ||
          r.planType.toLowerCase().includes(k) ||
          r.status.toLowerCase().includes(k) ||
          r.gymName.toLowerCase().includes(k)
      );
    }

    data.sort((a, b) => {
      const aVal = (a[sortField] || "").toString().toLowerCase();
      const bVal = (b[sortField] || "").toString().toLowerCase();
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFiltered(data);
  }, [search, sortField, sortOrder, rows]);

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Activity className="text-blue-600 dark:text-blue-400" />
          Membership Management
        </h2>

        <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search membership..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 
                         rounded-lg text-sm w-64 bg-white dark:bg-gray-800
                         text-gray-800 dark:text-gray-100 focus:ring-2 
                         focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Sort Field */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg 
                       px-3 py-2 text-sm bg-white dark:bg-gray-800
                       text-gray-800 dark:text-gray-100"
          >
            <option value="membershipId">Sort by ID</option>
            <option value="memberName">Member</option>
            <option value="trainerName">Trainer</option>
            <option value="planType">Plan</option>
            <option value="status">Status</option>
            <option value="gymName">Gym</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="border border-gray-300 dark:border-gray-700 
                       rounded-lg px-3 py-2 text-sm flex items-center gap-2 
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            {sortOrder === "asc" ? (
              <>
                <SortAsc size={16} /> Asc
              </>
            ) : (
              <>
                <SortDesc size={16} /> Desc
              </>
            )}
          </button>

          {/* Add Membership */}
          <button
            onClick={() => nav("/memberships/create")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 
                       text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
          >
            + Add Membership
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">

        {/* HEADER ROW */}
        <div className="grid grid-cols-[6%_17%_17%_10%_12%_12%_10%_10%]
                        border-b bg-gray-100 dark:bg-gray-700 
                        text-blue-800 dark:text-blue-300 uppercase text-xs font-semibold">
          <div className="px-4 py-3">ID</div>
          <div className="px-4 py-3">MEMBER</div>
          <div className="px-4 py-3">TRAINER</div>
          <div className="px-4 py-3">PLAN</div>
          <div className="px-4 py-3">START</div>
          <div className="px-4 py-3">END</div>
          <div className="px-4 py-3 text-center">STATUS</div>
          <div className="px-4 py-3 text-center">ACTIONS</div>
        </div>

        {/* LOADING — PREMIUM STYLE */}
        {loading && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
            Loading memberships...
          </div>
        )}

        {/* DATA ROWS */}
        {!loading &&
          (filtered.length > 0 ? (
            filtered.map((m, i) => (
              <div
                key={m.membershipId}
                className={`grid grid-cols-[6%_17%_17%_10%_12%_12%_10%_10%]
                            items-center border-b text-sm ${
                              i % 2 === 0
                                ? "bg-white dark:bg-gray-800"
                                : "bg-gray-50 dark:bg-gray-900/40"
                            } hover:bg-gray-50 dark:hover:bg-gray-700 transition`}
              >
                {/* ID */}
                <div className="px-4 py-3">{m.membershipId}</div>

                {/* MEMBER */}
                <div className="px-4 py-3 flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  <User size={14} className="text-gray-500" />
                  {m.memberName}
                </div>

                {/* TRAINER */}
                <div className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis">
                  {m.trainerName}
                </div>

                {/* PLAN */}
                <div className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis">
                  {m.planType}
                </div>

                {/* START */}
                <div className="px-4 py-3 flex items-center gap-2 whitespace-nowrap">
                  <CalendarDays size={14} className="text-gray-500" />
                  {formatDate(m.startDate)}
                </div>

                {/* END */}
                <div className="px-4 py-3 whitespace-nowrap">
                  {formatDate(m.endDate)}
                </div>

                {/* STATUS */}
                <div className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      m.status === "active"
                        ? "bg-green-100 text-green-700"
                        : m.status === "expired"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="px-4 py-3 flex justify-center">
                  <button
                    onClick={() => nav(`/memberships/${m.membershipId}`)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium 
                          text-yellow-700 bg-yellow-100 hover:bg-yellow-200 
                          rounded-full transition"
                  >
                    <Edit size={14} /> Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
              No memberships found.
            </div>
          ))}
      </div>
    </div>
  );
}
