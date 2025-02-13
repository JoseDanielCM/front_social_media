import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../Components/LogoutButton";
import { useTheme } from '../Util/ThemeContext'

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { theme } = useTheme(); 

    useEffect(() => {
        axios
            .get("http://localhost:1234/api/user/me", { withCredentials: true })
            .then((response) => {
                setUser(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener usuario", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className="text-center text-gray-500">Cargando usuario...</p>;
    }

    if (!user) {
        return <p className="text-center text-red-500">No se pudo cargar el usuario.</p>;
    }

    return (
        <div id="profile" className={`md:ml-64 p-4 flex flex-col items-center min-h-screen ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className={`w-full max-w-3xl shadow-lg rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
                {/* Sección de perfil */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                        <img
                            src={user.profilePicture || "/public/userNoImage.webp"}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-2 border-gray-300"
                        />
                        <div>
                            <h2 className="text-xl font-bold">{user.username}</h2>
                            <p className="text-gray-600">{user.name}</p>
                            <p className="text-gray-500 text-sm mt-1 max-w-xs overflow-hidden"
                                style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    wordBreak: "break-word"
                                }}>
                                {user.bio || "No bio available"}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => navigate("/edit-profile")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Edit
                        </button>
                        <LogoutButton />
                    </div>
                </div>
            </div>

            {/* Espacio para publicaciones */}
            <div className="w-full max-w-3xl mt-6">
                <h3 className="text-lg font-semibold mb-4">Publicaciones</h3>
                <div className="grid grid-cols-3 gap-2">
                    {user.posts && user.posts.length > 0 ? (
                        user.posts.map((post, index) => (
                            <img
                                key={index}
                                src={post.imageUrl}
                                alt="Post"
                                className="w-full h-32 object-cover rounded-lg"
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">No hay publicaciones aún.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
