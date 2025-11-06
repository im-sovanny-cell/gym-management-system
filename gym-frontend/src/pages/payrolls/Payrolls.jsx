import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllPayrolls, deletePayroll } from "../../api/payrollApi";

export default function Payrolls() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const list = await getAllPayrolls();
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      Swal.fire("Error", e.message || "Failed to load payrolls", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    const r = await Swal.fire({
      icon: "warning",
      title: "Delete this record?",
      showCancelButton: true
    });
    if (!r.isConfirmed) return;

    try {
      await deletePayroll(id);
      Swal.fire("Deleted", "", "success");
      load();
    } catch (e) {
      Swal.fire("Error", e.message || "Delete failed", "error");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Trainer Payrolls</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => nav("/payrolls/create")}
        >
          + Create Payroll
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-center animate-pulse">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3">#</th>
                <th className="p-3">Trainer ID</th>
                <th className="p-3">Month</th>
                <th className="p-3">Hours</th>
                <th className="p-3">Total Pay</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p, i) => (
                <tr key={p.payrollId} className="border-t hover:bg-gray-50">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{p.trainerId}</td>
                  <td className="p-3">{p.monthYear}</td>
                  <td className="p-3">{p.totalHours}</td>
                  <td className="p-3">${p.totalPay?.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      p.paidStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {p.paidStatus}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      className="px-3 py-1 text-white bg-indigo-600 rounded"
                      onClick={() => nav(`/payrolls/${p.payrollId}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-red-600 rounded"
                      onClick={() => remove(p.payrollId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="p-5 text-center text-gray-500" colSpan="7">
                    No payroll records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
