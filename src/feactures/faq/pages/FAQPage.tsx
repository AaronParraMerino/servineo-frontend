// frontend/src/features/faq/pages/FAQPage.tsx
'use client';

import React from 'react';
import { FAQBreadcrumb } from '../components/FAQBreadcrumb';
import { FAQSearch } from '../components/FAQSearch';
import { FAQCategoryFilter } from '../components/FAQCategoryFilter';
import { FAQList } from '../components/FAQList';
import { FAQContact } from '../components/FAQContact';
import { useFAQ } from '../hooks/useFAQ';
// Eliminada: import styles from '../styles/faq.module.css';

export const FAQPage: React.FC = () => {
  const { 
    faqs, 
    loading, 
    error, 
    selectedCategory,
    searchFAQs, 
    filterByCategory 
  } = useFAQ();

  return (
    // Contenedor principal de la página (equivalente a styles.faqPage)
    <div className="min-h-screen bg-gray-50 py-12">
      
      {/* Contenedor central (equivalente a styles.faqContainer) */}
      <div className="container mx-auto p-4 max-w-4xl bg-white shadow-xl rounded-xl">
        
        <FAQBreadcrumb />

        {/* Encabezado (equivalente a styles.faqHeader, styles.faqTitle, styles.faqSubtitle) */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Preguntas Frecuentes</h1>
          <p className="text-gray-500 mt-1">
            Encuentra respuestas rápidas a las dudas más comunes
          </p>
        </div>

        <FAQSearch onSearch={searchFAQs} />

        <FAQCategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={filterByCategory}
        />

        {/* Estado de Error (equivalente a styles.errorState) */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center space-x-2" role="alert">
            <span className="text-xl">⚠️</span>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        
        <FAQList faqs={faqs} loading={loading} />

        <FAQContact />
      </div>
    </div>
  );
};