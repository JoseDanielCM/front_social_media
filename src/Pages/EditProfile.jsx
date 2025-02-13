import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../Util/ThemeContext'

function EditProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        userId:0,
        name: '',
        lastname: '',
        bio: '',
        profilePhotoUrl: '',
        phoneNumber: '',
    });
    const navigate = useNavigate();
    const { theme } = useTheme(); 

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
        profileData.userId = user.id
        try {
            const response = await axios.put(
              'http://localhost:1234/api/profile', // Endpoint para actualizar el perfil
              profileData, // Datos que se van a enviar en el cuerpo de la solicitud
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: true, // Asegurarse de enviar cookies
              }
            );
            console.log('Perfil actualizado:', response.data);
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
                    name: userData.first_name,
                    lastname: userData.last_name,
                    bio: userData.bio || 'Sin biografia...',
                    profilePhotoUrl: userData.profile_picture || 'https://example.com/photo.jpg',
                    phoneNumber: userData.phone || '123456789',
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

    return (
        <div className="md:ml-64 md:pl-5">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">First Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="lastname">Last Name:</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={profileData.lastname}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="bio">Bio:</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="profilePhotoUrl">Profile Photo URL:</label>
                    <input
                        type="text"
                        id="profilePhotoUrl"
                        name="profilePhotoUrl"
                        value={profileData.profilePhotoUrl}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default EditProfile;
