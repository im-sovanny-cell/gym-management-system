import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllPayments, deletePayment } from "../../api/paymentApi";

export default function Payments() {
    const nav = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            setLoading(true);
            const list = await getAllPayments();
            setItems(Array.isArray(list) ? list : []);
        } catch (e) {
            Swal.fire("Error", e.message || "Failed to load payments", "error");
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const remove = async (id) => {
        const r = await Swal.fire({
            icon: "warning",
            title: "Delete this payment?",
            showCancelButton: true
        });
        if (!r.isConfirmed) return;
        try {
            await deletePayment(id);
            Swal.fire("Deleted", "", "success");
            load();
        } catch (e) {
            Swal.fire("Error", e.message || "Delete failed", "error");
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Payments</h2>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => nav("/payments/create")}
                >
                    + Create Payment
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
                                <th className="p-3">Member</th>
                                <th className="p-3">Plan</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Method</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((p, i) => (
                                <tr key={p.paymentId} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{i + 1}</td>
                                    <td className="p-3">{p.userName || `#${p.userId}`}</td>
                                    <td className="p-3">{p.membershipPlan || "—"}</td>
                                    <td className="p-3">${Number(p.amount).toFixed(2)}</td>
                                    <td className="p-3">{p.method || "—"}</td>
                                    <td className="p-3">{p.paymentDate || "—"}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${p.status === "paid" ? "bg-green-100 text-green-700"
                                                : p.status === "pending" ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center space-x-2">

                                        <button
                                            className="px-3 py-1 text-white bg-emerald-600 rounded"
                                            onClick={() => nav(`/payments/${p.paymentId}/qr`)}
                                        >
                                            Show QR
                                        </button>


                                        <button
                                            className="px-3 py-1 text-white bg-indigo-600 rounded"
                                            onClick={() => nav(`/payments/${p.paymentId}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-3 py-1 text-white bg-red-600 rounded"
                                            onClick={() => remove(p.paymentId)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td className="p-5 text-center text-gray-500" colSpan="8">
                                        No payments found.
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
