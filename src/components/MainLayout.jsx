import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importante para la petición de logout
import echo from '../utils/echo'; 
import NotificationModal from './NotificationModal';

// ... (Tus iconos IconHome, IconUsers, etc. se quedan igual) ...
const IconHome = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const IconUsers = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const IconChat = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const IconAlert = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const IconBell = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const IconLogout = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const MainLayout = ({ usuario }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Estados para modales y menús
    const [showModal, setShowModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false); // NUEVO: Menú de usuario
    const [notifications, setNotifications] = useState([]);
    
    const isActive = (path) => location.pathname === path;

    // --- Lógica de Notificaciones (Igual que antes) ---
    useEffect(() => {
        const channel = echo.private('chat');
        channel.listen('.message.sent', (e) => {
            if (location.pathname === '/chat') return;
            const newNotification = {
                id: Date.now(),
                type: 'chat',
                content: `${e.user_name}: ${e.message}`,
                link: '/chat',
                timestamp: new Date()
            };
            setNotifications(prev => [newNotification, ...prev]);
        });
        return () => {
            channel.stopListening('.message.sent');
        };
    }, [location.pathname]);

    useEffect(() => {
        if (location.pathname === '/chat') {
            setNotifications(prev => prev.filter(n => n.type !== 'chat'));
        }
    }, [location.pathname]);

    // --- NUEVA Lógica de Logout ---
    const handleLogout = async () => {
        try {
            // 1. Avisar al backend para destruir el token (opcional, pero recomendado)
            await axios.post('/logout');
        } catch (error) {
            console.error("Error al cerrar sesión en servidor", error);
            // Incluso si falla el backend, procedemos a limpiar el frontend
        } finally {
            // 2. Limpieza total del frontend
            localStorage.removeItem('user_data');
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            
            // 3. Desconectar WebSockets para no recibir más eventos
            if (window.Echo) window.Echo.disconnect();

            // 4. Forzar recarga completa para ir al login limpio
            window.location.href = '/login';
        }
    };

    return (
        <div className="flex w-full h-screen bg-white overflow-hidden relative">
            
            {/* Modal de Notificaciones */}
            {showModal && (
                <NotificationModal 
                    notifications={notifications} 
                    onClose={() => setShowModal(false)}
                    onMarkAsRead={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
                />
            )}

            <aside className="w-24 bg-brand-orange flex flex-col items-center py-6 z-50 shrink-0 relative">
                
                {/* Logo */}
                <div className="mb-10 flex flex-col items-center">
                    <div className="bg-white p-2 rounded-lg mb-2 shadow-sm text-brand-orange">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <span className="text-white text-[10px] font-bold tracking-wide text-center leading-tight">Our<br/>Comunity</span>
                </div>

                {/* Navegación */}
                <nav className="flex-1 flex flex-col gap-8 w-full items-center">
                    <Link to="/home" className="flex flex-col items-center gap-1 group">
                        <div className={`p-2 rounded-lg transition-colors ${isActive('/home') ? 'bg-white/20 text-white' : 'text-white/80 group-hover:text-white'}`}>
                            <IconHome />
                        </div>
                        <span className={`text-[10px] ${isActive('/home') ? 'text-white font-bold' : 'text-white/80'}`}>Inicio</span>
                    </Link>

                    <Link to="/residentes" className="flex flex-col items-center gap-1 group">
                         <div className={`p-2 rounded-lg transition-colors ${isActive('/residentes') ? 'bg-white/20 text-white' : 'text-white/80 group-hover:text-white'}`}>
                            <IconUsers />
                        </div>
                        <span className={`text-[10px] ${isActive('/residentes') ? 'text-white font-bold' : 'text-white/80'}`}>Residentes</span>
                    </Link>

                    <Link to="/chat" className="flex flex-col items-center gap-1 group">
                        <div className={`p-2 rounded-lg transition-colors ${isActive('/chat') ? 'bg-white/20 text-white' : 'text-white/80 group-hover:text-white'}`}>
                            <IconChat />
                        </div>
                        <span className={`text-[10px] ${isActive('/chat') ? 'text-white font-bold' : 'text-white/80'}`}>Chat</span>
                    </Link>

                    <Link to="/alertas" className="flex flex-col items-center gap-1 group">
                         <div className={`p-2 rounded-lg transition-colors ${isActive('/alertas') ? 'bg-white/20 text-white' : 'text-white/80 group-hover:text-white'}`}>
                            <IconAlert />
                        </div>
                        <span className={`text-[10px] ${isActive('/alertas') ? 'text-white font-bold' : 'text-white/80'}`}>Alertas</span>
                    </Link>

                    <button onClick={() => setShowModal(true)} className="mt-4 text-white/80 hover:text-white relative">
                        <div className={`p-2 rounded-lg transition-colors ${showModal ? 'bg-white/20 text-white' : ''}`}>
                             <IconBell />
                        </div>
                        {notifications.length > 0 && (
                            <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full border border-brand-orange">
                                {notifications.length}
                            </span>
                        )}
                    </button>
                </nav>

                {/* --- PERFIL CON MENÚ DE LOGOUT --- */}
                <div className="mt-auto relative">
                    
                    {/* Menú Flotante (Popup) */}
                    {showUserMenu && (
                        <>
                            {/* Overlay transparente para cerrar al hacer click fuera */}
                            <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setShowUserMenu(false)}
                            ></div>
                            
                            {/* El menú en sí */}
                            <div className="absolute bottom-0 left-14 ml-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in-up border border-gray-100">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-bold text-gray-800 truncate">{usuario?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{usuario?.email}</p>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                    <IconLogout />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </>
                    )}

                    {/* Botón de Perfil (Trigger) */}
                    <button 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex flex-col items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none"
                    >
                        <div className={`w-10 h-10 rounded-full overflow-hidden border-2 bg-gray-200 transition-colors ${showUserMenu ? 'border-brand-orange ring-2 ring-white' : 'border-white'}`}>
                            <img src={`https://ui-avatars.com/api/?name=${usuario?.name || 'User'}&background=random`} alt="User" className="w-full h-full object-cover"/>
                        </div>
                        <span className="text-white text-[10px] font-medium max-w-[80px] truncate text-center">
                            {usuario?.name || 'Arturo'}
                        </span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 h-full overflow-hidden relative bg-white">
                <Outlet /> 
            </main>
        </div>
    );
};

export default MainLayout;