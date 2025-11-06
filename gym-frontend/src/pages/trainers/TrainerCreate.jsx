import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../api/userApi";
import { createTrainer } from "../../api/trainerApi";

export default function TrainerCreate() {
    const nav = useNavigate();

    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [certifications, setCertifications] = useState("");
    const [hireDate, setHireDate] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [employmentType, setEmploymentType] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const u = await getAllUsers();
        setUsers(u);
    };

    const save = async () => {
        if (!userId) {
            Swal.fire("Error", "Select user", "error");
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

            Swal.fire("Success", "Trainer created!", "success");
            nav("/trainers");

        } catch (err) {
            Swal.fire("Error", err.message || "Failed", "error");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Create Trainer</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <select
                    className="border p-2 rounded"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                >
                    <option value="">Select User</option>
                    {users.map(u => (
                        <option key={u.userId} value={u.userId}>
                            {u.firstName} {u.lastName}
                        </option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded"
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                >
                    <option value="">Select Specialization</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Weight Training">Weight Training</option>
                    <option value="Cardio">Cardio</option>
                    <option value="CrossFit">CrossFit</option>
                    <option value="Boxing">Boxing / Self-Defense</option>
                </select>

            </div>

            <select
                className="border p-2 rounded w-full mb-4"
                value={certifications}
                onChange={e => setCertifications(e.target.value)}
            >
                <option value="">Select Certifications</option>
                <option value="ACE Certified">ACE Certified</option>
                <option value="NASM CPT">NASM CPT</option>
                <option value="ISSA Trainer">ISSA Trainer</option>
                <option value="CSCS">CSCS</option>
                <option value="CPR Certified">CPR Certified</option>
            </select>


            <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                    type="date"
                    className="border p-2 rounded"
                    value={hireDate}
                    onChange={e => setHireDate(e.target.value)}
                />

                <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Hourly Rate"
                    value={hourlyRate}
                    onChange={e => setHourlyRate(e.target.value)}
                />
            </div>

            <select
                className="border p-2 rounded w-full mb-4"
                value={employmentType}
                onChange={e => setEmploymentType(e.target.value)}
            >
                <option value="">Select Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
            </select>

            <div className="flex gap-3 mt-4">
                <button
                    onClick={save}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Save Trainer
                </button>

                <button
                    onClick={() => nav("/trainers")}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
