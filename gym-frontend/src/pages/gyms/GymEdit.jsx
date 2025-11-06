// src/pages/gyms/GymEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getGymById, updateGym, deleteGym } from "../../api/gymApi";
import { getAllUsers } from "../../api/userApi";
import { KH_ADDRESS } from "../../data/kh_address.js";

export default function GymEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [ownerId, setOwnerId] = useState("");

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [commune, setCommune] = useState("");
  const [village, setVillage] = useState("");

  const [users, setUsers] = useState([]);

  const provinces = Object.keys(KH_ADDRESS);
  const districts = province ? Object.keys(KH_ADDRESS[province]) : [];
  const communes = province && district ? Object.keys(KH_ADDRESS[province][district]) : [];
  const villages =
    province && district && commune ? KH_ADDRESS[province][district][commune] : [];

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const g = await getGymById(id);

    setName(g.name);
    setOpeningHours(g.openingHours || "");

    // ownerId
    setOwnerId(g.ownerId == null ? "" : g.ownerId.toString());

    // split address → village, commune, district, province
    if (g.address) {
      const parts = g.address.split(",").map((x) => x.trim());
      setVillage(parts[0] || "");
      setCommune(parts[1] || "");
      setDistrict(parts[2] || "");
      setProvince(parts[3] || "");
    }

    const u = await getAllUsers();
    setUsers(u);
  };

  const save = async () => {
    const fullAddress = `${village}, ${commune}, ${district}, ${province}`;

    await updateGym(id, {
      name,
      address: fullAddress,
      ownerId: ownerId === "" ? null : Number(ownerId),
      openingHours,
    });

    Swal.fire("Success", "Gym updated", "success");
    nav("/gyms");
  };

  const remove = async () => {
    const r = await Swal.fire({
      icon: "warning",
      title: "Delete Gym?",
      text: "This action cannot be undone",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!r.isConfirmed) return;
    await deleteGym(id);
    Swal.fire("Deleted!", "", "success");
    nav("/gyms");
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-bold mb-6">Edit Gym</h2>

      {/* Gym name */}
      <input
        className="border p-2 rounded w-full mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Owner dropdown */}
      <select
        className="border p-2 rounded w-full mb-4"
        value={ownerId || ""}
        onChange={(e) => setOwnerId(e.target.value)}
      >
        <option value="">Select Owner (optional)</option>
        {users.map((u) => (
          <option key={u.userId} value={u.userId}>
            {u.firstName} {u.lastName}
          </option>
        ))}
      </select>

      {/* Opening hours */}
      <select
        className="border p-2 rounded w-full mb-4"
        value={openingHours || ""}
        onChange={(e) => setOpeningHours(e.target.value)}
      >
        <option value="">Opening Hours</option>
        <option value="05:00 - 21:00">05:00 - 21:00</option>
        <option value="06:00 - 22:00">06:00 - 22:00</option>
        <option value="07:00 - 23:00">07:00 - 23:00</option>
        <option value="24 hours">24 hours</option>
      </select>

      {/* Province */}
      <select
        className="border p-2 rounded w-full mb-4"
        value={province}
        onChange={(e) => {
          setProvince(e.target.value);
          setDistrict("");
          setCommune("");
          setVillage("");
        }}
      >
        <option value="">Province</option>
        {provinces.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* District */}
      <select
        className="border p-2 rounded w-full mb-4"
        value={district}
        onChange={(e) => {
          setDistrict(e.target.value);
          setCommune("");
          setVillage("");
        }}
        disabled={!province}
      >
        <option value="">District</option>
        {districts.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Commune */}
      <select
        className="border p-2 rounded w-full mb-4"
        value={commune}
        onChange={(e) => {
          setCommune(e.target.value);
          setVillage("");
        }}
        disabled={!district}
      >
        <option value="">Commune</option>
        {communes.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Village */}
      <select
        className="border p-2 rounded w-full mb-6"
        value={village}
        onChange={(e) => setVillage(e.target.value)}
        disabled={!commune}
      >
        <option value="">Village</option>
        {villages.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>

      <div className="flex gap-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={save}>
          Save
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => nav("/gyms")}>
          Cancel
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={remove}>
          Delete
        </button>
      </div>
    </div>
  );
}
