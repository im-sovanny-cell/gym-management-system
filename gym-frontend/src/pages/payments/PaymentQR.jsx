// src/pages/payments/PaymentQR.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getPaymentById, updatePayment } from "/src/api/paymentApi.js";
import { API } from "/src/api/http.js";

// static KHQR images
import ABA_IMG from "../khqr/aba.jpg";
import ACLEDA_IMG from "../khqr/acleda.jpg";

export default function PaymentQR() {
  const { id } = useParams();
  const nav = useNavigate();

  const [payment, setPayment] = useState(null);
  const [bank, setBank] = useState("ABA");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getPaymentById(id);
      setPayment(data);
    } catch (e) {
      Swal.fire("Error", "Failed to load payment", "error");
    }
  };

  const confirmPaid = async () => {
    try {
      // update DB
      await updatePayment(id, {
        ...payment,
        status: "paid",
        method: bank,
      });

      // name fix
      const fullName =
        `${payment.firstName || ""} ${payment.lastName || ""}`.trim();

      // send to telegram controller
      await API.post("/telegram/notify", {
        paymentId: payment.paymentId,
        userId: payment.userId,
        userName: payment.userName,// <-- FIX HERE
        amount: payment.amount,
        bank: bank,
      });

      Swal.fire("Success", "Payment marked as paid!", "success");
      nav("/payments");

    } catch (e) {
      Swal.fire("Error", e.message || "Failed to confirm payment", "error");
    }
  };

  if (!payment) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-8 max-w-lg mx-auto text-center">

      <h2 className="text-2xl font-bold mb-6">Scan To Pay</h2>

      <div className="text-lg mb-2 font-semibold">
        Amount: ${payment.amount}
      </div>

      <select
        className="border p-2 rounded mb-4"
        value={bank}
        onChange={(e) => setBank(e.target.value)}
      >
        <option value="ABA">ABA</option>
        <option value="ACLEDA">ACLEDA</option>
      </select>

      <img
        src={bank === "ABA" ? ABA_IMG : ACLEDA_IMG}
        alt="KHQR"
        className="w-72 mx-auto rounded-lg shadow mb-6"
      />

      <button
        onClick={confirmPaid}
        className="bg-green-600 text-white px-6 py-3 rounded font-semibold"
      >
        Confirm Paid
      </button>

      <div className="mt-4">
        <button
          className="text-gray-500 underline"
          onClick={() => nav("/payments")}
        >
          Back
        </button>
      </div>

    </div>
  );
}
