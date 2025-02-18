import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditProfile({ theme }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        userId: 0,
        name: '',
        lastname: '',
        bio: '',
        profilePhotoUrl: '',
        phoneNumber: '',
    });
    const navigate = useNavigate();

    // Manejo de cambios en los campos de entrada
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Manejo de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        profileData.userId = user.id;
    
        try {
            const response = await axios.put(
                'http://localhost:1234/api/profile',
                profileData,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            console.log('Perfil actualizado:', response.data);
    
            // Actualizar estado del usuario
            setUser((prevUser) => ({
                ...prevUser,
                first_name: profileData.name,
                last_name: profileData.lastname,
                bio: profileData.bio,
                profile_picture: profileData.profilePhotoUrl,
                phone: profileData.phoneNumber,
            }));
    
            // Navegar después de actualizar el estado
            navigate("/profile");
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
        }
    };
    

    useEffect(() => {
        axios.get("http://localhost:1234/api/user/me", { withCredentials: true })
            .then(response => {
                const userData = response.data;
                setUser(userData);
                setProfileData({
                    name: userData.first_name || 'No name available...',
                    lastname: userData.last_name || 'No lastname available...',
                    bio: userData.bio || 'No bio available...',
                    profilePhotoUrl: userData.profile_picture || 'https://example.com/photo.jpg',
                    phoneNumber: userData.phone || 'No phone number avaliable',
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener usuario", error);
                setLoading(false);
            });

    }, []);

    if (loading) {
        return <p>Cargando usuario...</p>;
    }

    if (!user) {
        return <p>No se pudo cargar el usuario.</p>;
    }

    const inputClass = `w-full px-3 py-2 border rounded-md ${theme === "dark"
            ? "bg-gray-800 text-white border-gray-600 focus:border-blue-500"
            : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`

    return (
        <div className={`md:ml-64 p-4 flex flex-col items-center min-h-screen ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <h1 className="text-4xl font-bold mb-6">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastname" className="block text-sm font-medium">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={profileData.lastname}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        className={`${inputClass} h-32`}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="profilePhotoUrl" className="block text-sm font-medium">
                        Profile Photo URL
                    </label>
                    <input
                        type="text"
                        id="profilePhotoUrl"
                        name="profilePhotoUrl"
                        value={profileData.profilePhotoUrl}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full px-4 py-2 text-white font-medium rounded-md ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditProfile;
