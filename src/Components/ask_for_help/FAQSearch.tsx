'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface FAQSearchProps {
  onSearch: (query: string) => void;
}

// Límite máximo de caracteres para la búsqueda
const MAX_LENGTH = 100;

export const FAQSearch: React.FC<FAQSearchProps> = ({ onSearch }) => {
  // searchTermRaw: Almacena el valor exacto del input (incluyendo espacios iniciales/finales)
  const [searchTermRaw, setSearchTermRaw] = useState('');

  // Utilizamos useCallback para memoizar onSearch y evitar recrear la función innecesariamente
  const handleSearch = useCallback(onSearch, [onSearch]);
  
  // searchTermClean: El valor del input sin espacios al inicio ni al final, 
  // usado para disparar la búsqueda real.
  const searchTermClean = searchTermRaw.trim(); 

  useEffect(() => {
    // Aplicamos el debounce (300ms) para evitar llamadas excesivas a onSearch
    const debounceTimer = setTimeout(() => {
      // Disparamos la búsqueda solo si el valor limpio cambia
      handleSearch(searchTermClean);
    }, 300);

    // Función de limpieza para cancelar el timer si searchTermClean cambia antes de que se dispare
    return () => clearTimeout(debounceTimer);
    
  }, [searchTermClean, handleSearch]); // Se ejecuta cuando el texto de búsqueda relevante cambia

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // 1. Control del límite de 100 caracteres
    if (value.length > MAX_LENGTH) {
      value = value.substring(0, MAX_LENGTH);
    }
    
    // 2. Actualizamos el estado "raw" con el valor actual (permitiendo al usuario ver 
    //    los espacios que escribe en el campo de entrada)
    setSearchTermRaw(value);
    
    // NOTA: La función onSearch se llama automáticamente por el useEffect con el valor limpio (trimmed)
    // después del debounce.
  };

  return (
    <div className="relative w-full mb-8"> 
      {/* Icono de Búsqueda (Magnifying Glass) */}
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor" // Importante: Usa 'currentColor' para heredar el color
          className="w-5 h-5" // Ajusta el tamaño del icono
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
            clipRule="evenodd"
          />
        </svg>
      </span>

      {/* Campo de entrada */}
      <input
        type="text"
        placeholder="Buscar preguntas frecuentes..."
        value={searchTermRaw} // Muestra el valor raw
        onChange={handleChange}
        maxLength={MAX_LENGTH} // Límite de caracteres en el lado del cliente (HTML)
        className="
          w-full 
          p-3 
          pl-10 /* Espacio para el icono */
          border 
          border-gray-300 
          rounded-lg 
          shadow-sm 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          transition 
          duration-300
          text-black
          font-inter
        "
        aria-label={`Buscar preguntas frecuentes (máx. ${MAX_LENGTH} caracteres)`}
      />
    </div>
  );
};