// src/pages/classes/Classes.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getAllClasses, deleteClassApi } from "/src/api/classApi.js";
import { getAllTrainers } from "/src/api/trainerApi.js";
import { getAllGyms } from "/src/api/gymApi.js";
import { getAllUsers } from "/src/api/userApi.js";

export default function Classes() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [classes, trainers, users, gyms] = await Promise.all([
        getAllClasses(),
        getAllTrainers(),
        getAllUsers(),
        getAllGyms(),
      ]);

      // maps
      const userMap = new Map(users.map(u => [u.userId, u]));
      const trainerMap = new Map(
        trainers.map(t => [
          t.trainerId,
          {
            ...t,
            user: userMap.get(t.userId),
            label: `${(userMap.get(t.userId)?.firstName || "")} ${(userMap.get(t.userId)?.lastName || "")}${
              t.specialization ? ` (${t.specialization})` : ""
            }`.trim(),
          },
        ])
      );
      const gymMap = new Map(gyms.map(g => [g.gymId, g.name]));

      const result = classes.map((c, idx) => {
        const trainer = c.trainerId ? trainerMap.get(c.trainerId) : null;
        return {
          idx: idx + 1,
          classId: c.classId,
          className: c.className,
          trainerLabel: trainer ? trainer.label : "—",
          gymName: c.gymId ? gymMap.get(c.gymId) || "—" : "—",
          classDate: c.classDate || "—",
          time: c.startTime && c.endTime ? `${c.startTime}–${c.endTime}` : "—",
          capacity: c.capacity ?? "—",
        };
      });

      setRows(result);
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Failed to load classes", "error");
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
      title: "Delete class?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });
    if (!r.isConfirmed) return;
    try {
      await deleteClassApi(id);
      Swal.fire("Deleted", "Class removed", "success");
      load();
    } catch (e) {
      Swal.fire("Error", e.message || "Delete failed", "error");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Classes</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => nav("/classes/create")}
        >
          + Create Class
        </button>
      </div>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-50">
          <tr className="border-b">
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Class Name</th>
            <th className="p-3 text-left">Trainer</th>
            <th className="p-3 text-left">Gym</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-left">Capacity</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.classId} className="border-b">
              <td className="p-3">{r.idx}</td>
              <td className="p-3">{r.className}</td>
              <td className="p-3">{r.trainerLabel}</td>
              <td className="p-3">{r.gymName}</td>
              <td className="p-3">{r.classDate}</td>
              <td className="p-3">{r.time}</td>
              <td className="p-3">{r.capacity}</td>
              <td className="p-3 text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => nav(`/classes/${r.classId}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => remove(r.classId)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!loading && rows.length === 0 && (
            <tr>
              <td className="p-6 text-center text-gray-500" colSpan={8}>
                No classes yet
              </td>
            </tr>
          )}
          {loading && (
            <tr>
              <td className="p-6 text-center text-gray-500" colSpan={8}>
                Loading...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
