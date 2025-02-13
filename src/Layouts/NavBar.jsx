import { Home, User, BellRing, PlusCircle, Sun, Moon, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../Util/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
    { name: "Home", icon: Home, path: "/home" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Notifications", icon: BellRing, path: "/notification" },
    { name: "Add Post", icon: PlusCircle, path: "/post" },
    { name: "Search", icon: Search, path: "/search" },
];

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();
    const location = useLocation(); // Obtener la ruta actual
    const [notifications, setNotifications] = useState(3);
    const [active, setActive] = useState("");

    // Actualizar "active" cuando cambie la ubicación
    useEffect(() => {
        const currentItem = navItems.find(item => item.path === location.pathname);
        setActive(currentItem ? currentItem.name : "");
    }, [location.pathname]);

    return (
        <nav
            className={`fixed bottom-0 left-0 right-0 md:top-0 md:left-0 md:h-screen md:w-64 shadow-md md:shadow-lg transition-colors ${
                isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
        >
            <ul className="flex md:flex-col justify-around md:justify-start md:gap-8 p-2 md:p-4">
                {navItems.map(({ name, icon: Icon, path }) => (
                    <li key={name} className="w-full">
                        <button
                            onClick={() => navigate(path)}
                            className={`flex flex-col md:flex-row items-center md:items-start gap-2 p-2 w-full rounded-lg transition-colors ${
                                active === name
                                    ? isDark
                                        ? "bg-gray-800 text-blue-400"
                                        : "bg-gray-200 text-blue-600"
                                    : isDark
                                    ? "hover:bg-gray-700"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            <div className="relative">
                                <Icon size={24} />
                                {name === "Notifications" && notifications > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {notifications}
                                    </span>
                                )}
                            </div>
                            <span className="hidden md:block">{name}</span>
                        </button>
                    </li>
                ))}
                <li className="w-full">
                    <button
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        className={`flex flex-col md:flex-row items-center md:items-start gap-2 p-2 w-full rounded-lg transition-colors ${
                            isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                    >
                        {isDark ? <Sun size={24} /> : <Moon size={24} />}
                        <span className="hidden md:block">{isDark ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                </li>
                {/* Botón de Logout */}
                
            </ul>
        </nav>
    );
}
