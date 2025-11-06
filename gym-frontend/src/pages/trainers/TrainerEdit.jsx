// src/pages/trainers/TrainerEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getTrainerById, updateTrainer, deleteTrainer } from "../../api/trainerApi";
import { getAllUsers } from "../../api/userApi";

export default function TrainerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [certifications, setCertifications] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const t = await getTrainerById(id);
    setUserId(t.userId);
    setSpecialization(t.specialization);
    setCertifications(t.certifications);
    setHireDate(t.hireDate);
    setHourlyRate(t.hourlyRate);
    setEmploymentType(t.employmentType);

    const u = await getAllUsers();
    setUsers(u);
  };

  const save = async () => {
    await updateTrainer(id, {
      userId,
      specialization,
      certifications,
      hireDate,
      hourlyRate: Number(hourlyRate),
      employmentType,
    });

    Swal.fire("Success", "Trainer updated!", "success");
    navigate("/trainers");
  };

  const remove = async () => {
    const r = await Swal.fire({
      icon: "warning",
      title: "Delete?",
      showCancelButton: true,
    });
    if (!r.isConfirmed) return;
    await deleteTrainer(id);
    Swal.fire("Deleted", "", "success");
    navigate("/trainers");
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-bold mb-6">Edit Trainer</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* USER */}
        <select className="border p-2 rounded" value={userId} onChange={e => setUserId(e.target.value)}>
          <option value="">Select User</option>
          {users.map(u => (
            <option key={u.userId} value={u.userId}>
              {u.firstName} {u.lastName}
            </option>
          ))}
        </select>

        {/* specialization dropdown */}
        <select className="border p-2 rounded" value={specialization} onChange={e => setSpecialization(e.target.value)}>
          <option value="">Specialization</option>
          <option value="Yoga">Yoga</option>
          <option value="Weight Training">Weight Training</option>
          <option value="Cardio">Cardio</option>
          <option value="CrossFit">CrossFit</option>
          <option value="Boxing">Boxing / Self-Defense</option>
        </select>
      </div>

      {/* Certifications */}
      <select className="border p-2 rounded w-full mb-4" value={certifications} onChange={e => setCertifications(e.target.value)}>
        <option value="">Certifications</option>
        <option value="ACE Certified">ACE Certified</option>
        <option value="NASM CPT">NASM CPT</option>
        <option value="ISSA Trainer">ISSA Trainer</option>
        <option value="CSCS">CSCS</option>
        <option value="CPR Certified">CPR Certified</option>
      </select>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="date" className="border p-2 rounded" value={hireDate} onChange={e => setHireDate(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Hourly Rate" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} />
      </div>

      <select className="border p-2 rounded w-full mb-6" value={employmentType} onChange={e => setEmploymentType(e.target.value)}>
        <option value="">Select Type</option>
        <option value="Full Time">Full Time</option>
        <option value="Part Time">Part Time</option>
        <option value="Contract">Contract</option>
      </select>

      <div className="flex gap-3">
        <button onClick={save} className="bg-blue-600 px-4 py-2 text-white rounded">Save Changes</button>
        <button onClick={() => navigate("/trainers")} className="bg-gray-500 px-4 py-2 text-white rounded">Cancel</button>
        <button onClick={remove} className="bg-red-600 px-4 py-2 text-white rounded">Delete</button>
      </div>
    </div>
  );
}
