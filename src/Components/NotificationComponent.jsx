import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const NotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        let stompClient = null;

        const connectCallback = (frame) => {
            console.log('Conectado:', frame);

            stompClient.subscribe('/topic/notifications', (message) => {
                try {
                    const notification = JSON.parse(message.body);;
                    setNotifications((prevNotifications) => [
                        ...prevNotifications,
                        { id: Date.now(), text: notification.message, userId:notification.userId }
                    ]);

                    console.log(notification)

                    // Eliminar notificación después de 5 segundos
                    setTimeout(() => {
                        setNotifications((prev) => prev.slice(1));
                    }, 5000);

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
    }, []);

    // Función para cerrar manualmente una notificación
    const closeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-5 right-5 space-y-2 z-50">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-between animate-fade-in"
                >
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
