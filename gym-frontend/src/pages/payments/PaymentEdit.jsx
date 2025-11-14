import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../../api/paymentApi";

import { getAllUsers } from "../../api/userApi";
import { getAllMemberships } from "../../api/membershipApi";

export default function PaymentEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);

  const [userId, setUserId] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("KHQR");
  const [status, setStatus] = useState("paid");
  const [paymentDate, setPaymentDate] = useState("");

  // dropdown states
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [u, m, p] = await Promise.all([
          getAllUsers(),
          getAllMemberships(),
          getPaymentById(id),
        ]);

        setUsers(u || []);
        setMemberships(m || []);

        setUserId(p.userId || "");
        setMembershipId(p.membershipId || "");
        setAmount(p.amount ?? "");
        setMethod(p.method || "KHQR");
        setStatus(p.status || "paid");
        setPaymentDate(
          p.paymentDate || new Date().toISOString().split("T")[0]
        );
      } catch (err) {
        Swal.fire("Error", "Failed to load payment", "error");
      }
      setLoading(false);
    })();
  }, [id]);

  // MEMBERSHIP FILTER — Only show memberships that belong to selected user
  const userMemberships = useMemo(
    () => memberships.filter((m) => m.userId === Number(userId)),
    [userId, memberships]
  );

  // Searchable membership filter
  const filteredMemberships = userMemberships.filter((m) =>
    m.membershipId.toString().includes(searchText)
  );

  // Auto-fill membership & user info
  const selectedMembership = memberships.find(
    (m) => m.membershipId === Number(membershipId)
  );

  const selectedUser = selectedMembership
    ? users.find((u) => u.userId === selectedMembership.userId)
    : users.find((u) => u.userId === Number(userId));

  const save = async () => {
    if (!userId || !membershipId)
      return Swal.fire("Error", "Please select both user & membership", "error");

    try {
      await updatePayment(id, {
        userId: Number(userId),
        membershipId: Number(membershipId),
        amount: Number(amount),
        paymentDate,
        method,
        status,
      });

      Swal.fire("Success", "Payment updated!", "success");
      nav("/payments");
    } catch (e) {
      Swal.fire("Error", e.message || "Failed to update", "error");
    }
  };

  const remove = async () => {
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
      Swal.fire("Deleted!", "Payment removed", "success");
      nav("/payments");
    } catch (e) {
      Swal.fire("Error", e.message || "Delete failed", "error");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-300 animate-pulse">
        Loading payment...
      </div>
    );

  return (
    <div className="p-6 min-h-screen flex justify-center bg-gray-100 dark:bg-gray-900 transition">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Edit Payment #{id}
        </h2>

        {/* USER SELECT */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            User *
          </label>
          <select
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setMembershipId("");
              setShowDropdown(false);
            }}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900
                       text-gray-800 dark:text-gray-100 rounded-xl p-3 w-full"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.userId} value={u.userId}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* MEMBERSHIP SEARCHABLE DROPDOWN */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Membership ID *
          </label>

          <input
            type="text"
            placeholder={userId ? "Search membership ID…" : "Select User first"}
            disabled={!userId}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900
                       text-gray-800 dark:text-gray-100 rounded-xl p-3 w-full disabled:bg-gray-200 
                       dark:disabled:bg-gray-700 cursor-pointer"
            value={membershipId}
            onFocus={() => userId && setShowDropdown(true)}
            onChange={(e) => {
              setMembershipId(e.target.value);
              setSearchText(e.target.value);
            }}
          />

          {/* DROPDOWN LIST */}
          {showDropdown && (
            <div
              className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-xl 
                         bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-xl"
            >
              {/* No membership found */}
              {userMemberships.length === 0 && (
                <div className="p-3 text-red-500 text-sm">❌ User has no memberships</div>
              )}

              {/* Membership list */}
              {filteredMemberships.length > 0 ? (
                filteredMemberships.map((m) => (
                  <div
                    key={m.membershipId}
                    onClick={() => {
                      setMembershipId(m.membershipId);
                      setShowDropdown(false);
                    }}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer 
                               text-gray-800 dark:text-gray-100"
                  >
                    <div className="font-medium">
                      #{m.membershipId} — {m.planType}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {m.startDate} → {m.endDate || "—"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500 dark:text-gray-400 text-sm">
                  No matching membership
                </div>
              )}
            </div>
          )}

          {/* CLOSE DROPDOWN WHEN CLICK OUTSIDE */}
          {showDropdown && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            ></div>
          )}

          {/* AUTO-FILL MEMBERSHIP CARD */}
          {selectedMembership && (
            <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl 
                            border border-gray-300 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Membership Details
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Member</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedUser?.firstName} {selectedUser?.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">Plan</p>
                  <p className="font-medium">{selectedMembership.planType}</p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="font-medium">{selectedMembership.startDate}</p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="font-medium">{selectedMembership.endDate || "—"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AMOUNT */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Amount ($)
          </label>
          <input
            type="number"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900
                       text-gray-800 dark:text-gray-100 rounded-xl p-3 w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* METHOD + DATE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Method
            </label>
            <select
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900
                         text-gray-800 dark:text-gray-100 rounded-xl p-3 w-full"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="KHQR">KHQR</option>
              <option value="Cash">Cash</option>
              <option value="ABA">ABA</option>
              <option value="ACLEDA">ACLEDA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Payment Date
            </label>
            <input
              type="date"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900
                         text-gray-800 dark:text-gray-100 rounded-xl p-3 w-full"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>
        </div>

        {/* STATUS */}
        <div className="mb-10">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900
                       text-gray-800 dark:text-gray-100 rounded-xl p-3 w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={save}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Save Changes
          </button>

          <button
            onClick={() => nav("/payments")}
            className="px-6 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={remove}
            className="px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>

          <button
            onClick={() => nav(`/payments/${id}/qr`)}
            className="px-6 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 ml-auto"
          >
            Show QR
          </button>
        </div>
      </div>
    </div>
  );
}
