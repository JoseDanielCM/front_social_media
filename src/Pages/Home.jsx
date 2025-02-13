import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:1234/api/user/me", { withCredentials: true })
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener usuario", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Cargando usuario...</p>;
    }

    if (!user) {
        return <p>No se pudo cargar el usuario.</p>;
    }

    return (
        <div className="md:ml-64 md:pl-5">
            <h1>Bienvenido, {user.username}</h1>
            <h1>ID: {user.id}</h1>
        </div>
    );
}

export default Home;
