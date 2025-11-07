// frontend/src/features/faq/components/FAQSearch.tsx
'use client';

import React, { useState, useEffect } from 'react';
// Eliminada: import styles from '../styles/faq.module.css';

interface FAQSearchProps {
  onSearch: (query: string) => void;
}

export const FAQSearch: React.FC<FAQSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full mb-8"> 
      {/* Icono de Búsqueda */}
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-400">
        🔍
      </span>

      {/* Campo de entrada */}
      <input
        type="text"
        placeholder="Buscar preguntas frecuentes..."
        value={searchTerm}
        onChange={handleChange}
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
          duration-150
        "
        aria-label="Buscar preguntas frecuentes"
      />
    </div>
  );
};