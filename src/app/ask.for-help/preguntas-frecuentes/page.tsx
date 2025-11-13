// servineo-frontend/src/app/ask.for-help/preguntas-frecuentes/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';
import { FAQSearch } from '@/Components/ask_for_help/FAQSearch';
import { FAQCategoryFilter } from '@/Components/ask_for_help/FAQCategoryFilter';
import { FAQList } from '@/Components/ask_for_help/FAQList';
import { FAQContact } from '@/Components/ask_for_help/FAQContact';
import { useFAQ } from '@/Components/ask_for_help/useFAQ';

// ⬇️ CAMBIAR: export const FAQPage → export default function
export default function PreguntasFrecuentesPage() {
  const router = useRouter();
  
  const { 
    faqs, 
    loading, 
    error, 
    selectedCategory,
    searchFAQs, 
    filterByCategory 
  } = useFAQ();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Preguntas Frecuentes</h1>
          <p className="text-gray-600 text-lg">
            Encuentra respuestas rápidas a las dudas más comunes sobre Servineo
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          
          <FAQSearch onSearch={searchFAQs} />

          <FAQCategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={filterByCategory}
          />

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Results Count */}
          {!loading && faqs.length > 0 && (
            <p className="text-sm text-gray-500 mb-4">
              Mostrando {faqs.length} {faqs.length === 1 ? 'resultado' : 'resultados'}
            </p>
          )}

          <FAQList faqs={faqs} loading={loading} />

          <FAQContact />
        </div>
      </div>
    </div>
  );
}