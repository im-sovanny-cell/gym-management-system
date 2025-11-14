import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  Wallet,
  Search,
  SortAsc,
  SortDesc,
  QrCode,
  Edit,
  Trash2,
} from "lucide-react";

import { getAllPayments, deletePayment } from "../../api/paymentApi";
import { getAllMemberships } from "../../api/membershipApi";

export default function Payments() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [memberships, setMemberships] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("paymentId");
  const [sortOrder, setSortOrder] = useState("asc");

  const load = async () => {
    try {
      setLoading(true);
      const [p, m] = await Promise.all([getAllPayments(), getAllMemberships()]);

      const membershipMap = new Map(
        m.map((mm) => [mm.membershipId, mm.planType])
      );

      const result = p.map((pay) => ({
        paymentId: pay.paymentId,
        userName: pay.userName,
        planType: pay.membershipPlan || membershipMap.get(pay.membershipId) || "—",
        amount: pay.amount,
        method: pay.method,
        paymentDate: pay.paymentDate,
        status: pay.status,
      }));

      setRows(result);
      setFiltered(result);
    } catch (err) {
      Swal.fire("Error", "Failed to load payments", "error");
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
          r.userName.toLowerCase().includes(key) ||
          r.planType.toLowerCase().includes(key) ||
          String(r.amount).includes(key)
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

  // ❌ Delete Payment
  const remove = async (id) => {
    const r = await Swal.fire({
      icon: "warning",
      title: "Delete this payment?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!r.isConfirmed) return;

    try {
      await deletePayment(id);
      Swal.fire("Deleted", "Payment removed successfully", "success");
      load();
    } catch (e) {
      Swal.fire("Error", e.message || "Delete failed", "error");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Wallet className="text-blue-600 dark:text-blue-400" />
          Payments Management
        </h2>

        <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 
                         rounded-lg text-sm w-64 bg-white dark:bg-gray-800
                         text-gray-800 dark:text-gray-100 focus:ring-2 
                         focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Sort Select */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg 
                       px-3 py-2 text-sm bg-white dark:bg-gray-800 
                       text-gray-800 dark:text-gray-100"
          >
            <option value="paymentId">Sort by ID</option>
            <option value="userName">Sort by User</option>
            <option value="planType">Sort by Plan</option>
            <option value="amount">Sort by Amount</option>
          </select>

          {/* Sort Order Button */}
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

          {/* Add Payment */}
          <button
            onClick={() => nav("/payments/create")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 
                       text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
          >
            + Add Payment
          </button>
        </div>
      </div>

     {/* Table */}
<div className="overflow-hidden rounded-xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
  
  {/* HEADER */}
  <div className="grid grid-cols-[6%_18%_12%_12%_12%_10%_14%_14%] border-b bg-gray-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 uppercase text-xs font-semibold">
    <div className="px-4 py-3">ID</div>
    <div className="px-4 py-3">USER</div>
    <div className="px-4 py-3">PLAN</div>
    <div className="px-4 py-3">AMOUNT</div>
    <div className="px-4 py-3">METHOD</div>
    <div className="px-4 py-3">DATE</div>
    <div className="px-4 py-3 text-center">STATUS</div>
    <div className="px-4 py-3 text-center">ACTIONS</div>
  </div>

  {/* ROWS */}
  {filtered.length > 0 ? (
    filtered.map((r, i) => (
      <div
        key={r.paymentId}
        className={`grid grid-cols-[6%_18%_12%_12%_12%_10%_14%_14%] 
                    items-center border-b text-sm 
                    ${i % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900/40"
                    } 
                    hover:bg-gray-50 dark:hover:bg-gray-700 transition`}
      >
        <div className="px-4 py-3">{r.paymentId}</div>
        <div className="px-4 py-3 font-medium">{r.userName}</div>
        <div className="px-4 py-3">{r.planType}</div>
        <div className="px-4 py-3 font-semibold text-gray-800 dark:text-white">
          ${Number(r.amount).toFixed(2)}
        </div>
        <div className="px-4 py-3">{r.method}</div>
        <div className="px-4 py-3">{r.paymentDate}</div>

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
          <button
            onClick={() => nav(`/payments/${r.paymentId}/qr`)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium 
                       text-emerald-700 bg-emerald-100 hover:bg-emerald-200 
                       rounded-full transition"
          >
            <QrCode size={14} /> QR
          </button>

          <button
            onClick={() => nav(`/payments/${r.paymentId}`)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium 
                       text-indigo-700 bg-indigo-100 hover:bg-indigo-200 
                       rounded-full transition"
          >
            <Edit size={14} /> Edit
          </button>

          {/* <button
            onClick={() => remove(r.paymentId)}
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
      {loading ? "Loading..." : "No payments found."}
    </div>
  )}
</div>

    </div>
  );
}
