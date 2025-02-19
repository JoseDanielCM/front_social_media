import { useState, useEffect } from "react";
import { Heart, Orbit, Edit, Trash, Save, X } from "lucide-react";
import axios from "axios";
import CommentModal from "../../Components/CommentModal"; // Importamos el modal
import ImageModal from "../../Components/Post/ImageModal"; // Importamos el nuevo modal


function Post({ id, title, content, created_at, img_url, likes, comments, tags, theme, userAccount, refreshPosts }) {

    // id -> post id
    const [likesPage, setLikesPage] = useState(likes.length);
    const [liked, setLiked] = useState(false);
    // usuario que creo el post
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [postComments, setPostComments] = useState(comments);

    const [editing, setEditing] = useState(false)

    const [pTitle, setTitle] = useState(title);
    const [pContent, setContent] = useState(content);
    const [pImg, setImgUrl] = useState(img_url);

    const [editedTitle, setEditedTitle] = useState(title);
    const [editedContent, setEditedContent] = useState(content);
    const [editedImgUrl, setEditedImgUrl] = useState(img_url);

    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        console.log(tags);

        axios.get(`http://localhost:1234/api/posts/getUserByPost/${id}`, { withCredentials: true })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error("Error al obtener usuario del post", error);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (!user) return;

        axios.get(`http://localhost:1234/api/likes/userHaveLiked/${id}/${userAccount.id}`, { withCredentials: true })
            .then(response => {
                setLiked(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener usuario del post", error);
                setLoading(false);
            });
    }, [user]);

    const handleLike = async () => {
        if (!user) return;

        try {
            if (liked) {
                await axios.delete(`http://localhost:1234/api/likes/delete/${id}/${userAccount.id}`, {
                    withCredentials: true
                });
                setLikesPage(prev => prev - 1);
            } else {
                await axios.post(`http://localhost:1234/api/likes/add/${id}/${userAccount.id}`, {}, {
                    withCredentials: true
                });
                setLikesPage(prev => prev + 1);
            }
            setLiked(!liked);
        } catch (error) {
            console.error("Error al manejar like", error);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este post?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:1234/api/posts/delete/${id}`, { withCredentials: true });
            refreshPosts(id); 
        } catch (error) {
            console.error("Error al eliminar el post", error);
            alert("Hubo un error al eliminar el post");
        }
    };

    const handleEdit = async () => {
        setEditing(!editing);


        setEditedContent(pContent)
        setEditedTitle(pTitle)
        setEditedImgUrl(pImg)
    };

    const handleSubmit = async () => {
        try {
            const updatedPost = {
                title: editedTitle,
                content: editedContent,
                img_url: editedImgUrl,
            };
            console.log(updatedPost);

            await axios.put(`http://localhost:1234/api/posts/update/${id}`, updatedPost, {
                withCredentials: true, 
            });



            // Actualizar el estado
            setTitle(editedTitle);
            setContent(editedContent);
            setImgUrl(editedImgUrl);
            setEditing(false);

            // Restaurar los valores originales
            setEditedContent(pContent);
            setEditedTitle(pTitle);
            setEditedImgUrl(pImg);
        } catch (error) {
            console.error("Error al actualizar el post:", error);
        }
    };

    const updateComments = async () => {
        try {
            const response = await axios.get(`http://localhost:1234/api/comments/getByPost/${id}`
                , { withCredentials: true }

            );
            setPostComments(response.data); 
        } catch (error) {
            console.error("Error al actualizar comentarios", error);
        }
    };

    if (loading) {
        return <p className={theme === "dark" ? "text-white" : "text-black"}>Cargando datos...</p>;
    }

    return (
        <div className={`w-full mx-auto shadow-md rounded-lg p-4 mb-4 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"}`}>
            <div className="flex items-center mb-2">
                <img
                    src={user?.profile_picture || "/default-profile.png"}
                    alt={user?.username || "Usuario desconocido"}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-grow">
                    <p className="font-semibold">{user?.username || "Usuario desconocido"}</p>
                    <p className="text-xs text-gray-500">{new Date(created_at).toLocaleString()}</p>
                </div>

                <div className="flex space-x-2">
                    {/* Btn Edit */}
                    <button
                        className="bg-yellow-500 p-2 rounded-full hover:bg-yellow-600 transition duration-300"
                        onClick={handleEdit}
                    >
                        {editing ? (
                            <X size={20} color="white" />
                        ) : (
                            <Edit size={20} color="white" />
                        )
                        }
                    </button>

                    {/* Btn Delete */}
                    <button
                        className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition duration-300"
                        onClick={handleDelete}
                    >
                        <Trash size={20} color="white" />
                    </button>
                </div>
            </div>

            {/* TITLE  */}
            {editing ? (
                <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="w-full p-2 border rounded mb-2" />
            ) : (
                <h2 className="text-lg font-bold mb-2">{pTitle}</h2>
            )}

            {editing ? (
                <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full p-2 border rounded mb-2"></textarea>
            ) : (
                <p className="mb-2">{pContent}</p>
            )}

            {editing ? (
                <input type="text" value={editedImgUrl} onChange={(e) => setEditedImgUrl(e.target.value)} placeholder="URL de la imagen" className="w-full p-2 border rounded mb-2" />
            ) : (
                pImg && <img src={pImg} alt="Post image" className="w-full h-60 object-cover rounded-lg mt-2 cursor-pointer"
                    onClick={() => setShowImageModal(true)} />
            )}

            {showImageModal && <ImageModal imgUrl={img_url} onClose={() => setShowImageModal(false)} />}

            {/* Sección de Tags */}
            {tags && tags.length > 0 && (
                <div className="mt-2">
                    <div className="flex flex-wrap gap-2 mt-1">
                        {tags.map((tag, index) => (
                            <span key={index} className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex items-center mt-4 space-x-4">
                <button id="btnLike"
                    className={`flex items-center font-semibold space-x-1 ${liked ? 'text-red-500' : 'text-blue-500'}`}
                    onClick={handleLike}
                >
                    <Heart size={18} fill={liked ? "red" : "none"} /> <span>{likesPage}</span>
                </button>

                <button
                    className="flex items-center font-semibold space-x-1"
                    onClick={() => setShowComments(true)}
                >
                    <Orbit size={18} /> <span>{postComments.length} Comments</span>
                </button>


                {/* EDIT */}
                {editing && (
                    <button
                        className="flex items-center font-semibold space-x-1 text-green-400"
                        onClick={handleSubmit}
                    >
                        <Save size={18} /> <span>Save</span>
                    </button>
                )}
            </div>

            {showComments && (
                <CommentModal
                    theme={theme}
                    idUser={userAccount.id}
                    idPost={id}
                    comments={postComments}
                    onClose={() => {
                        setShowComments(false);
                        updateComments(); 
                    }}
                />
            )}
        </div>
    );
}

export default Post;