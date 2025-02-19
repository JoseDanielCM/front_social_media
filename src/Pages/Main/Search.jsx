import React, { useState, useRef, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

const SearchComponent = ({ theme }) => {
    const [original, setOriginal] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        axios.get("http://localhost:1234/api/user/me", { withCredentials: true })
            .then(response => {
                setOriginal(response.data);
            })
            .catch(error => {
                console.error("Error al obtener usuario", error);
            });
    }, []);

    const debouncedSearch = useCallback(
        debounce(async (term) => {
            if (!term.trim()) {
                setUsers([]);
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch(
                    `http://localhost:1234/api/user/search?username=${term}`,
                    { credentials: 'include' }
                );
                let data = await response.json();

                if (original) {
                    data = data.filter(user => user.id !== original.id);
                }

                setUsers(data);
            } catch (error) {
                console.error('Error al buscar usuarios:', error);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        [original]
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const containerClasses = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
    const cardClasses = theme === "dark" ? "bg-gray-700 text-white border-gray-700" : "bg-gray-100 text-black border-gray-300";
    const textClasses = theme === "dark" ? "text-gray-400" : "text-gray-600";
    const inputClasses = theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black";
    
    return (
        <div className={`md:ml-64 p-5 min-h-screen ${containerClasses}`}>
            <h1 className="text-2xl font-bold mb-4">SEARCH</h1>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by username"
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClasses}`}
                    autoFocus
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center mt-5">
                {users.length > 0 ? (
                    <div className='w-full flex flex-col items-center'>
                        {users.map((user) => (
                            <div key={user.id} className={`mb-4 w-full max-w-3xl p-4 border rounded-lg shadow-md flex items-center justify-between ${cardClasses}`}>
                                <img
                                    src={user.profile_picture}
                                    alt={user.username}
                                    className="w-20 h-20 rounded-full mr-6"
                                />
                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-medium">{user.username}</h3>
                                    <p className={`${textClasses} text-lg`}>{user.first_name}</p>
                                </div>
                                <div className="ml-auto">
                                    <Link
                                        to={`/view-profile/${user.id}`}
                                        className="mt-2 text-blue-500"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={textClasses}>Couldnt find users.</p>
                )}
            </div>
        </div>
    );
};

export default SearchComponent;
