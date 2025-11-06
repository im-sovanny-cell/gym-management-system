// src/pages/gyms/Gyms.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllGyms } from "../../api/gymApi";

export default function Gyms() {
  const [gyms, setGyms] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const d = await getAllGyms();
      setGyms(d);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Gyms</h2>

        <button
          onClick={() => nav("/gyms/create")}
          className="bg-blue-600 px-4 py-2 text-white rounded"
        >
          + Create Gym
        </button>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-left">Opening Hours</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {gyms.map((g) => (
            <tr key={g.gymId} className="border-b hover:bg-gray-50">
              <td className="p-3">{g.name}</td>
              <td className="p-3">{g.address}</td>
              <td className="p-3">{g.openingHours}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => nav(`/gyms/${g.gymId}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
