// frontend/src/features/faq/components/FAQBreadcrumb.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
// Eliminada: import styles from '../styles/faq.module.css';

export const FAQBreadcrumb: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        <li className="flex items-center">
          {/* Usar una etiqueta <a> para una navegación HTML simple o externa */}
          <a href="/home.html" className="hover:text-blue-600 transition duration-150">
            Home
          </a>
        </li>
        <li className="text-gray-400" aria-hidden="true">
          <span className="mx-1">›</span>
        </li>
        <li className="flex items-center">
          <button onClick={() => router.push('/ask-for-help')} className="hover:text-blue-600 transition duration-150">
            Ask for Help
          </button>
        </li>
        <li className="text-gray-400" aria-hidden="true">
          <span className="mx-1">›</span>
        </li>
        <li className="flex items-center">
          <span className="font-semibold text-gray-700">Preguntas Frecuentes</span>
        </li>
      </ol>
    </nav>
  );
};