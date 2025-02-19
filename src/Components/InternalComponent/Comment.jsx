import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

function Comment({ comment, theme ,originalUser : idUser, onDelete  }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:1234/api/comments/userByCommentId/${comment.id}`,
                    { withCredentials: true }
                );
                
                
                setUser(response.data);
                console.log("------------------------------------------------");
                console.log(response.data);    
                console.log(idUser);
                    
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

    const highlightMentions = (content) => {
        const mentionRegex = /@([a-zA-Z0-9_]+)/g;
        return content.split(mentionRegex).map((part, index) => {
            if (index % 2 === 1) {
                return (
                    <span 
                        key={index} 
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleMentionClick(part)} 
                    >
                        @{part}
                    </span>
                );
            }
            return part;
        });
    };

    const handleMentionClick = async (mention) => {
        try {
            const response = await axios.get(`http://localhost:1234/api/user/getUser?username=${mention}`,{withCredentials:true});
            
            const userId = response.data.id;
            if (userId && userId !== idUser) {
                navigate(`/view-profile/${userId}`);
            }
        } catch (error) {
            console.error("Error al obtener el ID del usuario:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:1234/api/comments/deleteComment/${comment.id}`, {
                withCredentials: true
            });
            console.log("Comentario borrado con éxito");
            onDelete(); 
        } catch (error) {
            console.error("Error al borrar el comentario", error);
        }
    };

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
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {highlightMentions(comment.content)}
                </p>         
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{formattedDate}</p>
                {/* Mostrar el botón de borrar solo si el usuario es el mismo que el creador del comentario */}
                {user && user.id === idUser && (
                    <button 
                        onClick={handleDelete} 
                        className="mt-2 text-red-500 hover:text-red-700"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

export default Comment;
