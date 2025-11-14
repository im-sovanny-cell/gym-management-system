import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ClipboardList,
  User,
  Dumbbell,
  Calendar,
  Search,
  ChevronDown,
} from "lucide-react";

import { createMembership } from "../../api/membershipApi";
import { getAllUsers } from "../../api/userApi";
import { getAllGyms } from "../../api/gymApi";

const PLAN_VALUES = ["daily", "monthly", "3-month", "yearly"];

export default function MembershipCreate() {
  const nav = useNavigate();

  const [users, setUsers] = useState([]);
  const [gyms, setGyms] = useState([]);

  const [userId, setUserId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [gymId, setGymId] = useState("");
  const [planType, setPlanType] = useState("monthly");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [u, g] = await Promise.all([getAllUsers(), getAllGyms()]);
        setUsers(u || []);
        setGyms(g || []);
        recalcEnd(startDate, planType);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trainers = useMemo(
    () => users.filter((u) => u.roleId === 3 || u.roleName === "TRAINER"),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const term = filterText.toLowerCase();
    return users.filter(
      (u) =>
        String(u.userId).includes(term) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(term)
    );
  }, [filterText, users]);

  const recalcEnd = (start, plan) => {
    if (!start) return setEndDate("");
    const s = new Date(start);
    let add = 30;
    if (plan === "daily") add = 1;
    if (plan === "3-month") add = 90;
    if (plan === "yearly") add = 365;
    const e = new Date(s);
    e.setDate(e.getDate() + add);
    setEndDate(e.toISOString().split("T")[0]);
  };

  const handleSelectMember = (member) => {
    setUserId(member.userId);
    setMemberName(`${member.firstName} ${member.lastName}`);
    setFilterText(`${member.userId}`);
    setDropdownOpen(false);
  };

  const handleInputChange = (val) => {
    setFilterText(val);
    setDropdownOpen(true);

    const found = users.find((u) => String(u.userId) === String(val));
    if (found) {
      setUserId(found.userId);
      setMemberName(`${found.firstName} ${found.lastName}`);
    } else {
      setUserId("");
      setMemberName("");
    }
  };

  const save = async () => {
    if (!userId)
      return Swal.fire("Error", "Please select or enter a valid member", "error");

    if (!PLAN_VALUES.includes(planType))
      return Swal.fire("Error", "Invalid plan type", "error");

    try {
      await createMembership({
        userId: Number(userId),
        trainerId: trainerId === "" ? null : Number(trainerId),
        gymId: gymId === "" ? null : Number(gymId),
        planType,
        startDate,
        endDate,
        status,
      });

      Swal.fire({
        icon: "success",
        title: "Created!",
        text: "Membership created successfully",
        timer: 1500,
        showConfirmButton: false,
      });
      nav("/memberships");
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || err.message || "Create failed",
        "error"
      );
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400 animate-pulse">
        Loading memberships...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800 dark:text-gray-100">
          <ClipboardList className="text-blue-600 dark:text-blue-400" />
          Create Membership
        </h2>

        {/* ✅ Member ID Search */}
        <div ref={dropdownRef} className="relative mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
            <User className="inline mr-1" size={14} /> Member ID *
          </label>

          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-3 bg-white dark:bg-gray-900">
            <Search className="text-gray-400 dark:text-gray-500 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Type or click to select member..."
              value={filterText}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setDropdownOpen(true)}
              className="flex-1 py-2 bg-transparent text-gray-800 dark:text-gray-100 outline-none"
            />
            <button
              type="button"
              onClick={() => setDropdownOpen((p) => !p)}
              className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          {dropdownOpen && (
            <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-sm animate-fadeIn">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <li
                    key={u.userId}
                    onClick={() => handleSelectMember(u)}
                    className="px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    #{u.userId} — {u.firstName} {u.lastName}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-500 dark:text-gray-400 italic">
                  No member found
                </li>
              )}
            </ul>
          )}
        </div>

        {memberName && (
          <p className="text-green-600 dark:text-green-400 text-sm mb-6">
            ✅ Selected: {memberName}
          </p>
        )}

        {/* Trainer */}
        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
          Trainer (optional)
        </label>
        <select
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-3 w-full mb-4 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
          value={trainerId}
          onChange={(e) => setTrainerId(e.target.value)}
        >
          <option value="">No trainer</option>
          {trainers.map((t) => (
            <option key={t.userId} value={t.userId}>
              {t.firstName} {t.lastName}
            </option>
          ))}
        </select>

        {/* Gym */}
        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
          <Dumbbell className="inline mr-1" size={14} /> Gym (optional)
        </label>
        <select
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-3 w-full mb-4 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
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

        {/* Plan */}
        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
          Plan Type
        </label>
        <select
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-3 w-full mb-4 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
          value={planType}
          onChange={(e) => {
            const v = e.target.value;
            setPlanType(v);
            recalcEnd(startDate, v);
          }}
        >
          {PLAN_VALUES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              <Calendar className="inline mr-1" size={14} /> Start Date
            </label>
            <input
              type="date"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-3 w-full text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
              value={startDate}
              onChange={(e) => {
                const v = e.target.value;
                setStartDate(v);
                recalcEnd(v, planType);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              End Date
            </label>
            <input
              type="date"
              className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 w-full text-gray-800 dark:text-gray-100 outline-none"
              value={endDate}
              readOnly
            />
          </div>
        </div>

        {/* Status */}
        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
          Status
        </label>
        <select
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-3 w-full mb-6 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="expired">expired</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition"
            onClick={() => nav("/memberships")}
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            Save Membership
          </button>
        </div>
      </div>
    </div>
  );
}
