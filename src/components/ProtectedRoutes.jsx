import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ user, requireAdmin = false }) => {
    // 1. Validar si hay una sesión activa
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Validar si la ruta exige ser administrador
    if (requireAdmin && !user.admin) {
        return <Navigate to="/home" replace />; 
    }

    // Si pasa las validaciones, renderiza la vista
    return <Outlet />;
};

export default ProtectedRoutes;