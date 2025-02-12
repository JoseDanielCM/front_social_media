import axios from "axios";

export const isAuthenticated = async () => {
    try {
        await axios.post("http://localhost:1234/auth/validate", {}, {
            withCredentials: true // Permite que la cookie con el token se envíe automáticamente
        });

        return true; // El token en la cookie es válido
    } catch (error) {
        console.error("Error validando el token:", error);
        return false; // No está autenticado
    }
};
