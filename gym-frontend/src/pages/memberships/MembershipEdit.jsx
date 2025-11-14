import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  getMembershipById,
  updateMembership,
  deleteMembership,
} from "../../api/membershipApi";

import { getAllUsers } from "../../api/userApi";
import { getAllGyms } from "../../api/gymApi";

import {
  Calendar,
  User,
  Dumbbell,
  ClipboardList,
  ChevronDown,
  Search,
  Trash2,
} from "lucide-react";

const PLAN_VALUES = ["daily", "monthly", "3-month", "yearly"];

export default function MembershipEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [users, setUsers] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const [userId, setUserId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [gymId, setGymId] = useState("");
  const [planType, setPlanType] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");

  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [m, u, g] = await Promise.all([
        getMembershipById(id),
        getAllUsers(),
        getAllGyms(),
      ]);

      setUsers(u);
      setGyms(g);
      setTrainers(u.filter((x) => x.roleId === 3 || x.roleName === "TRAINER"));

      setUserId(m.userId ?? "");
      setTrainerId(m.trainerId ?? "");
      setGymId(m.gymId ?? "");
      setPlanType(m.planType ?? "monthly");
      setStartDate(m.startDate ?? "");
      setEndDate(m.endDate ?? "");
      setStatus(m.status ?? "active");

      const member = u.find((x) => x.userId === m.userId);
      setMemberName(member ? `${member.firstName} ${member.lastName}` : "");
      setFilterText(m.userId);
    } finally {
      setLoading(false);
    }
  };

  const recalcEnd = (start, plan) => {
    if (!start) return;
    const d = new Date(start);
    const add =
      plan === "daily"
        ? 1
        : plan === "3-month"
        ? 90
        : plan === "yearly"
        ? 365
        : 30;

    d.setDate(d.getDate() + add);
    setEndDate(d.toISOString().split("T")[0]);
  };

  const filteredUsers = useMemo(() => {
  const key = String(filterText || "").toLowerCase();

  return users.filter(
    (u) =>
      String(u.userId).includes(key) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(key)
  );
}, [filterText, users]);


  const handleSelectMember = (user) => {
    setUserId(user.userId);
    setMemberName(`${user.firstName} ${user.lastName}`);
    setFilterText(`${user.userId}`);
    setDropdownOpen(false);
  };

  const handleInputChange = (val) => {
    setFilterText(val);
    setDropdownOpen(true);

    const found = users.find((u) => String(u.userId) === val);
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
      return Swal.fire("Error", "Please select a valid member", "error");

    await updateMembership(id, {
      userId,
      trainerId: trainerId || null,
      gymId: gymId || null,
      planType,
      startDate,
      endDate,
      status,
    });

    Swal.fire({
      icon: "success",
      title: "Saved!",
      text: "Membership updated successfully",
      timer: 1200,
      showConfirmButton: false,
    });

    nav("/memberships");
  };

  const remove = async () => {
    const yes = await Swal.fire({
      title: "Delete Membership?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!yes.isConfirmed) return;

    await deleteMembership(id);

    Swal.fire("Deleted!", "Membership removed successfully.", "success");

    nav("/memberships");
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-300">
        Loading...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <ClipboardList className="text-blue-500" />
          Edit Membership —{" "}
          {memberName ? (
            <span className="text-green-600">{memberName}</span>
          ) : (
            <span className="text-red-500">Member not found</span>
          )}
        </h2>

        {/* MEMBER DROPDOWN */}
        <div ref={dropdownRef} className="relative mb-6">
          <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
            <User size={14} className="inline mr-1" /> Member ID *
          </label>

          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-3 bg-white dark:bg-gray-900">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              value={filterText}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Type or select member..."
              className="flex-1 py-2 bg-transparent outline-none text-gray-800 dark:text-gray-100"
            />
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="ml-2 text-gray-500"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {dropdownOpen && (
            <ul className="absolute z-20 bg-white dark:bg-gray-800 w-full max-h-56 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg mt-1 shadow-lg">
              {filteredUsers.length ? (
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
                <li className="px-3 py-2 text-gray-500">Member not found</li>
              )}
            </ul>
          )}
        </div>

        {/* TRAINER */}
        <label className="block mb-1">Trainer (optional)</label>
        <select
          value={trainerId}
          onChange={(e) => setTrainerId(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
        >
          <option value="">No trainer</option>
          {trainers.map((t) => (
            <option key={t.userId} value={t.userId}>
              {t.firstName} {t.lastName}
            </option>
          ))}
        </select>

        {/* GYM */}
        <label className="block mb-1">Gym (optional)</label>
        <select
          value={gymId}
          onChange={(e) => setGymId(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
        >
          <option value="">No gym</option>
          {gyms.map((g) => (
            <option key={g.gymId} value={g.gymId}>
              {g.name}
            </option>
          ))}
        </select>

        {/* PLAN */}
        <label className="block mb-1">Plan Type</label>
        <select
          value={planType}
          onChange={(e) => {
            setPlanType(e.target.value);
            if (startDate) recalcEnd(startDate, e.target.value);
          }}
          className="w-full mb-4 p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
        >
          {PLAN_VALUES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                recalcEnd(e.target.value, planType);
              }}
              className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-800"
            />
          </div>
        </div>

        {/* STATUS */}
        <label className="block mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full mb-8 p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="expired">expired</option>
        </select>

        {/* BUTTONS */}
        <div className="flex justify-between">
          <button
            onClick={remove}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition shadow"
          >
            <Trash2 size={16} /> Delete
          </button>

          <div className="flex gap-3">
            <button
              className="bg-gray-500 hover:bg-gray-600 px-5 py-2 text-white rounded-lg"
              onClick={() => nav("/memberships")}
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 text-white rounded-lg shadow"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
