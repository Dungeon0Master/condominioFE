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
  // 1. LÓGICA UNIFICADA: Recuperar Usuario Y Configurar Axios AL MISMO TIEMPO
  const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('user_data');
      const token = localStorage.getItem('token');

      // --- CORRECCIÓN CRÍTICA ---
      // Configuramos Axios AQUÍ, sincrónicamente.
      // Esto asegura que el token esté listo ANTES de que se renderice el Chat.
      if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
          delete axios.defaults.headers.common['Authorization'];
      }
      // ---------------------------

      return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
      setUser(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
      // Al hacer login manual, también aseguramos el header por si acaso
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
            <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;