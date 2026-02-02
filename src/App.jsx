import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios'; 
import Login from './components/login'; 
import Chat from './components/Chat';
import MainLayout from './components/MainLayout';

const PlaceholderPage = ({ title }) => (
    <div className="p-10">
        <h1 className="text-4xl font-bold text-[#105D39] mb-4">{title}</h1>
        <p className="text-gray-500">Esta sección está en construcción.</p>
    </div>
);

function App() {
  const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('user_data');
      const token = localStorage.getItem('token');
      // Configuración inicial del header
      if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      return savedUser ? JSON.parse(savedUser) : null;
  });

  // 
  // Esto vigila todas las respuestas del servidor.
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response, // Si todo sale bien, deja pasar la respuesta
      (error) => {
        // Si el servidor responde 401 (No autorizado)
        if (error.response && error.response.status === 401) {
          console.log("Sesión caducada o inválida. Cerrando sesión...");
          
          // 1. Limpiamos almacenamiento local
          localStorage.removeItem('user_data');
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          
          // 2. Actualizamos estado para que React Router nos mande al Login
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    // Limpieza del interceptor al desmontar
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const handleLogin = (userData) => {
      setUser(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
      const token = localStorage.getItem('token');
      if(token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
            path="/login" 
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/chat" />} 
        />

        {user ? (
            <Route path="/" element={<MainLayout usuario={user} />}>
                <Route index element={<Navigate to="/chat" replace />} />
                <Route path="home" element={<PlaceholderPage title="Inicio" />} />
                <Route path="chat" element={<Chat usuarioActual={user} />} />
                <Route path="residentes" element={<PlaceholderPage title="Residentes" />} />
                <Route path="alertas" element={<PlaceholderPage title="Alertas" />} />
            </Route>
        ) : (
            // Esta ruta captura cualquier intento de entrar sin usuario y lo manda al login
            <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;