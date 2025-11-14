// src/pages/attendance/AttendanceScan.jsx
import { useState } from "react";
import { scanAttendance } from "../../api/attendanceApi";
import Swal from "sweetalert2";
import { UserCheck, ScanLine } from "lucide-react";

export default function AttendanceScan() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!userId.trim()) {
      Swal.fire("Error", "Please enter user ID", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await scanAttendance(userId);

      Swal.fire({
        icon: "success",
        title: "Attendance Updated!",
        html: `<pre style="font-size:14px;text-align:left">${res.data}</pre>`,
        confirmButtonColor: "#2563eb",
        width: 480,
      });

      setUserId("");
    } catch (err) {
      Swal.fire("Error", "Failed to scan", "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-start sm:items-center p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-8 w-full max-w-md transition">

        {/* Title */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <ScanLine className="text-blue-600 dark:text-blue-400" size={30} />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Attendance Scanner
          </h2>
        </div>

        {/* Input Label */}
        <label className="text-gray-600 dark:text-gray-300 text-sm font-medium">
          Enter User ID
        </label>

        {/* Input */}
        <div className="relative mt-1 mb-5">
          <UserCheck className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
          <input
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none transition"
            placeholder="Type user ID..."
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleScan}
          disabled={loading}
          className={`w-full py-2.5 rounded-lg text-white font-medium transition shadow 
            ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Processing..." : "Submit Scan"}
        </button>
      </div>
    </div>
  );
}
