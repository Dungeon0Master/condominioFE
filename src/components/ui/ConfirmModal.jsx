import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-fade-in-up border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icono de Alerta */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{title}</h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                    {message}
                </p>

                <div className="flex gap-3 justify-center">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => { onConfirm(); onClose(); }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-md transition-transform active:scale-95"
                    >
                        Sí, eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;