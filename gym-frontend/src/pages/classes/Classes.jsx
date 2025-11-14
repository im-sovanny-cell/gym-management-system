import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Users,
  CalendarDays,
  Dumbbell,
  User,
  Edit,
  Trash2,
  PlusCircle,
  SortAsc,
  SortDesc,
  Search,
} from "lucide-react";

import { getAllClasses, deleteClassApi } from "/src/api/classApi.js";
import { getAllTrainers } from "/src/api/trainerApi.js";
import { getAllGyms } from "/src/api/gymApi.js";
import { getAllUsers } from "/src/api/userApi.js";

export default function Classes() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("classId");
  const [sortOrder, setSortOrder] = useState("asc");

  const load = async () => {
    try {
      setLoading(true);
      const [classes, trainers, users, gyms] = await Promise.all([
        getAllClasses(),
        getAllTrainers(),
        getAllUsers(),
        getAllGyms(),
      ]);

      const userMap = new Map(users.map((u) => [u.userId, u]));
      const trainerMap = new Map(
        trainers.map((t) => [
          t.trainerId,
          {
            ...t,
            user: userMap.get(t.userId),
            label: `${(userMap.get(t.userId)?.firstName || "")} ${
              (userMap.get(t.userId)?.lastName || "")
            }${t.specialization ? ` (${t.specialization})` : ""}`.trim(),
          },
        ])
      );
      const gymMap = new Map(gyms.map((g) => [g.gymId, g.name]));

      const result = classes.map((c) => {
        const trainer = c.trainerId ? trainerMap.get(c.trainerId) : null;
        return {
          classId: c.classId,
          className: c.className,
          trainerLabel: trainer ? trainer.label : "—",
          gymName: c.gymId ? gymMap.get(c.gymId) || "—" : "—",
          classDate: c.classDate || "—",
          time:
            c.startTime && c.endTime ? `${c.startTime} – ${c.endTime}` : "—",
          capacity: c.capacity ?? "—",
        };
      });

      setRows(result);
      setFiltered(result);
    } catch (e) {
      Swal.fire("Error", "Failed to load classes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let data = [...rows];
    if (search.trim()) {
      const key = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.className.toLowerCase().includes(key) ||
          r.trainerLabel.toLowerCase().includes(key) ||
          r.gymName.toLowerCase().includes(key)
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

  const remove = async (id) => {
    const r = await Swal.fire({
      icon: "warning",
      title: "Delete this class?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });
    if (!r.isConfirmed) return;
    try {
      await deleteClassApi(id);
      Swal.fire("Deleted", "Class removed successfully", "success");
      load();
    } catch (e) {
      Swal.fire("Error", e.message || "Delete failed", "error");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Users className="text-blue-600 dark:text-blue-400" />
          Class Management
        </h2>

        <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          >
            <option value="classId">Sort by ID</option>
            <option value="className">Sort by Name</option>
            <option value="trainerLabel">Sort by Trainer</option>
            <option value="gymName">Sort by Gym</option>
          </select>

          <button
            onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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

          <button
            onClick={() => nav("/classes/create")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
          >
            <PlusCircle size={18} /> Add Class
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-[6%_15%_22%_12%_12%_12%_8%_10%] border-b bg-gray-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 uppercase text-xs font-semibold">
          <div className="px-4 py-3">ID</div>
          <div className="px-4 py-3">CLASS NAME</div>
          <div className="px-4 py-3">TRAINER</div>
          <div className="px-4 py-3 text-left">GYM</div>
          <div className="px-4 py-3 text-left">DATE</div>
          <div className="px-4 py-3 text-left">TIME</div>
          <div className="px-4 py-3 text-center">CAP.</div>
          <div className="px-4 py-3 text-center">ACTIONS</div>
        </div>

        {filtered.length > 0 ? (
          filtered.map((r, i) => (
            <div
              key={r.classId}
              className={`grid grid-cols-[6%_15%_22%_12%_12%_12%_8%_10%] items-center border-b text-sm ${
                i % 2 === 0
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-50 dark:bg-gray-900/40"
              } hover:bg-gray-50 dark:hover:bg-gray-700 transition`}
            >
              <div className="px-4 py-3">{r.classId}</div>
              <div className="px-4 py-3 font-medium">{r.className}</div>
              <div className="px-4 py-3 flex items-center gap-2">
                <User size={14} className="text-gray-500" />
                {r.trainerLabel}
              </div>
              <div className="px-4 py-3 flex items-center gap-2">
                <Dumbbell size={14} className="text-gray-500" />
                {r.gymName}
              </div>
              <div className="px-4 py-3 flex items-center gap-2">
                <CalendarDays size={14} className="text-gray-500" />
                {r.classDate}
              </div>
              <div className="px-4 py-3">{r.time}</div>
              <div className="px-4 py-3 text-center">{r.capacity}</div>
              <div className="px-4 py-3 flex justify-center gap-2">
                <button
                  onClick={() => nav(`/classes/${r.classId}`)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full transition"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => remove(r.classId)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-full transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
            {loading ? "Loading..." : "No classes found."}
          </div>
        )}
      </div>
    </div>
  );
}
