import { X } from "lucide-react";
import { useState, useEffect } from "react";
import Comment from "./InternalComponent/Comment"; // Importamos el nuevo componente
import axios from "axios";

function CommentModal({ idUser, idPost, comments, onClose, theme }) {
    const [localComments, setLocalComments] = useState(comments);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    const [mentions, setMentions] = useState([]);


    useEffect(() => {
        setLocalComments(comments);
    }, [comments]);


    const handleChange = (e) => {
        const value = e.target.value;
        setNewComment(value)

        // Expresión regular para detectar palabras que comienzan con "@"
        const mentionPattern = /@(\w+)/g;
        const foundMentions = [...value.matchAll(mentionPattern)].map(match => match[1]);

        setMentions(foundMentions);
    };
    const handleAddComment = async () => {
        setMentions([]);
        if (newComment.trim() === "") return;

        if (newComment.length > 200) {
            return
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:1234/api/comments/postComment/${idPost}/${idUser}/${newComment}`,
                {},
                { withCredentials: true }
            );

            const newCommentFromAPI = response.data;

            setLocalComments([...localComments, newCommentFromAPI]);
            setNewComment("");

            // add mentions

            const MentionNotificationRequest = {
                comment_id: newCommentFromAPI.id,
                post_id: idPost,
                commenter_id: idUser,
                mentioned_users: mentions
            }

            console.log(MentionNotificationRequest);

            const responseMentions = await axios.post(
                `http://localhost:1234/api/notifications/notify-mentions`,
                MentionNotificationRequest,
                { withCredentials: true }
            );

            const mentionData = responseMentions.data;

            console.log(mentionData);
            
        } catch (error) {
            console.error("Error al agregar comentario:", error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }



    };

    return (
        <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-black/80' : 'bg-black/60'} flex justify-center items-center`}>
            <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} rounded-lg p-4 w-96 max-h-120 flex flex-col`}>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Comments</h2>
                    <button onClick={onClose} className={theme === 'dark' ? 'text-white' : 'text-black'}>
                        <X size={24} />
                    </button>
                </div>

                {/* Contenedor de comentarios con scroll */}
                <div className="flex-1 overflow-y-auto mt-4">
                    {localComments.length > 0 ? (
                        localComments.map((comment, index) => (
                            <Comment key={comment.id || index} comment={comment} theme={theme} mentions={mentions} />
                        ))
                    ) : (
                        <p className="text-gray-500">No Comments yet.</p>
                    )}
                </div>

                {/* Input y botón siempre visibles */}
                <div className="mt-4 pt-1">
                    <input
                        type="text"
                        placeholder="send a comment..."
                        className={`w-full border rounded-md p-2 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                        value={newComment}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <button
                        className={`w-full p-2 rounded-md mt-2 disabled:bg-gray-400 ${theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}`}
                        onClick={handleAddComment}
                        disabled={loading}
                    >
                        {loading ? "Comentando..." : "Comentar"}
                    </button>
                    <div>
                        <strong>Menciones detectadas:</strong> {mentions.join(", ")}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentModal;
