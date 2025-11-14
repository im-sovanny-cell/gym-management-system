// src/pages/payments/PaymentQR.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getPaymentById, updatePayment } from "/src/api/paymentApi.js";
import { API } from "/src/api/http.js";

import ABA_IMG from "../khqr/aba.jpg";
import ACLEDA_IMG from "../khqr/acleda.jpg";

export default function PaymentQR() {
  const { id } = useParams();
  const nav = useNavigate();

  const [payment, setPayment] = useState(null);
  const [bank, setBank] = useState("ABA");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const p = await getPaymentById(id);
        setPayment(p);
        if (p?.method) setBank(p.method);
      } catch (err) {
        Swal.fire("Error", "Unable to load payment data", "error");
      }
      setLoading(false);
    })();
  }, []);

  const confirmPaid = async () => {
    if (!payment) return;

    const ask = await Swal.fire({
      title: "Confirm Payment?",
      text: `Mark payment #${payment.paymentId} as paid`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
    });

    if (!ask.isConfirmed) return;

    try {
      setSaving(true);

      await updatePayment(payment.paymentId, {
        ...payment,
        status: "paid",
        method: bank,
      });

      await API.post("/telegram/notify", {
        paymentId: payment.paymentId,
        userId: payment.userId,
        userName: payment.userName,
        amount: payment.amount,
        bank,
      });

      Swal.fire("Success", "Payment marked as paid!", "success");
      nav("/payments");
    } catch (err) {
      Swal.fire("Error", err.message || "Update failed", "error");
    }

    setSaving(false);
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        Loading payment…
      </div>
    );

  if (!payment)
    return (
      <div className="p-8 text-center text-red-500">Payment not found</div>
    );

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700">

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Scan to Pay
        </h2>

        {/* Bank Switch */}
        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1 mb-6">
          {["ABA", "ACLEDA"].map((b) => (
            <button
              key={b}
              onClick={() => setBank(b)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                bank === b
                  ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* QR — FULL Premium */}
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-300 dark:border-gray-700">
            <img
              src={bank === "ABA" ? ABA_IMG : ACLEDA_IMG}
              alt="KHQR"
              className="w-80 h-80 object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* Payment Info */}
        <div className="space-y-3 text-gray-700 dark:text-gray-300 mb-6">
          <div className="flex justify-between text-lg">
            <span>Amount:</span>
            <strong className="text-xl text-green-600 dark:text-green-400">
              ${Number(payment.amount).toFixed(2)}
            </strong>
          </div>

          <div className="flex justify-between">
            <span>Member:</span>
            <strong>{payment.userName}</strong>
          </div>

          <div className="flex justify-between">
            <span>Plan:</span>
            <strong>{payment.membershipPlan}</strong>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => nav("/payments")}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Back
          </button>

          <button
            disabled={saving || payment.status === "paid"}
            onClick={confirmPaid}
            className={`px-6 py-2 rounded-lg text-white font-medium transition ${
              payment.status === "paid"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving ? "Processing…" : payment.status === "paid" ? "Paid" : "Confirm Paid"}
          </button>
        </div>
      </div>
    </div>
  );
}
