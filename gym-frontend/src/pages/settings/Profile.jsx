// src/pages/settings/Profile.jsx
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {user ? (
        <div className="bg-white shadow p-4 rounded">
          <p><strong>UserID:</strong> {user.userId}</p>
          <p><strong>Email:</strong> {user.sub}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p>No user data.</p>
      )}
    </div>
  );
}
