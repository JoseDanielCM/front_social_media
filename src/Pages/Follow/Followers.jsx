import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Followers({ theme }) {
    const [followers, setFollowers] = useState([]);
    const navigate = useNavigate();  // Para manejar la navegación del botón "Volver al perfil"

    useEffect(() => {
        axios
            .get("http://localhost:1234/api/user/followers", { withCredentials: true })
            .then((response) => {
                setFollowers(response.data);  // Asignamos los seguidores al estado
            })
            .catch((error) => {
                console.error("Error al obtener usuarios", error);
            });
    }, []);

    const handleBackToProfile = () => {
        navigate("/profile");  // Redirige al perfil del usuario
    };

    // Aquí manejamos las clases para el modo claro y oscuro
    const containerClasses = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
    const cardClasses = theme === "dark" ? "bg-gray-700 text-white border-gray-700" : "bg-gray-100 text-black border-gray-300";
    const textClasses = theme === "dark" ? "text-gray-400" : "text-gray-600";

    return (
        <div className={`md:ml-64 pl-5 pr-5 min-h-screen ${containerClasses}`}>
            <h2 className="text-2xl font-semibold mb-4">Followers</h2>
            <button
                onClick={handleBackToProfile}
                className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Back to profile
            </button>
            <div className="flex flex-col items-center">
                {followers.map((follower) => (
                    <div key={follower.id} className={`mb-4 w-full max-w-3xl p-4 border rounded-lg shadow-md flex items-center justify-between ${cardClasses}`}>
                        <img
                            src={follower.profile_picture}
                            alt={follower.username}
                            className="w-20 h-20 rounded-full mr-6"
                        />
                        <div className="flex flex-col">
                            <h3 className="text-2xl font-medium">{follower.username}</h3>
                            <p className={`${textClasses} text-lg`}>{follower.first_name}</p>
                        </div>
                        <div className="ml-auto">
                            <Link
                                to={`/view-profile/${follower.id}`}
                                className="mt-2 text-blue-500"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Followers;
