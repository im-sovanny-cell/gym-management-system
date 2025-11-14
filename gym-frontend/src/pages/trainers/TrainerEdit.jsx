import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getTrainerById, updateTrainer, deleteTrainer } from "../../api/trainerApi";
import { getAllUsers } from "../../api/userApi";
import {
  Save,
  ArrowLeft,
  User,
  Dumbbell,
  Award,
  Calendar,
  DollarSign,
  Briefcase,
  Trash2,
} from "lucide-react";

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
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

  // 🔄 Sync dark mode from SystemLayout.jsx
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark"))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const t = await getTrainerById(id);
      setUserId(t.userId || "");
      setSpecialization(t.specialization || "");
      setCertifications(t.certifications || "");
      setHireDate(t.hireDate || "");
      setHourlyRate(t.hourlyRate || "");
      setEmploymentType(t.employmentType || "");

      const u = await getAllUsers();
      setUsers(u);
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to load trainer data", "error");
    }
  };

  const save = async () => {
    try {
      await updateTrainer(id, {
        userId,
        specialization,
        certifications,
        hireDate,
        hourlyRate: Number(hourlyRate),
        employmentType,
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Trainer information updated successfully.",
        confirmButtonColor: "#16a34a",
      });
      navigate("/trainers");
    } catch (err) {
      Swal.fire("Error", err.message || "Update failed", "error");
    }
  };

  const remove = async () => {
    const c = await Swal.fire({
      title: "Delete this trainer?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg mx-1",
        cancelButton:
          "bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-lg mx-1",
      },
      buttonsStyling: false,
    });
    if (!c.isConfirmed) return;

    try {
      await deleteTrainer(id);
      Swal.fire("Deleted!", "Trainer removed successfully.", "success");
      navigate("/trainers");
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Dumbbell className="text-blue-600 dark:text-blue-400" size={22} /> Edit Trainer #{id}
          </h2>
          <button
            onClick={() => navigate("/trainers")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Trainer User
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <select
                className="pl-9 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 dark:text-gray-100"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.firstName} {u.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Specialization
            </label>
            <div className="relative">
              <Dumbbell className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <select
                className="pl-9 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 dark:text-gray-100"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="">Select specialization</option>
                <option value="Yoga">Yoga</option>
                <option value="Weight Training">Weight Training</option>
                <option value="Cardio">Cardio</option>
                <option value="CrossFit">CrossFit</option>
                <option value="Boxing">Boxing / Self-Defense</option>
              </select>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Certification
          </label>
          <div className="relative">
            <Award className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <select
              className="pl-9 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 dark:text-gray-100"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
            >
              <option value="">Select certification</option>
              <option value="ACE Certified">ACE Certified</option>
              <option value="NASM CPT">NASM CPT</option>
              <option value="ISSA Trainer">ISSA Trainer</option>
              <option value="CSCS">CSCS</option>
              <option value="CPR Certified">CPR Certified</option>
            </select>
          </div>
        </div>

        {/* Hire Date + Hourly Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="date"
              className="pl-9 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 dark:text-gray-100"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
            />
          </div>

          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="number"
              placeholder="Hourly Rate ($)"
              className="pl-9 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 dark:text-gray-100"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>
        </div>

        {/* Employment Type */}
        <div className="mb-6 relative">
          <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <select
            className="pl-9 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 dark:text-gray-100"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
          >
            <option value="">Select Employment Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={save}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            <Save size={18} /> Save Changes
          </button>
          <button
            onClick={() => navigate("/trainers")}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition"
          >
            <ArrowLeft size={18} /> Cancel
          </button>
          <button
            onClick={remove}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
