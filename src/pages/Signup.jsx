// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import logo from "/logo_white.png";
import signup_img from "/signup_img.png";
import "./Signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validações
    if (!formData.username.trim()) {
      setError("Usuário é obrigatório");
      return;
    }

    if (!formData.email.trim()) {
      setError("E-mail é obrigatório");
      return;
    }

    if (formData.email !== formData.confirmEmail) {
      setError("E-mails não coincidem");
      return;
    }

    if (!formData.password) {
      setError("Senha é obrigatória");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);

    const result = register(formData.username, formData.password, formData.email);
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error || "Erro ao criar conta");
    }

    setLoading(false);
  };

  return (
    <div className="bg-app w-100">
      <div className="bg-app-glass w-100 flex jc-between">
        <div className="signup-card flex col">
          <img src={logo} alt="Playshare" className="logo" />

          <p className="ps-subtitle top-18">Criar conta</p>
          <p className="ps-description top-18">
            Insira suas informações para fazer parte da Playshare.
          </p>

          <form className="form-signup gap-16 flex col" onSubmit={handleSubmit}>
            <div>
              <input
                className="ps-input"
                type="text"
                name="username"
                placeholder="Usuário"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <input
                className="ps-input"
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <input
                className="ps-input"
                type="email"
                name="confirmEmail"
                placeholder="Confirmar E-mail"
                value={formData.confirmEmail}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="grid-2 gap-16">
              <input
                className="ps-input"
                type="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <input
                className="ps-input"
                type="password"
                name="confirmPassword"
                placeholder="Confirmar senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div style={{ color: "#ff6b6b", fontSize: "14px", textAlign: "center" }}>
                {error}
              </div>
            )}

            <div className="btn-group gap-16 flex jc-center top-18">
              <Link to="/login" className="btn-cancel" style={{ textDecoration: "none", cursor: "pointer" }}>
                Cancelar
              </Link>

              <button type="submit" className="ps-btn" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>
          </form>
        </div>
        <div className="img-signup">
          <img src={signup_img} alt="Playshare" className="signup-img" />
        </div>
      </div>
    </div>
  );
}