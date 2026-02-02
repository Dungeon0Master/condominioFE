import React from 'react';
import { useNavigate } from 'react-router-dom';

// Iconos específicos para las notificaciones
const IconChat = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const IconAlert = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const IconUserRemove = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /></svg>;

const NotificationModal = ({ notifications, onClose, onMarkAsRead }) => {
    const navigate = useNavigate();

    const handleItemClick = (notif) => {
        onMarkAsRead(notif.id); // Marcar como leída/eliminar
        onClose(); // Cerrar modal
        navigate(notif.link); // Ir a la página
    };

    // Helper para obtener icono y titulo según el tipo
    const getIconAndTitle = (type) => {
        switch (type) {
            case 'chat': return { icon: <IconChat />, label: 'Chat' };
            case 'alert': return { icon: <IconAlert />, label: 'Movimiento detectado' };
            case 'system': return { icon: <IconUserRemove />, label: 'Sistema' };
            default: return { icon: <IconAlert />, label: 'Notificación' };
        }
    };

    return (
        // Fondo oscuro semitransparente (overlay)
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            
            {/* Contenedor del Modal (click.stopPropagation evita que se cierre al hacer click dentro) */}
            <div 
                className="bg-[#FFFBF0] w-[500px] max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl p-6 relative animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium text-gray-800">Notificaciones:</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Lista de Notificaciones */}
                <div className="flex flex-col gap-4">
                    {notifications.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No tienes notificaciones nuevas</p>
                    ) : (
                        notifications.map((notif) => {
                            const { icon, label } = getIconAndTitle(notif.type);
                            
                            return (
                                <div 
                                    key={notif.id} 
                                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
                                    onClick={() => handleItemClick(notif)}
                                >
                                    {/* Botón X pequeña para eliminar solo esta notificación */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onMarkAsRead(notif.id); }}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 text-gray-800 font-bold">
                                            {icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-sm mb-1">{label}</h3>
                                            <p className="text-gray-600 text-sm leading-snug">
                                                {notif.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;