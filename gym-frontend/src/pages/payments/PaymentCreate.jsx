// src/pages/payments/PaymentCreate.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createPayment } from "../../api/paymentApi";
import { getAllUsers } from "../../api/userApi";
import { getAllMemberships } from "../../api/membershipApi";

export default function PaymentCreate() {
  const nav = useNavigate();

  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);

  const [userId, setUserId] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("KHQR");
  const [status, setStatus] = useState("pending");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // PRICE TABLE
  const PLAN_PRICES = {
    daily: 2,
    monthly: 20,
    "3-month": 50,
    yearly: 150,
  };

  useEffect(() => {
    (async () => {
      const [u, m] = await Promise.all([getAllUsers(), getAllMemberships()]);
      setUsers(u || []);
      setMemberships(m || []);
    })();
  }, []);

  // Filter memberships by selected user
  const membershipsForUser = useMemo(
    () =>
      userId
        ? memberships.filter((m) => m.userId === Number(userId))
        : [],
    [userId, memberships]
  );

  // Auto-detect membership selected & update amount
  const selectedMembership = useMemo(
    () =>
      memberships.find((m) => m.membershipId === Number(membershipId)) || null,
    [membershipId, memberships]
  );

  useEffect(() => {
    if (selectedMembership) {
      const plan = selectedMembership.planType;
      const autoPrice = PLAN_PRICES[plan] ?? "";

      setAmount(autoPrice); // Auto-fill amount
    }
  }, [selectedMembership]);

  const save = async () => {
    if (!userId) return Swal.fire("Error", "Select user!", "error");
    if (!membershipId) return Swal.fire("Error", "Select membership!", "error");
    if (!amount || Number(amount) <= 0)
      return Swal.fire("Error", "Amount cannot be empty", "error");

    try {
      await createPayment({
        userId: Number(userId),
        membershipId: Number(membershipId),
        amount: Number(amount),
        paymentDate,
        method,
        status,
      });

      Swal.fire("Success", "Payment created successfully!", "success");
      nav("/payments");
    } catch (e) {
      Swal.fire("Error", e.message || "Create failed", "error");
    }
  };

  return (
    <div className="p-6 min-h-screen flex justify-center bg-gray-100 dark:bg-gray-900 transition">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border dark:border-gray-700">

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Create Payment
        </h2>

        {/* USER */}
        <div className="mb-5">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            User *
          </label>
          <select
            className="p-3 w-full border rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setMembershipId("");
              setAmount("");
            }}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.userId} value={u.userId}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* MEMBERSHIP */}
        <div className="mb-5">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Membership *
          </label>
          <select
            disabled={!userId}
            className="p-3 w-full border rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            value={membershipId}
            onChange={(e) => setMembershipId(e.target.value)}
          >
            <option value="">
              {userId ? "Select Membership" : "Select User First"}
            </option>
            {membershipsForUser.map((m) => (
              <option key={m.membershipId} value={m.membershipId}>
                #{m.membershipId} — {m.planType} ({m.startDate} →{" "}
                {m.endDate || "—"})
              </option>
            ))}
          </select>
        </div>

        {/* AUTO-FILL MEMBERSHIP INFO */}
        {selectedMembership && (
          <div className="p-4 mb-5 rounded-xl bg-gray-100 dark:bg-gray-700 border dark:border-gray-600">
            <p className="text-gray-800 dark:text-gray-100 font-medium">
              Plan: {selectedMembership.planType}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Period: {selectedMembership.startDate} →{" "}
              {selectedMembership.endDate || "—"}
            </p>
            <p className="text-green-600 dark:text-green-400 text-lg font-bold mt-2">
              Auto Amount: ${amount}
            </p>
          </div>
        )}

        {/* AMOUNT (AUTO-FILLED) */}
        <div className="mb-5">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Amount ($)
          </label>
          <input
            type="number"
            className="p-3 w-full border rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* METHOD + DATE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Method
            </label>
            <select
              className="p-3 w-full border rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
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
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Payment Date
            </label>
            <input
              type="date"
              className="p-3 w-full border rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>
        </div>

        {/* STATUS */}
        <div className="mb-6">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            className="p-3 w-full border rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={save}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>

          <button
            onClick={() => nav("/payments")}
            className="px-6 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
