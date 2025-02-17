import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import LogoutButton from "../../Components/LogoutButton";
import { useTheme } from '../../Util/ThemeContext';
import PostProfile  from "../../Components/Post/PostProfile";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);  // ⬅️ Estado para almacenar los posts
    const [isProfilePicValid, setIsProfilePicValid] = useState(true);
    const navigate = useNavigate();
    const { theme } = useTheme();

    const isImageUrlValid = async (url) => {
        try {
            const response = await axios.get(`http://localhost:1234/validate-image?url=${encodeURIComponent(url)}`
                , { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error validating image URL:', error);
            return false;
        }
    };

    const fetchUserData = () => {
        axios.get("http://localhost:1234/api/user/me", { withCredentials: true })
            .then((response) => {
                setUser(response.data);
                setPosts(response.data.posts);  // ⬅️ Guardamos los posts en el estado
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener usuario", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUserData();  // ⬅️ Llamamos a la función al montar el componente
    }, []);

    useEffect(() => {
        if (user) {
            isImageUrlValid(user.profile_picture).then(isValid => {
                setIsProfilePicValid(isValid);
            });
        }
    }, [user]);

    if (loading) {
        return <p className="text-center text-gray-500">Cargando usuario...</p>;
    }

    if (!user) {
        return <p className="text-center text-red-500">No se pudo cargar el usuario.</p>;
    }

    return (
        <div id="profile" className={`md:ml-64 p-4 pb-20 flex flex-col items-center min-h-screen ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className={`w-full max-w-3xl shadow-lg rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
                <div className="flex flex-col sm:flex-row items-center sm:justify-between w-full">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <img
                            src={isProfilePicValid ? user.profile_picture : "/public/userNoImage.webp"}
                            alt="Profile"
                            className="w-28 h-28 sm:w-24 sm:h-24 rounded-full border-2 border-gray-300"
                        />
                        <div className="text-center sm:text-left">
                            <h2 className="text-lg sm:text-xl font-bold">{user.username}</h2>
                            <p className="text-gray-400">{user.first_name}</p>
                            <p className="text-gray-500 text-sm mt-1 max-w-xs overflow-hidden"
                                style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    wordBreak: "break-word"
                                }}>
                                {user.bio || "No bio available"}
                            </p>
                            <p className="text-gray-400">{user.phone || "No phone number available"}</p>
                            <div className="mt-2">

                                <p className="text-gray-500 text-sm">
                                    <Link to="/followers">
                                        <strong>{user.followers.length || 0}</strong> followers
                                    </Link>
                                    {' || '}
                                    <Link to="/follows">
                                        <strong>{user.follows.length || 0}</strong> follows
                                    </Link>
                                </p>

                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                        <button
                            onClick={() => navigate("/edit-profile")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Edit
                        </button>
                        <LogoutButton />
                    </div>
                </div>
            </div>
            <div className="w-full max-w-3xl mt-6">
                <h3 className="text-lg font-semibold mb-4">Posts</h3>


                <div className="grid grid-cols-2 sm:grid-cols-2 gap-10">
                    {
                    user.posts && user.posts.length > 0 ? (
                        user.posts.map((post) => (
                            <PostProfile theme={theme} key={post.id} {...post} userAccount={user} refreshPosts={fetchUserData} />
                        ))

                    ) : (
                        <p className="text-gray-500">No Posts yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
