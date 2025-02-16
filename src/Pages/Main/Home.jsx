import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../../Components/Post";

function Home({theme}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

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
        axios.get("http://localhost:1234/api/posts/getPosts", { withCredentials: true })
            .then(response => {
                setPosts(response.data);
                console.log(posts);
                
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener usuario", error);
                setLoading(false);
            });
    }, [user]);

    if (loading) {
        return <p className={theme === "dark" ? "text-white" : "text-black"}>Cargando usuario...</p>;
    }

    if (!user) {
        return <p className={theme === "dark" ? "text-white" : "text-black"}>No se pudo cargar el usuario.</p>;
    }

    return (
        <div className={`md:ml-64 md:pl-5 min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
    <h1>Bienvenido, {user.username}</h1>
    <h1>ID: {user.id}</h1>
    <div className="flex-1">
        {posts.map((post) => (
            <Post theme={theme} key={post.id} {...post} />
        ))}
    </div>
</div>

    );
}

export default Home;
