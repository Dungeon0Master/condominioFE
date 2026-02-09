import React, { useRef } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

const LoadingButton = ({ isLoading, children, onClick, className, type = "button", variant = "primary" }) => {
    // Refs necesarios para 'nodeRef' (evita warnings en modo estricto de React)
    const helloRef = useRef(null);
    const goodbyeRef = useRef(null);
    const nodeRef = isLoading ? goodbyeRef : helloRef;

    const baseStyles = "flex items-center justify-center px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md active:scale-95";
    const variants = {
        primary: "bg-[#B85C9F] hover:bg-[#9d4d87] text-white",
        danger: "bg-red-500 hover:bg-red-600 text-white",
    };

    return (
        <button 
            type={type}
            onClick={onClick}
            disabled={isLoading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {/* SwitchTransition gestiona el cambio entre estado A y B */}
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={isLoading ? "loading" : "idle"} // La key le dice a React que son elementos distintos
                    nodeRef={nodeRef}
                    timeout={300}
                    classNames="fade" // Coincide con el CSS del Paso 1
                >
                    <div ref={nodeRef} className="flex items-center justify-center w-full">
                        {isLoading ? (
                             /* Estado Cargando */
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Procesando...</span>
                            </div>
                        ) : (
                            /* Estado Normal */
                            <span>{children}</span>
                        )}
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </button>
    );
};

export default LoadingButton;