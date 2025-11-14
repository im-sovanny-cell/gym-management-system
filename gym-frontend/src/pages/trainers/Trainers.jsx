// src/pages/trainers/Trainers.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import {
  Search,
  SortAsc,
  SortDesc,
  PlusCircle,
  Edit,
  Trash2,
  Dumbbell,
  Calendar,
  DollarSign,
} from "lucide-react";

import { getAllTrainers, deleteTrainer } from "../../api/trainerApi";
import { getAllUsers } from "../../api/userApi";

export default function Trainers() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("trainerId");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const [tData, uData] = await Promise.all([getAllTrainers(), getAllUsers()]);

      const userMap = new Map(uData.map((u) => [u.userId, u]));

      const result = tData.map((t) => ({
        trainerId: t.trainerId,
        specialization: t.specialization || "—",
        certifications: t.certifications || "—",
        hireDate: t.hireDate || "—",
        hourlyRate: t.hourlyRate || "—",
        employmentType: t.employmentType || "—",
        fullName: userMap.get(t.userId)
          ? `${userMap.get(t.userId).firstName} ${userMap.get(t.userId).lastName}`
          : "(Unknown)",
      }));

      setRows(result);
      setFiltered(result);
    } catch {
      Swal.fire("Error", "Failed to load trainers", "error");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "Delete this trainer?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!isConfirmed) return;

    try {
      await deleteTrainer(id);
      Swal.fire("Deleted", "Trainer removed successfully", "success");
      load();
    } catch {
      Swal.fire("Error", "Failed to delete trainer", "error");
    }
  };

  // 🔍 SEARCH + SORT
  useEffect(() => {
    let data = [...rows];

    if (search.trim()) {
      const key = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.fullName.toLowerCase().includes(key) ||
          r.specialization.toLowerCase().includes(key) ||
          String(r.trainerId).includes(key)
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
          <Dumbbell className="text-blue-600 dark:text-blue-400" />
          Trainer Management
        </h2>

        <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search trainers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 
                         rounded-lg text-sm w-64 bg-white dark:bg-gray-800
                         text-gray-800 dark:text-gray-100 focus:ring-2 
                         focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* SORT FIELD */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 
                       rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 
                       text-gray-800 dark:text-gray-100"
          >
            <option value="trainerId">Sort by ID</option>
            <option value="fullName">Sort by Name</option>
            <option value="specialization">Specialization</option>
            <option value="employmentType">Employment Type</option>
          </select>

          {/* SORT ORDER */}
          <button
            onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
            className="border border-gray-300 dark:border-gray-700 rounded-lg 
                       px-3 py-2 text-sm flex items-center gap-2 
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

          {/* ADD NEW */}
          <button
            onClick={() => navigate("/trainers/create")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 
                       text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
          >
            <PlusCircle size={18} /> Add Trainer
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">

        {/* HEADER ROW */}
        <div className="grid grid-cols-[6%_18%_16%_16%_12%_12%_10%_10%] 
                        border-b bg-gray-100 dark:bg-gray-700 
                        text-blue-800 dark:text-blue-300 
                        uppercase text-xs font-semibold">
          <div className="px-4 py-3">ID</div>
          <div className="px-4 py-3">NAME</div>
          <div className="px-4 py-3">SPECIALIZATION</div>
          <div className="px-4 py-3">CERTIFICATIONS</div>
          <div className="px-4 py-3">HIRE DATE</div>
          <div className="px-4 py-3">RATE/hr</div>
          <div className="px-4 py-3 text-center">TYPE</div>
          <div className="px-4 py-3 text-center">ACTIONS</div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
            Loading trainers...
          </div>
        )}

        {/* DATA ROWS */}
        {!loading &&
          (filtered.length > 0 ? (
            filtered.map((t, i) => (
              <div
                key={t.trainerId}
                className={`grid grid-cols-[6%_18%_16%_16%_12%_12%_10%_10%] 
                            items-center border-b text-sm ${
                              i % 2 === 0
                                ? "bg-white dark:bg-gray-800"
                                : "bg-gray-50 dark:bg-gray-900/40"
                            } hover:bg-gray-50 dark:hover:bg-gray-700 transition`}
              >
                <div className="px-4 py-3">{t.trainerId}</div>

                <div className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {t.fullName}
                </div>

                <div className="px-4 py-3">{t.specialization}</div>

                <div className="px-4 py-3">{t.certifications}</div>

                <div className="px-4 py-3 flex items-center gap-2">
                  <Calendar size={14} className="text-gray-500" />
                  {t.hireDate}
                </div>

                <div className="px-4 py-3 flex items-center gap-1">
                  <DollarSign size={14} className="text-gray-500" />
                  {t.hourlyRate}
                </div>

                <div className="px-4 py-3 text-center">{t.employmentType}</div>

                <div className="px-4 py-3 flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/trainers/${t.trainerId}`)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium 
                               text-yellow-700 bg-yellow-100 hover:bg-yellow-200 
                               rounded-full transition"
                  >
                    <Edit size={14} /> Edit
                  </button>

                  {/* <button
                    onClick={() => remove(t.trainerId)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium 
                               text-red-700 bg-red-100 hover:bg-red-200 
                               rounded-full transition"
                  >
                    <Trash2 size={14} /> Delete
                  </button> */}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
              No trainers found.
            </div>
          ))}
      </div>
    </div>
  );
}
