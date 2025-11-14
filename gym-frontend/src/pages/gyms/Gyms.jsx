// src/pages/gyms/Gyms.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  SortAsc,
  SortDesc,
  PlusCircle,
  Edit3,
  MapPin,
  Clock,
  Phone,
  User,
  Building2,
} from "lucide-react";

import { getAllGyms } from "../../api/gymApi";
import { getAllUsers } from "../../api/userApi";

export default function Gyms() {
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterGym, setFilterGym] = useState("all");

  const [sortField, setSortField] = useState("gymId");
  const [sortOrder, setSortOrder] = useState("asc");

  const nav = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const [gyms, users] = await Promise.all([getAllGyms(), getAllUsers()]);

      const userMap = new Map(users.map((u) => [u.userId, u]));

      const mapped = gyms.map((g) => ({
        gymId: g.gymId,
        name: g.name || "—",
        address: g.address || "—",
        openingHours: g.openingHours || "—",
        phone: g.phone || "—",
        managerName: userMap.get(g.managerId)
          ? `${userMap.get(g.managerId).firstName} ${userMap.get(g.managerId).lastName}`
          : "—",
      }));

      setRows(mapped);
      setFiltered(mapped);
    } catch (err) {
      console.error("Failed to load gyms", err);
      setRows([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  // FILTER + SEARCH + SORT
  useEffect(() => {
    let data = [...rows];

    // Filter by gym
    if (filterGym !== "all") {
      data = data.filter((r) => r.name === filterGym);
    }

    // Search
    if (search.trim()) {
      const k = search.toLowerCase();
      data = data.filter(
        (r) =>
          String(r.gymId).includes(k) ||
          r.name.toLowerCase().includes(k) ||
          r.address.toLowerCase().includes(k) ||
          r.managerName.toLowerCase().includes(k)
      );
    }

    // Sort
    data.sort((a, b) => {
      const aVal = (a[sortField] || "").toString().toLowerCase();
      const bVal = (b[sortField] || "").toString().toLowerCase();

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFiltered(data);
  }, [search, filterGym, sortField, sortOrder, rows]);

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Building2 className="text-blue-600 dark:text-blue-400" />
          Gym Management
        </h2>

        <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search gyms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 
                         rounded-lg text-sm w-64 bg-white dark:bg-gray-800 
                         text-gray-900 dark:text-gray-100 focus:ring-2 
                         focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Filter by Gym */}
          <select
            value={filterGym}
            onChange={(e) => setFilterGym(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg 
                       px-3 py-2 text-sm bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Gyms</option>
            {[...new Set(rows.map((r) => r.name))].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          {/* Sort field */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg 
                       px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="gymId">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="address">Sort by Address</option>
            <option value="managerName">Sort by Manager</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
            className="border border-gray-300 dark:border-gray-700 rounded-lg 
                       px-3 py-2 text-sm flex items-center gap-2 
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            {sortOrder === "asc" ? <><SortAsc size={16}/> Asc</> : <><SortDesc size={16}/> Desc</>}
          </button>

          {/* Add Gym */}
          <button
            onClick={() => nav("/gyms/create")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 
                       text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
          >
            <PlusCircle size={18} /> Create Gym
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">

        {/* HEADER ROW */}
        <div className="grid grid-cols-[6%_10%_30%_15%_12%_12%_12%] 
                        border-b bg-gray-100 dark:bg-gray-700 
                        text-blue-800 dark:text-blue-300 uppercase text-xs font-semibold">
          <div className="px-4 py-3">ID</div>
          <div className="px-4 py-3">NAME</div>
          <div className="px-4 py-3">ADDRESS</div>
          <div className="px-4 py-3">HOURS</div>
          <div className="px-4 py-3">PHONE</div>
          <div className="px-4 py-3">MANAGER</div>
          <div className="px-4 py-3 text-center">ACTIONS</div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
            Loading gyms...
          </div>
        )}

        {/* DATA ROWS */}
        {!loading &&
          (filtered.length > 0 ? (
            filtered.map((g, i) => (
              <div
                key={g.gymId}
                className={`grid grid-cols-[6%_10%_30%_15%_12%_12%_12%] 
                            items-center border-b text-sm ${
                              i % 2 === 0
                                ? "bg-white dark:bg-gray-800"
                                : "bg-gray-50 dark:bg-gray-900/40"
                            } hover:bg-gray-50 dark:hover:bg-gray-700 transition`}
              >
                {/* ID */}
                <div className="px-4 py-3">{g.gymId}</div>

                {/* NAME */}
                <div className="px-4 py-3 truncate">{g.name}</div>

                {/* ADDRESS */}
                <div className="px-4 py-3 flex items-center gap-2 truncate">
                  <MapPin size={14} className="text-gray-500" />
                  {g.address}
                </div>

                {/* HOURS */}
                <div className="px-4 py-3 flex items-center gap-2">
                  <Clock size={14} className="text-gray-500" />
                  {g.openingHours}
                </div>

                {/* PHONE */}
                <div className="px-4 py-3 flex items-center gap-2">
                  <Phone size={14} className="text-gray-500" />
                  {g.phone}
                </div>

                {/* MANAGER */}
                <div className="px-4 py-3 flex items-center gap-2 truncate">
                  <User size={14} className="text-gray-500" />
                  {g.managerName}
                </div>

                {/* ACTIONS */}
                <div className="px-4 py-3 flex justify-center">
                  <button
                    onClick={() => nav(`/gyms/${g.gymId}`)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium 
                               text-yellow-700 bg-yellow-100 hover:bg-yellow-200 
                               rounded-full transition"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
              No gyms found.
            </div>
          ))}
      </div>
    </div>
  );
}
