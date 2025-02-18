import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Post from "../../Components/Post";

function Home({ theme }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState("date");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:1234/api/user/me", { withCredentials: true })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error("Error al obtener usuario", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!user) return;

        const endpoint = sortBy === "date" 
            ? `http://localhost:1234/api/posts/getPostsByDate/${user.id}`
            : `http://localhost:1234/api/posts/getPostsByInteractions/${user.id}`;

        axios.get(endpoint, { withCredentials: true })
            .then(response => {
                setPosts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener posts", error);
                setLoading(false);
            });
    }, [user, sortBy]);

    if (loading) {
        return <p className={theme === "dark" ? "text-white" : "text-black"}>Cargando usuario...</p>;
    }

    if (!user) {
        return <p className={theme === "dark" ? "text-white" : "text-black"}>No se pudo cargar el usuario.</p>;
    }

    return (
        <div className={`md:ml-64 pb-20 md:p-5 md:pl-5 min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            {/* Perfil en la esquina superior derecha */}
            <div 
                className="absolute top-4 right-4 flex items-center gap-2 cursor-pointer hover:opacity-80"
                onClick={() => navigate(`/profile`)}
            >
                <img 
                    src={user.profile_picture || "https://via.placeholder.com/40"} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                />
                <span className="font-semibold">{user.username}</span>
            </div>

            {/* Título de bienvenida */}
            <h1 className="text-2xl font-bold my-4 text-center mb-0 md:mb-8 pt-16 md:pt-0">Welcome, {user.username}</h1>

            {/* Botones de filtro */}
            <div className="flex gap-2 mb-6 mt-3 justify-center">
                <button 
                    className={`px-4 py-2 rounded ${sortBy === "date" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`} 
                    onClick={() => setSortBy("date")}
                >Chronological</button>
                <button 
                    className={`px-4 py-2 rounded ${sortBy === "popularity" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`} 
                    onClick={() => setSortBy("popularity")}
                >Popularity</button>
            </div>

            <div className="flex-1">
                {posts.length === 0 && <p className="text-center">No posts yet :(</p>}
                {posts.map((post) => (
                    <Post theme={theme} key={post.id} {...post} userAccount={user} />
                ))}
            </div>
        </div>
    );
}

export default Home;
