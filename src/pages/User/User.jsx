import { useMemo, useState } from "react";
import "./User.css";
import logo from '/logo_white.png'

export default function User() {
  const initial = useMemo(
    () => ({
      firstName: "Keliven",
      lastName: "Demarchi",
      birthDate: "2000-01-01",
      cpf: "000.000.000-00",
      email: "keliven@email.com",
      avatar: "/mock/avatar.jpg",
    }),
    []
  );

  const [form, setForm] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [isEditing, setIsEditing] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setDraft((p) => ({ ...p, [name]: value }));
  };

  const startEdit = () => {
    setDraft(form);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(form);
    setIsEditing(false);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setForm(draft);
    setIsEditing(false);
  };

  const avatarSrc = isEditing ? draft.avatar : form.avatar;

  return (
      <div className="user-page flex ">
        <div className="user-card">
          <img src={logo} alt="Playshare" className="logo" />
          <div className="user-top flex ai-center gap-16">
            <div className="user-avatarWrap b-pill ps-card top-18">
              <img className="user-avatar card-glass" src={avatarSrc} alt="Foto do usuário" />
            </div>

            <div className="user-topText ">
              <p className="user-title">Meu Perfil</p>
              <p className="user-subtitle">
                {form.firstName} {form.lastName}
              </p>
            </div>

            {!isEditing ? (
              <button type="button" className="ps-btn user-editBtn" onClick={startEdit}>
                Editar
              </button>
            ) : (
              <button type="button" className="btn-cancel user-editBtn" onClick={cancelEdit}>
                Cancelar
              </button>
            )}
          </div>

          <form className="form-signup user-form flex col gap-16 top-18" onSubmit={saveEdit}>
            <div className="grid-2 gap-12">
              <div className="field flex col gap-8">
                <p className="field-label">Nome</p>
                <input
                  className="ps-input"
                  name="firstName"
                  type="text"
                  value={draft.firstName}
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="field flex col gap-8">
                <p className="field-label">Sobrenome</p>
                <input
                  className="ps-input"
                  name="lastName"
                  type="text"
                  value={draft.lastName}
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid-2 gap-12">
              <div className="field flex col gap-8">
                <p className="field-label">Data de nascimento</p>
                <input
                  className="ps-input"
                  name="birthDate"
                  type="date"
                  value={draft.birthDate}
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="field flex col gap-8">
                <p className="field-label">CPF</p>
                <input
                  className="ps-input"
                  name="cpf"
                  type="text"
                  value={draft.cpf}
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="field flex col gap-8">
              <p className="field-label">E-mail</p>
              <input
                className="ps-input"
                name="email"
                type="email"
                value={draft.email}
                onChange={onChange}
                disabled={!isEditing}
              />
            </div>

            <div className="field flex col gap-8">
              <p className="field-label">Foto (URL)</p>
              <input
                className="ps-input"
                name="avatar"
                type="text"
                value={draft.avatar}
                onChange={onChange}
                disabled={!isEditing}
              />
            </div>

            <div className="user-actions">
              <button className="btn-cancel" type="button" onClick={cancelEdit} disabled={!isEditing}>
                Descartar
              </button>

              <button className="ps-btn" type="submit" disabled={!isEditing}>
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}