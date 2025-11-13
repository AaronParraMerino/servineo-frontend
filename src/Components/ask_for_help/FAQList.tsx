// frontend/src/features/faq/components/FAQList.tsx
'use client';

import React from 'react';
import { FAQ } from './faq.types';
import { FAQItem } from './FAQItem';
// Eliminada: import styles from '../styles/faq.module.css';

interface FAQListProps {
  faqs: FAQ[];
  loading: boolean;
}

export const FAQList: React.FC<FAQListProps> = ({ faqs }) => {

  if (faqs.length === 0) {
    // Estilo de Estado Vacío
    return (
      <div className="text-center p-12 bg-gray-50 border border-gray-200 rounded-lg mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron resultados</h3>
        <p className="text-gray-600">
          Intenta con otras palabras clave o navega por todas las preguntas frecuentes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
      {faqs.map((faq) => (
        <FAQItem key={faq._id} faq={faq} />
      ))}
    </div>
  );
};