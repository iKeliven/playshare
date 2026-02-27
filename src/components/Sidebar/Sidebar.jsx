// src/components/Sidebar/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import "./Sidebar.css";
import home from "/home.svg";
import userIcon from "/user.svg";
import heart from "/heart.svg";
import dashboard from "/dashboard.svg";
import logout from "/logout.svg";
import music from "/music.svg";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout: handleLogout, user } = useAuth();

  const links = [
    { to: "/home", icon: home, label: "Home" },
    { to: "/usuario", icon: userIcon, label: "Perfil" },
    { to: "/favoritos", icon: heart, label: "Favoritos" },
    { to: "/musicas", icon: music, label: "Músicas" },
    { to: "/playlists", icon: dashboard, label: "Playlists" },
  ];

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <aside className="ps-sidebar card-glass flex col jc-between ai-center">
      <div className="ps-sidebar__top flex center full">
        <div
          className="ps-sidebar__avatar b-pill b-neon-soft"
          aria-label="Avatar"
          title={user?.username || "Usuário"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 18,
            color: "#fff",
            background: "rgba(255,255,255,0.08)",
          }}
        >
          {(user?.username || "U").slice(0, 1).toUpperCase()}
        </div>
      </div>

      <nav className="ps-sidebar__nav flex col ai-center gap-24 full" aria-label="Menu lateral">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `ps-sidebar__link b-pill flex center ${isActive ? "is-active" : ""}`
            }
            title={l.label}
          >
            <img src={l.icon} alt={l.label} className="ps-sidebar__icon" />
          </NavLink>
        ))}
      </nav>

      <div className="ps-sidebar__bottom">
        <button
          className="ps-sidebar__link"
          type="button"
          title="Sair"
          onClick={handleLogoutClick}
        >
          <span className="ps-sidebar__icon" aria-hidden="true">
            <img src={logout} alt="Sair" />
          </span>
        </button>
      </div>
    </aside>
  );
}