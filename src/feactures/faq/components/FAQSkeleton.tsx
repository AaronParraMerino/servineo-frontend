// frontend/src/features/faq/components/FAQSkeleton.tsx
'use client';

import React from 'react';
// Eliminada: import styles from '../styles/faq.module.css';

export const FAQSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 mt-4">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="p-4 border border-gray-200 rounded-lg shadow-sm animate-pulse">
          {/* Línea principal (pregunta) */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          {/* Línea secundaria (categoría/texto más corto) */}
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
};