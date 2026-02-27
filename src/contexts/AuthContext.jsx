import { createContext, useCallback, useMemo, useState } from "react";

const AuthContext = createContext();

const USERS_KEY = "playshare_users";
const AUTH_KEY = "playshare_auth";
const USER_KEY = "playshare_user";

const DEFAULT_CREDENTIALS = {
  username: "admin",
  password: "123456",
};

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const arr = Array.isArray(list) ? list : [];

    // garante admin
    const hasAdmin = arr.some((u) => u?.username === DEFAULT_CREDENTIALS.username);
    if (!hasAdmin) {
      arr.unshift({
        id: "user_admin",
        username: DEFAULT_CREDENTIALS.username,
        password: DEFAULT_CREDENTIALS.password,
        email: "admin@playshare.local",
      });
    }

    return arr;
  } catch {
    return [
      {
        id: "user_admin",
        username: DEFAULT_CREDENTIALS.username,
        password: DEFAULT_CREDENTIALS.password,
        email: "admin@playshare.local",
      },
    ];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    void 0;
  }
}

function loadSession() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : false;
  } catch {
    return false;
  }
}

function loadUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadSession());
  const [user, setUser] = useState(() => loadUser());
  const [users, setUsers] = useState(() => loadUsers());

  const login = useCallback(
    (username, password) => {
      const u = (username ?? "").trim();
      const p = String(password ?? "");
      if (!u || !p) return { success: false, error: "Preencha usuário e senha" };

      const found = users.find((x) => x?.username === u);
      if (!found || found.password !== p) {
        return { success: false, error: "Usuário ou senha incorretos" };
      }

      const userData = { id: found.id, username: found.username, email: found.email };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem(AUTH_KEY, JSON.stringify(true));
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      return { success: true };
    },
    [users]
  );

  const register = useCallback(
    (username, password, email) => {
      const u = (username ?? "").trim();
      const p = String(password ?? "");
      const e = (email ?? "").trim();

      if (!u || !p || !e) return { success: false, error: "Preencha todos os campos" };

      const exists = users.some((x) => x?.username === u);
      if (exists) return { success: false, error: "Usuário já existe" };

      const newUser = { id: `user_${Date.now()}`, username: u, password: p, email: e };
      const nextUsers = [newUser, ...users];
      setUsers(nextUsers);
      saveUsers(nextUsers);

      const userData = { id: newUser.id, username: newUser.username, email: newUser.email };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem(AUTH_KEY, JSON.stringify(true));
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      return { success: true };
    },
    [users]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, login, register, logout }),
    [isAuthenticated, user, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
