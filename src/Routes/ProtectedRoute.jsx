import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import {isAuthenticated} from "../Util/isAuthenticated"; // Importar la función de autenticación

const ProtectedRoute = () => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const valid = await isAuthenticated();
            setAuth(valid);
        };
        checkAuth();
    }, []);

    if (auth === null) return <p>Loading...</p>; // Mientras verifica el token

    return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
