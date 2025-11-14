// src/pages/classes/ClassCreate.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  User,
  Dumbbell,
  Calendar,
  AlarmClock,
  ClipboardList,
} from "lucide-react";

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [ts, users, gs] = await Promise.all([
        getAllTrainers(),
        getAllUsers(),
        getAllGyms(),
      ]);

      // show trainer name only (no specialization)
      const userMap = new Map((users || []).map((u) => [u.userId, u]));
      const decorated = (ts || []).map((t) => {
        const u = userMap.get(t.userId);
        const name = u ? `${u.firstName} ${u.lastName}` : `User#${t.userId}`;
        return { ...t, label: name };
      });

      setTrainers(decorated);
      setGyms(gs || []);
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!className?.trim()) {
      Swal.fire("Error", "Class name is required", "error");
      return false;
    }
    if (!classDate) {
      Swal.fire("Error", "Class date is required", "error");
      return false;
    }
    if (!startTime || !endTime) {
      Swal.fire("Error", "Start and end time are required", "error");
      return false;
    }
    // optional: ensure start < end
    if (startTime && endTime) {
      const s = startTime.split(":").map(Number);
      const e = endTime.split(":").map(Number);
      if (s[0] > e[0] || (s[0] === e[0] && s[1] >= e[1])) {
        Swal.fire("Error", "Start time must be before end time", "error");
        return false;
      }
    }
    return true;
  };

  const save = async () => {
    if (!validate()) return;

    try {
      await createClassApi({
        className: className.trim(),
        trainerId: trainerId === "" ? null : Number(trainerId),
        gymId: gymId === "" ? null : Number(gymId),
        classDate,
        startTime,
        endTime,
        capacity: capacity === "" ? null : Number(capacity),
      });

      Swal.fire({
        icon: "success",
        title: "Created",
        text: "Class created successfully",
        timer: 1300,
        showConfirmButton: false,
      });

      nav("/classes");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", e?.response?.data?.message || e.message || "Create failed", "error");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800 dark:text-gray-100">
          <ClipboardList className="text-blue-600 dark:text-blue-400" />
          Create Class
        </h2>

        {loading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading…</div>
        ) : (
          <>
            {/* Class Name */}
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Class Name
            </label>
            <input
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 rounded-lg w-full mb-4 text-gray-800 dark:text-gray-100"
              placeholder="e.g. Morning Fitness"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />

            {/* Trainer + Gym */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                  <User className="inline mr-1" size={14} /> Trainer (optional)
                </label>
                <select
                  className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 rounded-lg w-full text-gray-800 dark:text-gray-100"
                  value={trainerId}
                  onChange={(e) => setTrainerId(e.target.value)}
                >
                  <option value="">No trainer</option>
                  {trainers.map((t) => (
                    <option key={t.trainerId} value={t.trainerId}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                  <Dumbbell className="inline mr-1" size={14} /> Gym (optional)
                </label>
                <select
                  className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 rounded-lg w-full text-gray-800 dark:text-gray-100"
                  value={gymId}
                  onChange={(e) => setGymId(e.target.value)}
                >
                  <option value="">No gym</option>
                  {gyms.map((g) => (
                    <option key={g.gymId} value={g.gymId}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                  <Calendar className="inline mr-1" size={14} /> Date
                </label>
                <input
                  type="date"
                  className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 rounded-lg w-full text-gray-800 dark:text-gray-100"
                  value={classDate}
                  onChange={(e) => setClassDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                  <AlarmClock className="inline mr-1" size={14} /> Start Time
                </label>
                <input
                  type="time"
                  className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 rounded-lg w-full text-gray-800 dark:text-gray-100"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                  <AlarmClock className="inline mr-1" size={14} /> End Time
                </label>
                <input
                  type="time"
                  className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 rounded-lg w-full text-gray-800 dark:text-gray-100"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            {/* Capacity */}
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Capacity
            </label>
            <input
              type="number"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 rounded-lg w-full mb-6 text-gray-800 dark:text-gray-100"
              placeholder="e.g. 20"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
                onClick={() => nav("/classes")}
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
              >
                Save Class
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
