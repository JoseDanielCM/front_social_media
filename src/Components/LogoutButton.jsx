import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:1234/auth/logout", {}, { withCredentials: true });
            navigate("/login"); // Redirige al login
        } catch (error) {
            console.error("Error during logout", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex flex-col md:flex-row items-center md:items-start gap-2 p-2 w-full rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            <LogOut size={24} />
            <span className="hidden md:block">Logout</span>
        </button>
    );
};

export default LogoutButton;
