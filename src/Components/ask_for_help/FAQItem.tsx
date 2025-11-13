// frontend/src/features/faq/components/FAQItem.tsx
'use client';

import React, { useState } from 'react';
import { FAQ } from './faq.types';
// Eliminada: import styles from '../styles/faq.module.css';

interface FAQItemProps {
  faq: FAQ;
}

// Mapeo de colores de Tailwind para las categorías
const getCategoryClasses = (categoria: string): { bg: string; text: string } => {
  const colors: Record<string, { bg: string; text: string }> = {
    problemas: { bg: 'bg-red-100', text: 'text-red-800' },
    servicios: { bg: 'bg-blue-100', text: 'text-blue-800' },
    pagos: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    general: { bg: 'bg-gray-100', text: 'text-gray-800' },
  };
  return colors[categoria] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

export const FAQItem: React.FC<FAQItemProps> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { bg, text } = getCategoryClasses(faq.categoria.toLowerCase());

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <button
        className="w-full text-left p-4 flex justify-between items-center focus:outline-none bg-white hover:bg-gray-50 transition duration-150"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq._id}`}
      >
        <div className="flex-1 pr-4">
          {/* Estilo de Chip/Pill para la categoría */}
          <span
            className={`
              text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider 
              ${bg} ${text} block w-fit mb-1
            `}
          >
            {faq.categoria}
          </span>
          <div className="text-base font-semibold text-gray-800">{faq.pregunta}</div>
        </div>
        
        {/* Icono de Acordeón con Rotación */}
        <span 
          className={`
            text-xl font-bold text-gray-500 transition-transform duration-300
            ${isOpen ? 'rotate-180' : 'rotate-0'}
          `}
        >
          ▼
        </span>
      </button>

      {/* La animación de despliegue suave requeriría una librería como headlessui/react o transiciones CSS/JS */}
      {isOpen && (
        <div
          id={`faq-answer-${faq._id}`}
          className="p-4 pt-0 border-t border-gray-100 text-gray-600 transition-all duration-300"
          role="region"
        >
          <div className="pt-3">{faq.respuesta}</div>
        </div>
      )}
    </div>
  );
};