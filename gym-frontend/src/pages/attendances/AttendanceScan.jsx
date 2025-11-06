import { useState } from "react";
import { scanAttendance } from "../../api/attendanceApi";
import Swal from "sweetalert2";

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
        confirmButtonColor: "#3085d6",
        width: 480
      });

      setUserId("");

    } catch (err) {
      Swal.fire("Error", "Failed to scan", "error");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white shadow rounded-lg p-10 w-[450px]">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Attendance Scanner
        </h2>

        <label>User ID</label>
        <input
          className="border rounded w-full px-3 py-2 mt-1 mb-4"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <button
          onClick={handleScan}
          disabled={loading}
          className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Submit Scan"}
        </button>
      </div>
    </div>
  );
}
