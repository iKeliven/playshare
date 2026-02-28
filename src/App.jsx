// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/Signup.jsx";
import Home from "./pages/Home/Home.jsx";
import UserPage from "./pages/User/UserPage.jsx";
import MusicPage from "./pages/Music/MusicsPage.jsx";
import FavoritesPage from "./pages/Favorites/FavoritesPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./style/ui-kit.css";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/cadastro" element={isAuthenticated ? <Navigate to="/home" replace /> : <SignUp />} />
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />

      {/* Rotas protegidas */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuario"
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/musicas"
        element={
          <ProtectedRoute>
            <MusicPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playlists"
        element={<Navigate to="/home" replace />}
      />
      <Route
        path="/favoritos"
        element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}