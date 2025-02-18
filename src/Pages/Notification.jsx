import React, { useEffect, useState } from 'react'; 
import axios from "axios";
import NotificationItem from './Main/NotificationItem'; // Importamos el nuevo componente

const Notification = ({ theme }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:1234/api/user/me", { withCredentials: true })
            .then(response => {
                setUser(response.data);
                return axios.get(`http://localhost:1234/api/notifications/getByUser/${response.data.id}`, { withCredentials: true });
            })
            .then(response => {
                const sortedNotifications = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                setNotifications(sortedNotifications);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener usuario o notificaciones", error);
                setLoading(false);
            });
    }, []);

    const markAsRead = async (id) => {
        setNotifications((prev) => prev.map(n => n.id === id ? { ...n, is_read: true } : n));

        console.log(id);
        
        await axios.put(`http://localhost:1234/api/notifications/markAsRead/${id}`, {}, { withCredentials: true });
        
        // Refrescamos la lista de notificaciones para mostrar el cambio

    };

    if (loading) return <p>Cargando usuario...</p>;

    return (
        <div className={`md:ml-64 pb-20 p-5 md:pl-5 min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h2 className="text-2xl font-bold mb-4">Notificaciones</h2>
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <p>No hay nuevas notificaciones</p>
                ) : (
                    notifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} markAsRead={markAsRead} theme={theme} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Notification;
