// src/pages/classes/ClassCreate.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { createClassApi } from "/src/api/classApi.js";
import { getAllTrainers } from "/src/api/trainerApi.js";
import { getAllGyms } from "/src/api/gymApi.js";
import { getAllUsers } from "/src/api/userApi.js";

export default function ClassCreate() {
  const nav = useNavigate();

  const [trainers, setTrainers] = useState([]);
  const [gyms, setGyms] = useState([]);

  const [className, setClassName] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [gymId, setGymId] = useState("");
  const [classDate, setClassDate] = useState("");
  const [startTime, setStartTime] = useState(""); // "HH:mm"
  const [endTime, setEndTime] = useState("");     // "HH:mm"
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [ts, users, gs] = await Promise.all([
      getAllTrainers(),
      getAllUsers(),
      getAllGyms(),
    ]);

    // enrich trainers with user name + specialization
    const userMap = new Map(users.map(u => [u.userId, u]));
    const decorated = ts.map(t => {
      const u = userMap.get(t.userId);
      const name = u ? `${u.firstName} ${u.lastName}` : `User#${t.userId}`;
      return { ...t, label: `${name}${t.specialization ? ` (${t.specialization})` : ""}` };
    });

    setTrainers(decorated);
    setGyms(gs || []);
  };

  const save = async () => {
    if (!className) return Swal.fire("Error", "Class name is required", "error");
    if (!classDate) return Swal.fire("Error", "Class date is required", "error");
    if (!startTime || !endTime) return Swal.fire("Error", "Start & end time are required", "error");

    try {
      await createClassApi({
        className,
        trainerId: trainerId === "" ? null : Number(trainerId), // ← critical
        gymId: gymId === "" ? null : Number(gymId),             // ← critical
        classDate,
        startTime,
        endTime,
        capacity: capacity === "" ? null : Number(capacity),
      });
      Swal.fire("Success", "Class created", "success");
      nav("/classes");
    } catch (e) {
      Swal.fire("Error", e.message || "Create failed", "error");
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-bold mb-6">Create Class</h2>

      <input
        className="border p-3 rounded w-full mb-4"
        placeholder="Class Name"
        value={className}
        onChange={e => setClassName(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          className="border p-3 rounded"
          value={trainerId}
          onChange={e => setTrainerId(e.target.value)}
        >
          <option value="">Select Trainer (optional)</option>
          {trainers.map(t => (
            <option key={t.trainerId} value={t.trainerId}>{t.label}</option>
          ))}
        </select>

        <select
          className="border p-3 rounded"
          value={gymId}
          onChange={e => setGymId(e.target.value)}
        >
          <option value="">Select Gym (optional)</option>
          {gyms.map(g => (
            <option key={g.gymId} value={g.gymId}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          type="date"
          className="border p-3 rounded"
          value={classDate}
          onChange={e => setClassDate(e.target.value)}
        />
        <input
          type="time"
          className="border p-3 rounded"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
        />
        <input
          type="time"
          className="border p-3 rounded"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
        />
      </div>

      <input
        type="number"
        className="border p-3 rounded w-full mb-6"
        placeholder="Capacity"
        value={capacity}
        onChange={e => setCapacity(e.target.value)}
      />

      <div className="flex gap-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={save}>
          Save
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => nav("/classes")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
