import React from "react";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect
  };

  return (
    <div
      style={{
        width: "100%",
        height: "60px",
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <h2 style={{ fontSize: "18px", margin: 0 }}>Gym Management System</h2>

      <button
        onClick={handleLogout}
        style={{
          background: "#e11d48",
          color: "white",
          padding: "8px 18px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        Logout
      </button>
    </div>
  );
}
