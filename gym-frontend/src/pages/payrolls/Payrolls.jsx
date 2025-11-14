// src/pages/payrolls/Payrolls.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  Search,
  SortAsc,
  SortDesc,
  User,
  Edit,
  Trash2,
  CalendarDays,
  DollarSign,
  UserCheck,
} from "lucide-react";

import { getAllPayrolls, deletePayroll } from "../../api/payrollApi";
import { getAllTrainers } from "../../api/trainerApi";
import { getAllUsers } from "../../api/userApi";

export default function Payrolls() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [trainers, setTrainers] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("payrollId");
  const [sortOrder, setSortOrder] = useState("asc");

  const load = async () => {
    try {
      setLoading(true);
      const [p, t, u] = await Promise.all([
        getAllPayrolls(),
        getAllTrainers(),
        getAllUsers(),
      ]);

      const userMap = new Map(u.map((x) => [x.userId, x]));
      const trainerMap = new Map(
        t.map((tr) => [
          tr.trainerId,
          {
            ...tr,
            user: userMap.get(tr.userId),
            fullName: `${userMap.get(tr.userId)?.firstName || ""} ${
              userMap.get(tr.userId)?.lastName || ""
            }`.trim(),
          },
        ])
      );

      const result = p.map((pay) => ({
        payrollId: pay.payrollId,
        trainerName: trainerMap.get(pay.trainerId)?.fullName || "Unknown",
        rate: trainerMap.get(pay.trainerId)?.hourlyRate || 0,
        trainerId: pay.trainerId,
        totalHours: pay.totalHours,
        monthYear: pay.monthYear,
        totalPay: pay.totalPay,
        status: pay.paidStatus,
      }));

      setRows(result);
      setFiltered(result);
      setTrainers(t);
      setUsers(u);
    } catch (err) {
      Swal.fire("Error", "Failed to load payrolls", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 🔍 Search + Sort
  useEffect(() => {
    let data = [...rows];

    if (search.trim()) {
      const key = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.trainerName.toLowerCase().includes(key) ||
          r.monthYear.toLowerCase().includes(key)
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

  // ❌ Delete
  const remove = async (id) => {
    const r = await Swal.fire({
      icon: "warning",
      title: "Delete this payroll?",
      text: "This cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!r.isConfirmed) return;

    try {
      await deletePayroll(id);
      Swal.fire("Deleted", "Payroll removed", "success");
      load();
    } catch (e) {
      Swal.fire("Error", e.message || "Failed", "error");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <UserCheck className="text-blue-600 dark:text-blue-400" />
          Trainer Payrolls
        </h2>

        <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payroll..."
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
            className="border border-gray-300 dark:border-gray-700 
                       rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 
                       text-gray-800 dark:text-gray-100"
          >
            <option value="payrollId">Sort by ID</option>
            <option value="trainerName">Trainer</option>
            <option value="monthYear">Month</option>
            <option value="status">Status</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
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

          {/* Add New */}
          <button
            onClick={() => nav("/payrolls/create")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 
                       text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
          >
            + Create Payroll
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">

        {/* HEADER ROW */}
        <div className="grid grid-cols-[6%_20%_12%_10%_12%_14%_10%_14%] border-b bg-gray-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 uppercase text-xs font-semibold">
          <div className="px-4 py-3">ID</div>
          <div className="px-4 py-3">TRAINER</div>
          <div className="px-4 py-3">MONTH</div>
          <div className="px-4 py-3">HOURS</div>
          <div className="px-4 py-3">RATE/hr</div>
          <div className="px-4 py-3">TOTAL PAY</div>
          <div className="px-4 py-3 text-center">STATUS</div>
          <div className="px-4 py-3 text-center">ACTIONS</div>
        </div>

        {/* DATA ROWS */}
        {filtered.length > 0 ? (
          filtered.map((r, i) => (
            <div
              key={r.payrollId}
              className={`grid grid-cols-[6%_20%_12%_10%_12%_14%_10%_14%] 
                          items-center border-b text-sm ${
                            i % 2 === 0
                              ? "bg-white dark:bg-gray-800"
                              : "bg-gray-50 dark:bg-gray-900/40"
                          } hover:bg-gray-50 dark:hover:bg-gray-700 transition`}
            >
              <div className="px-4 py-3">{r.payrollId}</div>
              <div className="px-4 py-3 flex items-center gap-2">
                <User size={14} className="text-gray-500" />
                {r.trainerName}
              </div>
              <div className="px-4 py-3 flex items-center gap-2">
                <CalendarDays size={14} className="text-gray-500" />
                {r.monthYear}
              </div>

              <div className="px-4 py-3">{r.totalHours}</div>
              <div className="px-4 py-3">${r.rate}</div>

              <div className="px-4 py-3 font-semibold text-green-700 dark:text-green-400">
                ${Number(r.totalPay).toFixed(2)}
              </div>

              <div className="px-4 py-3 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    r.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div className="px-4 py-3 flex justify-center gap-2">

                {/* Edit */}
                <button
                  onClick={() => nav(`/payrolls/${r.payrollId}`)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium 
                             text-indigo-700 bg-indigo-100 hover:bg-indigo-200 
                             rounded-full transition"
                >
                  <Edit size={14} /> Edit
                </button>

                {/* Delete */}
                <button
                  onClick={() => remove(r.payrollId)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium 
                             text-red-700 bg-red-100 hover:bg-red-200 
                             rounded-full transition"
                >
                  <Trash2 size={14} /> Delete
                </button>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
            {loading ? "Loading..." : "No payrolls found."}
          </div>
        )}
      </div>
    </div>
  );
}
