import React, { useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

const AlertNotification = ({ message, type, isVisible, onClose }) => {
    const nodeRef = useRef(null);

    // Auto-cierre
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const bgColors = {
        success: "bg-green-100 border-green-500 text-green-700",
        error: "bg-red-100 border-red-500 text-red-700",
    };

    return (
        <CSSTransition
            in={isVisible}
            nodeRef={nodeRef}
            timeout={400}
            classNames="alert-slide" // Coincide con el CSS del Paso 1
            unmountOnExit // Importante: Elimina el div del DOM al terminar de salir
        >
            <div 
                ref={nodeRef}
                className={`fixed top-5 right-5 z-[100] border-l-4 p-4 rounded shadow-lg flex items-center gap-3 w-80
                ${bgColors[type] || bgColors.success}`}
            >
                <div>
                    {type === 'success' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm">{message}</p>
                </div>
                
                <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
        </CSSTransition>
    );
};

export default AlertNotification;