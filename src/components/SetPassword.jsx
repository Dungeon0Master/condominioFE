import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../axios';

const SetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Extraemos el token y email de la URL (lo que Laravel mandó por correo)
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== passwordConfirmation) {
            return setError('Las contraseñas no coinciden.');
        }

        try {
            await axiosClient.post('/set-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            setMessage('Contraseña creada con éxito. Redirigiendo al login...');
            setTimeout(() => navigate('/login'), 3000); // Lo mandamos al login tras 3 segundos

        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar la contraseña.');
        }
    };

    if (!token || !email) {
        return <div className="p-10 text-center text-red-500 font-bold">Enlace inválido o incompleto.</div>;
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-900">
            <div className="bg-[#FFF8E1] p-8 rounded-lg shadow-2xl w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-[#105D39] mb-6">Crear Contraseña</h2>
                
                <p className="text-sm text-gray-600 mb-4 text-center">
                    Configura la contraseña para: <br/><strong className="text-black">{email}</strong>
                </p>

                {error && <div className="text-red-500 text-sm mb-4 text-center bg-red-100 p-2 rounded">{error}</div>}
                {message && <div className="text-green-600 text-sm mb-4 text-center bg-green-100 p-2 rounded font-bold">{message}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    <button type="submit" className="bg-brand-orange text-white font-bold py-3 rounded mt-2 hover:opacity-90 transition">
                        Guardar y Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetPassword;