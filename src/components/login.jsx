import React, { useState } from 'react';
import axiosClient from '../axios'; 

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Ya no necesitas poner toda la URL, axiosClient sabe que es /api/login
            const response = await axiosClient.post('/login', {
                email: email,
                password: password
            });

            const token = response.data.access_token;
            const user = response.data.user;

            // Guardamos el token. El interceptor de axios.js se encargará de usarlo de ahora en adelante
            localStorage.setItem('token', token);
            
            onLogin(user);

        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                setError('Credenciales incorrectas.');
            } else if (err.response && err.response.status === 422) {
                setError('Por favor, verifica los datos ingresados.');
            } else {
                setError('Error de conexión.');
            }
        }
    };

    return (
        <div className="flex h-screen w-full font-sans">
            {/* Barra lateral decorativa solo para login */}
            <div className="hidden md:flex w-24 bg-[#E85D04] flex-col items-center py-6 shadow-xl z-10">
                 <div className="bg-white p-2 rounded-lg mb-1">
                    <svg className="w-6 h-6 text-[#E85D04]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <span className="text-white text-[10px] font-bold tracking-widest text-center">OUR<br/>COMUNITY</span>
            </div>

            {/* Área Principal con Fondo de Imagen */}
            <div className="flex-1 relative flex items-center justify-center bg-gray-900">
                {/* Imagen de fondo estilo condominios */}
                <div 
                    className="absolute inset-0 z-0 opacity-60"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>

                <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-12 px-6">
                    {/* Texto de Bienvenida */}
                    <h1 className="text-5xl md:text-7xl font-bold text-[#4ADE80] drop-shadow-lg text-center md:text-left">
                        Bienvenido
                    </h1>

                    {/* Tarjeta de Login (Color crema/beige del diseño) */}
                    <div className="bg-[#FFF8E1] p-8 rounded-lg shadow-2xl w-full max-w-sm">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {error && <div className="text-red-500 text-sm text-center font-bold bg-red-100 p-2 rounded">{error}</div>}

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1 text-sm">Email</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ej. juan@correo.com"
                                    className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:border-orange-500 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1 text-sm">Password</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="******"
                                    className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:border-orange-500 bg-white"
                                    required
                                />
                            </div>

                            <button type="submit" className="bg-[#333] text-white py-3 rounded mt-2 hover:bg-black transition font-medium">
                                Sign In
                            </button>

                            <div className="flex flex-col text-sm mt-2 gap-1 text-gray-600">
                                <a href="#" className="underline hover:text-black">Registrarse</a>
                                <a href="#" className="underline hover:text-black">Forgot password?</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;