import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

const NotificationItem = ({ notification, markAsRead, theme }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:1234/api/notifications/getUserByNotification/${notification.id}`, { withCredentials: true })
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener el usuario:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Cargando...</p>;

    // Mensaje personalizado según el tipo de notificación
    const renderNotificationText = () => {
        switch (notification.notification_type) {
            case "LIKE":
                return `${user?.username} le dio like a tu publicación.`;
            case "COMMENT":
                return `${user?.username} comentó en tu publicación.`;
            case "FOLLOW":
                return `${user?.username} comenzó a seguirte.`;
            case "MENTION":
                return `${user?.username} te mencionó en un comentario.`;
            default:
                return "Tienes una nueva notificación.";
        }
    };

    if (!user) {
        return <></>
    }

    return (
        <div
            key={notification.id}
            className={`${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                } p-4 rounded-md shadow-md flex justify-between items-center ${notification.is_read ? 'opacity-50' : ''}`}
        >
                <div className="flex items-center">
                    <Link to={`/view-profile/${user.id}`}>
                        <img
                            className={`w-10 h-10 rounded-full border-2 ${theme === 'dark' ? 'border-gray-500' : 'border-gray-300'
                                } mr-3`}
                            src={user.profile_picture}
                            alt="Perfil"
                        />
                    </Link>

                    <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
                        {renderNotificationText()}
                    </span>

                </div>

            {/* Add the created_at date here */}
            <div className="text-sm text-gray-500">
                {new Date(notification.created_at).toLocaleString()}
            </div>

            <button
                className={`${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                    } text-white px-3 py-1 rounded-md`}
                onClick={() => markAsRead(notification.id)}
            >
                {notification.is_read ? 'Read' : 'Mark as read'}
            </button>
        </div>


    );
};

export default NotificationItem;
