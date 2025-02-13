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
        className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    );
};

export default LogoutButton;
