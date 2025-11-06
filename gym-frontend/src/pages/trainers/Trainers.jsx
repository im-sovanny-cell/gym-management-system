// src/pages/trainers/Trainers.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { getAllTrainers, deleteTrainer } from "../../api/trainerApi";
import { getAllUsers } from "../../api/userApi";

export default function Trainers() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [ts, us] = await Promise.all([
        getAllTrainers(),
        getAllUsers()
      ]);

      // join user full name
      const result = ts.map(t => {
        const u = us.find(x => x.userId === t.userId);
        return {
          ...t,
          fullName: u ? `${u.firstName} ${u.lastName}` : "(unknown)"
        };
      });

      setRows(result);
      setUsers(us);
    } catch (e) {
      Swal.fire("Error", "Failed to load trainers", "error");
    }
  };

  const remove = async (id) => {
    const c = await Swal.fire({
      title: "Confirm Delete",
      icon: "warning",
      showCancelButton: true,
    });
    if (!c.isConfirmed) return;

    try {
      await deleteTrainer(id);
      Swal.fire("Deleted", "", "success");
      load();
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Trainers</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => nav("/trainers/create")}
        >
          + Create Trainer
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Trainer Name</th>
            <th className="border p-2">Specialization</th>
            <th className="border p-2">Certifications</th>
            <th className="border p-2">Hire Date</th>
            <th className="border p-2">Hourly Rate</th>
            <th className="border p-2">Type</th>
            <th className="border p-2 w-[140px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((t, i) => (
            <tr key={t.trainerId}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{t.fullName}</td>
              <td className="border p-2">{t.specialization}</td>
              <td className="border p-2">{t.certifications}</td>
              <td className="border p-2">{t.hireDate}</td>
              <td className="border p-2">${t.hourlyRate}</td>
              <td className="border p-2">{t.employmentType}</td>
              <td className="border p-2 flex gap-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => nav(`/trainers/${t.trainerId}`)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => remove(t.trainerId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td className="text-center p-4" colSpan={8}>
                No trainers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
