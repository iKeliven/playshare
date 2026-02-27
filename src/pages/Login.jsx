// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks";
import logo from "/logo_white.png";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = login(username, password);
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error || "Erro ao fazer login");
    }

    setLoading(false);
  };

  return (
    <div className="bg-app flex jc-center">
      <div className="login-card gap-30 card-glass round-bottom-xl">
        <img src={logo} alt="Playshare" className="logo" />
        <p className="ps-subtitle">Login</p>

        <form className="form-login gap-24 top-18" onSubmit={handleSubmit}>
          <div>
            <input
              className="ps-input"
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
            <small style={{ fontSize: "11px", color: "#999", marginTop: "4px", display: "block" }}>
              Padrão: admin
            </small>
          </div>

          <div>
            <input
              className="ps-input"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <small style={{ fontSize: "11px", color: "#999", marginTop: "4px", display: "block" }}>
              Padrão: 123456
            </small>
          </div>

          {error && (
            <div style={{ color: "#ff6b6b", fontSize: "14px", textAlign: "center" }}>
              {error}
            </div>
          )}

          <Link to="/recuperar" className="link-ps">
            Esqueci a senha
          </Link>

          <button className="ps-btn full top-18" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Acessar"}
          </button>

          <Link to="/cadastro" className="link-ps link-center">
            Não possuo cadastro
          </Link>
        </form>
      </div>
    </div>
  );
}