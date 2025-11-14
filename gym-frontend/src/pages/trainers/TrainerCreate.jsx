import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../api/userApi";
import { createTrainer } from "../../api/trainerApi";
import { UserPlus, User, Briefcase, Award, Calendar, DollarSign, ClipboardCheck, ArrowLeft, Save } from "lucide-react";

export default function TrainerCreate() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [certifications, setCertifications] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

  // auto follow dark mode toggle from SystemLayout
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark"))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const u = await getAllUsers();
      setUsers(u);
    } catch (err) {
      Swal.fire("Error", "Failed to load users", "error");
    }
  };

  const save = async () => {
    if (!userId) {
      Swal.fire("Error", "Please select a user", "error");
      return;
    }

    try {
      await createTrainer({
        userId,
        specialization,
        certifications,
        hireDate,
        hourlyRate: parseFloat(hourlyRate),
        employmentType,
      });

      Swal.fire({
        icon: "success",
        title: "Trainer Created",
        text: "Trainer has been successfully added!",
        showConfirmButton: false,
        timer: 1600,
      });

      navigate("/trainers");
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to create trainer", "error");
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center transition-colors duration-300">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-all">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <UserPlus className="text-green-600 dark:text-green-400" size={22} />
            Create New Trainer
          </h2>
          <button
            onClick={() => navigate("/trainers")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition text-sm"
          >
            <ArrowLeft size={16} /> Back to Trainers
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* User Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Select User *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={16} />
              <select
                className="pl-9 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:outline-none"
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
              <Briefcase className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={16} />
              <select
                className="pl-9 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:outline-none"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="">Select Specialization</option>
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
            Certifications
          </label>
          <div className="relative">
            <Award className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={16} />
            <select
              className="pl-9 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
            >
              <option value="">Select Certifications</option>
              <option value="ACE Certified">ACE Certified</option>
              <option value="NASM CPT">NASM CPT</option>
              <option value="ISSA Trainer">ISSA Trainer</option>
              <option value="CSCS">CSCS</option>
              <option value="CPR Certified">CPR Certified</option>
            </select>
          </div>
        </div>

        {/* Hire Date & Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Hire Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={16} />
              <input
                type="date"
                className="pl-9 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:outline-none"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Hourly Rate ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={16} />
              <input
                type="number"
                className="pl-9 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:outline-none"
                placeholder="Enter rate"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Employment Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Employment Type
          </label>
          <div className="relative">
            <ClipboardCheck className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={16} />
            <select
              className="pl-9 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={save}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            <Save size={18} /> Save Trainer
          </button>

          <button
            onClick={() => navigate("/trainers")}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition"
          >
            <ArrowLeft size={18} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
