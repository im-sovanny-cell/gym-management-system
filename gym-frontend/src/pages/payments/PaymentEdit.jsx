import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getPaymentById, updatePayment, deletePayment } from "../../api/paymentApi";
import { getAllUsers } from "../../api/userApi";
import { getAllMemberships } from "../../api/membershipApi";

export default function PaymentEdit() {
    const { id } = useParams();
    const nav = useNavigate();

    const [users, setUsers] = useState([]);
    const [memberships, setMemberships] = useState([]);

    const [userId, setUserId] = useState("");
    const [membershipId, setMembershipId] = useState("");
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("KHQR");
    const [status, setStatus] = useState("paid");
    const [paymentDate, setPaymentDate] = useState("");

    useEffect(() => {
        (async () => {
            const [u, m, p] = await Promise.all([
                getAllUsers(),
                getAllMemberships(),
                getPaymentById(id)
            ]);
            setUsers(u || []);
            setMemberships(m || []);
            setUserId(p.userId || "");
            setMembershipId(p.membershipId || "");
            setAmount(p.amount ?? "");
            setMethod(p.method || "KHQR");
            setStatus(p.status || "paid");
            setPaymentDate(p.paymentDate || new Date().toISOString().split("T")[0]);
        })();
    }, [id]);

    const membershipsForUser = useMemo(
        () => (userId ? memberships.filter(m => m.userId === Number(userId)) : memberships),
        [userId, memberships]
    );

    const save = async () => {
        if (!userId || !membershipId) {
            return Swal.fire("Error", "Select user and membership", "error");
        }
        try {
            await updatePayment(id, {
                userId: Number(userId),
                membershipId: Number(membershipId),
                amount: Number(amount),
                paymentDate,
                method,
                status
            });
            Swal.fire("Success", "Payment updated", "success");
            nav("/payments");
        } catch (e) {
            Swal.fire("Error", e.message || "Update failed", "error");
        }
    };

    const remove = async () => {
        const r = await Swal.fire({ icon: "warning", title: "Delete?", showCancelButton: true });
        if (!r.isConfirmed) return;
        try {
            await deletePayment(id);
            Swal.fire("Deleted", "", "success");
            nav("/payments");
        } catch (e) {
            Swal.fire("Error", e.message || "Delete failed", "error");
        }
    };

    return (
        <div className="p-6 max-w-3xl">
            <h2 className="text-xl font-bold mb-6">Edit Payment #{id}</h2>

            <select className="border p-3 rounded w-full mb-4" value={userId} onChange={e => { setUserId(e.target.value); setMembershipId(""); }}>
                <option value="">Select User *</option>
                {users.map(u => (
                    <option key={u.userId} value={u.userId}>
                        {u.firstName} {u.lastName}
                    </option>
                ))}
            </select>

            <select className="border p-3 rounded w-full mb-4" value={membershipId} onChange={e => setMembershipId(e.target.value)} disabled={!userId}>
                <option value="">{userId ? "Select Membership *" : "Select User first"}</option>
                {membershipsForUser.map(m => (
                    <option key={m.membershipId} value={m.membershipId}>
                        #{m.membershipId} — {m.planType} ({m.startDate} → {m.endDate || "—"})
                    </option>
                ))}
            </select>

            <input
                type="number"
                className="border p-3 rounded w-full mb-4"
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
                <select className="border p-3 rounded" value={method} onChange={e => setMethod(e.target.value)}>
                    <option value="KHQR">KHQR</option>
                    <option value="Cash">Cash</option>
                    <option value="ABA">ABA</option>
                    <option value="ACLEDA">ACLEDA</option>
                </select>

                <input type="date" className="border p-3 rounded" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} />
            </div>

            <select className="border p-3 rounded w-full mb-6" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
            </select>

            <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={save}>Save</button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => nav("/payments")}>Cancel</button>
                <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={remove}>Delete</button>
                <button
                    className="bg-emerald-600 text-white px-4 py-2 rounded"
                    onClick={() => nav(`/payments/${id}/qr`)}
                >
                    Show QR
                </button>

            </div>
        </div>
    );
}
