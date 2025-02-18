import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from "axios";
import { Link } from 'react-router-dom';  // Importa Link de react-router-dom

const NotificationComponent = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [notifications, setNotifications] = useState([]);

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

    useEffect(() => {
        let stompClient = null;

        const connectCallback = (frame) => {
            // console.log('Conectado:', frame);

            stompClient.subscribe('/topic/notifications', (message) => {
                try {
                    const notification = JSON.parse(message.body);


                    if (user && user.id === notification.userId) {
                    // Solo agregar la notificación si el ID coincide
                    setNotifications((prevNotifications) => [
                        ...prevNotifications,
                        { id: Date.now(), text: notification.message, userId: notification.userId, user: notification.user }
                    ]);

                    console.log(notification);
                    console.log(user); // Aquí puedes ver si 'user' es el correcto

                    // Eliminar notificación después de 5 segundos
                    setTimeout(() => {
                        setNotifications((prev) => prev.slice(1));
                    }, 5000);
                }


                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });
        };

        const stompConfig = {
            webSocketFactory: () => new SockJS('http://localhost:1234/ws', null, { withCredentials: true }),
            connectHeaders: {},
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: connectCallback,
            onStompError: (frame) => {
                console.error('Error en el broker:', frame.headers['message']);
                console.error('Detalles adicionales:', frame.body);
            }
        };

        stompClient = new Client(stompConfig);
        stompClient.activate();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [user]);

    // Función para cerrar manualmente una notificación
    const closeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    if (notifications.length === 0) return null;

    if (loading) {
        return <p className={theme === "dark" ? "text-white" : "text-black"}>Cargando usuario...</p>;
    }
    return (
        <div className="fixed top-5 right-5 space-y-2 z-50">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-between animate-fade-in"
                >
                    <Link to={`/view-profile/${notification.user.id}`}> 
                    <img className="w-10 h-10 rounded-full border-2 border-gray-300 mr-2" src={notification.user.profile_picture} alt="" />
                    </Link>
                    
                    <span>{notification.text}</span>
                    <button
                        className="ml-3 bg-white text-blue-500 rounded-full p-1 hover:bg-gray-200 transition"
                        onClick={() => closeNotification(notification.id)}
                    >
                        ✖
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationComponent;
