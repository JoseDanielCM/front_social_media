import { useEffect, useState } from "react";
import axios from "axios";

function Comment({ comment, theme }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:1234/api/comments/userByCommentId/${comment.id}`,
                    { withCredentials: true }
                );
                setUser(response.data);
            } catch (error) {
                console.error("Error al obtener usuario del comentario", error);
            }
        };

        fetchUser();
    }, [comment.id]);

    const formattedDate = new Date(comment.created_at).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    return (
        <div className={`flex items-start space-x-3 rounded-lg p-3 mb-2 
            ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
            <img
                src={user && user.profile_picture ? user.profile_picture : "/public/userNoImage.webp"}
                alt={user ? user.username : "Unknown User"}
                className="w-10 h-10 rounded-full"
            />
            <div className="space-y-1">
                <p className="text-sm font-semibold mb-0">{user ? user.username : "Unknown User"}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{comment.content}</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{formattedDate}</p>
            </div>
        </div>
    );
}

export default Comment;
