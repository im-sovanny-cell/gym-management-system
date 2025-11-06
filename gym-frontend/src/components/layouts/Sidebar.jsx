import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Divider
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const items = [
  { text: "Dashboard", to: "/dashboard" },
  { text: "Users", to: "/users" },
  { text: "Gyms", to: "/gyms" },
  { text: "Trainers", to: "/trainers" },
  { text: "Classes", to: "/classes" },
  { text: "Memberships", to: "/memberships" },
  { text: "Payments", to: "/payments" },
  { text: "Payrolls", to: "/payrolls" },
  { text: "Reports", to: "/reports" },
  { text: "Profile", to: "/profile" },
  { text: "Settings", to: "/settings" }
];

export default function Sidebar({ open, onClose }) {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const role = Number(localStorage.getItem("role")); // <-- GET role

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    nav("/login");
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{ "& .MuiDrawer-paper": { width: 240 } }}
    >
      <Toolbar />

      <List>

        {/* ONLY ADMIN can see this – role 1 */}
        {role === 1 && (
          <>
            <ListItemButton onClick={() => nav("/register")}>
              <ListItemText primary="Create User" />
            </ListItemButton>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {items.map((it) => (
          <ListItemButton
            key={it.to}
            selected={pathname === it.to}
            onClick={() => {
              nav(it.to);
              onClose?.();
            }}
          >
            <ListItemText primary={it.text} />
          </ListItemButton>
        ))}

        <Divider sx={{ my: 2 }} />

        <ListItemButton onClick={logout}>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
