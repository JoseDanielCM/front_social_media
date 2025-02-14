import React, { useState, useRef, useCallback } from 'react';
import debounce  from 'lodash.debounce';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Crear función de búsqueda con debounce
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
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error al buscar usuarios:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Mantener el foco cuando el componente se monta
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Solo se ejecuta al montar

  return (
    <div className="md:ml-64 p-5">
      <h1 className="text-2xl font-bold mb-4">SEARCH</h1>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by username"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      <div className="mt-4">
        {users.length > 0 ? (
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {user.username}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No se encontraron usuarios.</p>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;