import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingButton from './ui/LoadingButton';
import AlertNotification from './ui/AlertNotification';
import ConfirmModal from './ui/ConfirmModal';

const Residentes = () => {
    // --- ESTADOS DE DATOS ---
    const [residentes, setResidentes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- ESTADOS DE UI ---
    const [isLoading, setIsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

    // --- ESTADOS DE MODALES ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // null = crear, obj = editar

    // Modal de Eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [residenteToDelete, setResidenteToDelete] = useState(null);

    // --- CARGAR DATOS ---
    useEffect(() => {
        fetchResidentes();
    }, []);

    const fetchResidentes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/residentes');
            setResidentes(response.data);
        } catch (error) {
            console.error("Error cargando residentes", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- LÓGICA DE ELIMINACIÓN ---
    const openDeleteModal = (id) => {
        setResidenteToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!residenteToDelete) return;

        const id = residenteToDelete;
        setActionLoading(id); // Spinner en el botón de la tabla

        try {
            await axios.delete(`/residentes/${id}`);
            
            setResidentes(prev => prev.filter(r => r.id !== id));
            setAlert({ show: true, message: 'Residente eliminado correctamente', type: 'success' });
        } catch (error) {
            setAlert({ show: true, message: 'Error al eliminar residente', type: 'error' });
        } finally {
            setActionLoading(null);
            setResidenteToDelete(null);
        }
    };

    // --- LÓGICA DE GUARDAR (CREAR / EDITAR) ---
    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        setActionLoading('save_modal'); // Spinner en el botón del modal

        try {
            if (currentUser) {
                // Editar
                await axios.put(`/residentes/${currentUser.id}`, data);
                setAlert({ show: true, message: 'Datos actualizados correctamente', type: 'success' });
            } else {
                // Crear
                await axios.post('/residentes', data);
                setAlert({ show: true, message: 'Residente registrado con éxito', type: 'success' });
            }
            
            await fetchResidentes(); // Recargar la tabla
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            // Si el backend devuelve mensaje de error específico (ej: email duplicado)
            const errorMsg = error.response?.data?.message || 'Error al guardar los datos';
            setAlert({ show: true, message: errorMsg, type: 'error' });
        } finally {
            setActionLoading(null);
        }
    };

    // --- FILTRADO ---
    const filteredResidentes = residentes.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.condominio?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-white h-full relative font-sans">
            {/* Alerta Flotante */}
            <AlertNotification 
                isVisible={alert.show} 
                message={alert.message} 
                type={alert.type} 
                onClose={() => setAlert({ ...alert, show: false })} 
            />

            {/* Modal de Confirmación de Borrado */}
            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="¿Eliminar Residente?"
                message="Esta acción borrará al usuario, sus datos personales y su acceso al sistema. ¿Deseas continuar?"
            />

            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#105D39]">Gestionar residentes</h1>
                
                <button 
                    onClick={() => { setCurrentUser(null); setIsModalOpen(true); }}
                    className="bg-brand-orange text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition-all shadow-md flex items-center gap-2 active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar Residente
                </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="mb-6 relative">
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o condominio..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 p-3 pl-10 rounded-lg border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-orange-200 outline-none text-gray-700 transition-all"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            {/* Tabla de Resultados */}
            <div className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-brand-orange text-white font-bold text-sm">
                            <th className="p-4">Nombre Completo</th>
                            <th className="p-4 text-center">Condominio</th>
                            <th className="p-4">Teléfono</th>
                            <th className="p-4">E-Mail</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="5" className="p-10 text-center text-gray-500 font-medium">Cargando residentes...</td></tr>
                        ) : filteredResidentes.length === 0 ? (
                            <tr><td colSpan="5" className="p-10 text-center text-gray-400">No se encontraron residentes.</td></tr>
                        ) : filteredResidentes.map((residente) => (
                            <tr key={residente.id} className="border-b border-gray-100 hover:bg-orange-50 transition-colors text-sm text-gray-700">
                                <td className="p-4 font-medium capitalize">{residente.name}</td>
                                <td className="p-4 font-bold text-gray-600 text-center">{residente.condominio || '-'}</td>
                                <td className="p-4">{residente.telefono || '-'}</td>
                                <td className="p-4 text-gray-500">{residente.email}</td>
                                <td className="p-4 flex justify-center gap-2">
                                    {/* Botón Editar */}
                                    <button 
                                        onClick={() => { setCurrentUser(residente); setIsModalOpen(true); }}
                                        className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors"
                                        title="Editar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    
                                    {/* Botón Eliminar (Abre Modal) */}
                                    <div className="w-9 h-9 flex items-center justify-center"> 
                                        {actionLoading === residente.id ? (
                                            <svg className="animate-spin h-5 w-5 text-brand-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <button 
                                                onClick={() => openDeleteModal(residente.id)}
                                                className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                                                title="Eliminar"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL DE FORMULARIO (AGREGAR/EDITAR) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
                    <div 
                        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg animate-fade-in-up border border-gray-100"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
                            {currentUser ? 'Editar Residente' : 'Agregar Residente'}
                        </h2>
                        
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            
                            {/* Fila 1: Nombre y Apellido Paterno */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nombre</label>
                                    <input 
                                        name="nombre" 
                                        defaultValue={currentUser?.raw_persona?.nombre} 
                                        required 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:border-brand-orange focus:bg-white outline-none transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Apellido Paterno</label>
                                    <input 
                                        name="apellido_p" 
                                        defaultValue={currentUser?.raw_persona?.apellido_p} 
                                        required 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:border-brand-orange focus:bg-white outline-none transition-colors" 
                                    />
                                </div>
                            </div>

                            {/* Fila 2: Apellido Materno y Condominio */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Apellido Materno</label>
                                    <input 
                                        name="apellido_m" 
                                        defaultValue={currentUser?.raw_persona?.apellido_m} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:border-brand-orange focus:bg-white outline-none transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Condominio</label>
                                    <input 
                                        name="condominio" 
                                        defaultValue={currentUser?.condominio} 
                                        required 
                                        placeholder="Ej: A4" 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:border-brand-orange focus:bg-white outline-none transition-colors" 
                                    />
                                </div>
                            </div>

                            {/* Fila 3: Celular y Email */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Celular</label>
                                    <input 
                                        name="celular" 
                                        defaultValue={currentUser?.telefono} 
                                        required 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:border-brand-orange focus:bg-white outline-none transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email (Login)</label>
                                    <input 
                                        name="email" 
                                        type="email" 
                                        defaultValue={currentUser?.email} 
                                        required 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:border-brand-orange focus:bg-white outline-none transition-colors" 
                                    />
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                
                                <LoadingButton 
                                    type="submit" 
                                    isLoading={actionLoading === 'save_modal'} 
                                    className="flex-1 bg-brand-orange hover:opacity-90 text-white shadow-md font-bold"
                                >
                                    {currentUser ? 'Actualizar' : 'Guardar'}
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Residentes;