import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axiosClient from './axios'; 
import Login from './components/login'; 
import Chat from './components/Chat';
import MainLayout from './components/MainLayout';
import Residentes from './components/Residentes';
import SetPassword from './components/SetPassword';
import ForgotPassword from './components/ForgotPassword';
// IMPORTANTE: Aseguramos que la importación coincida con el nombre de tu archivo
import ProtectedRoutes from './components/ProtectedRoutes'; 

const PlaceholderPage = ({ title }) => (
    <div className="p-10">
        <h1 className="text-4xl font-bold text-[#105D39] mb-4">{title}</h1>
        <p className="text-gray-500">Esta sección está en construcción.</p>
    </div>
);

function App() {
  const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('user_data');
      return savedUser ? JSON.parse(savedUser) : null;
  });

  // Interceptor para detectar tokens vencidos
  useEffect(() => {
    const interceptor = axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log("Sesión caducada o inválida. Cerrando sesión...");
          localStorage.removeItem('user_data');
          localStorage.removeItem('token');
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => axiosClient.interceptors.response.eject(interceptor);
  }, []);

  const handleLogin = (userData) => {
      setUser(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/chat" replace />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 1er Nivel: Protege que el usuario esté logueado */}
        <Route element={<ProtectedRoutes user={user} />}>
            <Route path="/" element={<MainLayout usuario={user} />}>
                <Route index element={<Navigate to="/chat" replace />} />
                <Route path="chat" element={<Chat usuarioActual={user} />} />
                <Route path="home" element={<PlaceholderPage title="Inicio" />} />
                
                {/* 2do Nivel: Protege que el usuario ADEMÁS sea administrador */}
                <Route element={<ProtectedRoutes user={user} requireAdmin={true} />}>
                    <Route path="residentes" element={<Residentes />} />
                    <Route path="alertas" element={<PlaceholderPage title="Alertas" />} />
                </Route>
            </Route>
        </Route>

        {/* Captura cualquier ruta que no exista y manda al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;