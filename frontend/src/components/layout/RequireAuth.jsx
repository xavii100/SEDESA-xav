import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ( {page} ) => {
    const { auth } = useAuth();
    return (
        auth?.id_user ? <Outlet /> : <Navigate to="/sedesa/autenticacion" />
    );
};

export default RequireAuth;