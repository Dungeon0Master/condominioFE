import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    
    // Estados para controlar en qué paso estamos (1: Pedir Correo, 2: Pedir Código y Claves)
    const [step, setStep] = useState(1);
    
    // Datos del formulario
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    
    // Mensajes de feedback
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // PASO 1: Enviar el correo para recibir el código
    const handleRequestCode = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const response = await axiosClient.post('/forgot-password', { email });
            setMessage(response.data.message);
            setStep(2); // Pasamos a la pantalla de ingresar código
        } catch (err) {
            setError(err.response?.data?.message || 'Error al solicitar el código.');
        } finally {
            setIsLoading(false);
        }
    };

    // PASO 2: Enviar el código y la nueva contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== passwordConfirmation) {
            return setError('Las contraseñas no coinciden.');
        }

        setIsLoading(true);

        try {
            const response = await axiosClient.post('/reset-password', {
                email,
                code,
                password,
                password_confirmation: passwordConfirmation
            });

            setMessage(response.data.message);
            
            // Si todo sale bien, lo mandamos al login después de 3 segundos
            setTimeout(() => navigate('/login'), 3000);

        } catch (err) {
            setError(err.response?.data?.message || 'Error al restablecer la contraseña.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-900">
            <div className="bg-[#FFF8E1] p-8 rounded-lg shadow-2xl w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-[#105D39] mb-6">
                    {step === 1 ? 'Recuperar Contraseña' : 'Ingresa tu Código'}
                </h2>

                {error && <div className="text-red-500 text-sm mb-4 text-center bg-red-100 p-2 rounded">{error}</div>}
                {message && <div className="text-green-600 text-sm mb-4 text-center bg-green-100 p-2 rounded font-bold">{message}</div>}

                {/* FORMULARIO PASO 1: Pedir Email */}
                {step === 1 && (
                    <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
                        <p className="text-sm text-gray-600 text-center mb-2">
                            Ingresa tu correo electrónico y te enviaremos un código de 6 dígitos.
                        </p>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1 text-sm">Email registrado</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="ej. juan@correo.com"
                                className="w-full p-3 rounded border border-gray-300 focus:border-brand-orange bg-white outline-none"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-brand-orange text-white font-bold py-3 rounded mt-2 hover:opacity-90 transition disabled:opacity-50"
                        >
                            {isLoading ? 'Enviando...' : 'Enviar Código'}
                        </button>
                        <div className="text-center mt-2">
                            <Link to="/login" className="text-sm text-gray-600 underline hover:text-black">
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </form>
                )}

                {/* FORMULARIO PASO 2: Ingresar Código y Nueva Contraseña */}
                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                        <p className="text-sm text-gray-600 text-center mb-2">
                            Enviamos un código a <strong>{email}</strong>
                        </p>
                        
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1 text-sm">Código de 6 dígitos</label>
                            <input 
                                type="text" 
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                maxLength={6}
                                placeholder="123456"
                                className="w-full p-3 rounded border border-gray-300 focus:border-brand-orange bg-white outline-none text-center tracking-widest font-bold text-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-1 text-sm">Nueva Contraseña</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full p-3 rounded border border-gray-300 focus:border-brand-orange bg-white outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-1 text-sm">Confirmar Contraseña</label>
                            <input 
                                type="password" 
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                minLength={8}
                                className="w-full p-3 rounded border border-gray-300 focus:border-brand-orange bg-white outline-none"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-brand-orange text-white font-bold py-3 rounded mt-2 hover:opacity-90 transition disabled:opacity-50"
                        >
                            {isLoading ? 'Guardando...' : 'Restablecer Contraseña'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;