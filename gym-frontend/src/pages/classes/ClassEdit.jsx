// src/pages/classes/ClassEdit.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  User,
  Dumbbell,
  Calendar,
  AlarmClock,
  ClipboardList,
  Trash2,
} from "lucide-react";

import { getClassById, updateClassApi, deleteClassApi } from "/src/api/classApi.js";
import { getAllTrainers } from "/src/api/trainerApi.js";
import { getAllGyms } from "/src/api/gymApi.js";
import { getAllUsers } from "/src/api/userApi.js";

export default function ClassEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [trainers, setTrainers] = useState([]);
  const [gyms, setGyms] = useState([]);

  const [className, setClassName] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [gymId, setGymId] = useState("");

  const [classDate, setClassDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const [dto, ts, users, gs] = await Promise.all([
        getClassById(id),
        getAllTrainers(),
        getAllUsers(),
        getAllGyms(),
      ]);

      const userMap = new Map(users.map((u) => [u.userId, u]));

      const decorated = ts.map((t) => {
        const u = userMap.get(t.userId);
        const name = u ? `${u.firstName} ${u.lastName}` : `User#${t.userId}`;
        return { ...t, label: name }; // removed specialization
      });

      setTrainers(decorated);
      setGyms(gs || []);

      setClassName(dto.className || "");
      setTrainerId(dto.trainerId ?? "");
      setGymId(dto.gymId ?? "");
      setClassDate(dto.classDate || "");
      setStartTime(dto.startTime || "");
      setEndTime(dto.endTime || "");
      setCapacity(dto.capacity ?? "");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      await updateClassApi(id, {
        className,
        trainerId: trainerId === "" ? null : Number(trainerId),
        gymId: gymId === "" ? null : Number(gymId),
        classDate,
        startTime,
        endTime,
        capacity: capacity === "" ? null : Number(capacity),
      });

      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Class updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      nav("/classes");
    } catch (e) {
      Swal.fire("Error", e.message || "Update failed", "error");
    }
  };

  const remove = async () => {
    const r = await Swal.fire({
      icon: "warning",
      title: "Delete this class?",
      text: "This action cannot be undone.",
      confirmButtonColor: "#d33",
      showCancelButton: true,
    });
    if (!r.isConfirmed) return;

    try {
      await deleteClassApi(id);
      Swal.fire("Deleted", "Class removed", "success");
      nav("/classes");
    } catch (e) {
      Swal.fire("Error", e.message || "Delete failed", "error");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400">
        Loading class...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">

        {/* Title */}
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <ClipboardList className="text-blue-600 dark:text-blue-400" />
          Edit Class — <span className="text-blue-600">{className}</span>
        </h2>

        {/* Class Name */}
        <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
          Class Name
        </label>
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 rounded-lg w-full mb-4 text-gray-800 dark:text-gray-100"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />

        {/* Trainer + Gym */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Trainer
            </label>
            <select
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 rounded-lg w-full text-gray-800 dark:text-gray-100"
              value={trainerId}
              onChange={(e) => setTrainerId(e.target.value)}
            >
              <option value="">No Trainer</option>
              {trainers.map((t) => (
                <option key={t.trainerId} value={t.trainerId}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Gym
            </label>
            <select
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 rounded-lg w-full text-gray-800 dark:text-gray-100"
              value={gymId}
              onChange={(e) => setGymId(e.target.value)}
            >
              <option value="">No Gym</option>
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
              <Calendar className="inline w-4 mr-1" /> Date
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
              <AlarmClock className="inline w-4 mr-1" /> Start Time
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
              <AlarmClock className="inline w-4 mr-1" /> End Time
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
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={remove}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <Trash2 size={16} /> Delete
          </button>

          <div className="flex gap-3">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              onClick={() => nav("/classes")}
            >
              Cancel
            </button>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
              onClick={save}
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
