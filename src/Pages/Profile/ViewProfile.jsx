import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { isImageUrlValid } from '../../Util/validator'; // Ruta del archivo
import PostView from "../../Components/Post/PostView";

function ViewProfile({ theme }) {
    // profile user NOT ME
    const [user, setUser] = useState(null);
    const { user_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [isProfilePicValid, setIsProfilePicValid] = useState(true);
    const navigate = useNavigate();
    const [isFollowed, setIsFollowed] = useState(false);


    const [original, setOriginal] = useState(null);

    // get user online information
    useEffect(() => {
        axios.get("http://localhost:1234/api/user/me", { withCredentials: true })
            .then(response => {
                setOriginal(response.data);

            })
            .catch(error => {
                console.error("Error al obtener usuario", error);
            });
    }, []);

    // images validations
    useEffect(() => {
        if (user) {
            isImageUrlValid(user.profile_picture).then(isValid => {
                setIsProfilePicValid(isValid);
            });
        }
    }, [user]);



    useEffect(() => {
        // Cargar información del usuario y verificar si está siendo seguido

        const fetchUserData = async () => {
            try {
                // Primero, obtenemos el perfil del usuario
                const userResponse = await axios.get(`http://localhost:1234/api/user/getUser/${user_id}`, { withCredentials: true });
                setUser(userResponse.data);
                
                // Luego verificamos si está siendo seguido
                const followResponse = await axios.get(`http://localhost:1234/api/follows/isFollowed/${original.id}/${userResponse.data.id}`, { withCredentials: true });
                setIsFollowed(followResponse.data);
                
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener usuario y seguir:", error);
                setLoading(false);
            }
        };
    
        if (user_id, original) {
            fetchUserData();
        }
    }, [user_id, original]);

    const handleFollow = async () => {
        if (isFollowed) {
            // dejar de seguir
            axios.delete(`http://localhost:1234/api/follows/unfollow/${original.id}/${user.id}`, { withCredentials: true })
                .then(response => {
                    setIsFollowed(false);
                })
                .catch(error => {
                    console.error("Error al dejar de seguir usuario", error);
                });
        } else {

            // seguir
            axios.post(`http://localhost:1234/api/follows/follow/${original.id}/${user.id}`, {}, { withCredentials: true })
                .then(response => {
                    setIsFollowed(true);
                })
                .catch(error => {
                    console.error("Error al seguir usuario", error);
                });
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500">Cargando usuario...</p>;
    }

    if (!user) {
        return <p className="text-center text-red-500">No se pudo cargar el usuario.</p>;
    }

    return (
        <div id="profile" className={`md:ml-64 pb-20 p-4 flex flex-col items-center min-h-screen ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
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
                                    <strong>{user.followers.length || 0}</strong> followers
                                    {' || '}
                                    <strong>{user.follows.length || 0}</strong> follows
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                        <button
                            onClick={() => navigate('/profile')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Back to profile
                        </button>
                        <button
                            onClick={handleFollow}
                            className={`px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-700 focus:outline-none transition-all duration-300 cursor-pointer`}
                        >
                            {isFollowed ? "Unfollow" : "Follow"}
                        </button>

                    </div>
                </div>
            </div>
            <div className="w-full max-w-3xl mt-6">
                <h3 className="text-lg font-semibold mb-4">Posts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {
                        user.posts && user.posts.length > 0 ? (
                            user.posts.map((post) => (
                                <PostView theme={theme} key={post.id} {...post} userAccount={original} />
                            ))

                        ) : (
                            <p className="text-gray-500">No Posts yet.</p>
                        )}
                </div>
            </div>
        </div>

    )
}

export default ViewProfile