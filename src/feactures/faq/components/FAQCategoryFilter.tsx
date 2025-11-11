// frontend/src/features/faq/components/FAQCategoryFilter.tsx
'use client';

import React from 'react';
import { FAQCategoria } from '../types/faq.types';
// Eliminada: import styles from '../styles/faq.module.css';

interface FAQCategoryFilterProps {
  selectedCategory: FAQCategoria | 'all';
  onCategoryChange: (category: FAQCategoria | 'all') => void;
}

const categories = [
  { value: 'all', label: 'Todas', icon: '📝' },
  { value: FAQCategoria.PROBLEMAS, label: 'Problemas', icon: '🔨' },
  { value: FAQCategoria.SERVICIOS, label: 'Servicios', icon: '⚡' },
  { value: FAQCategoria.PAGOS, label: 'Pagos', icon: '💳' },
  { value: FAQCategoria.GENERAL, label: 'General', icon: 'ℹ️' },
];

export const FAQCategoryFilter: React.FC<FAQCategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
      {categories.map((category) => {
        const isActive = selectedCategory === category.value;
        const buttonClasses = isActive
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-600';

        return (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value as FAQCategoria | 'all')}
            className={`
              px-4 py-2 text-sm font-medium border-b-2 
              flex items-center space-x-2 transition duration-150 ease-in-out
              ${buttonClasses}
            `}
            aria-pressed={isActive}
          >
            <span className="text-base">{category.icon}</span>
            <span className="whitespace-nowrap">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
};