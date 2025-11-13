// frontend/src/components/ask_for_help/FAQContact.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
// Eliminada: import styles from '../styles/faq.module.css';

export const FAQContact: React.FC = () => {
  const router = useRouter();

  const handleContactClick = () => {
    router.push('/ask.for-help/contact');
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center mt-10 shadow-lg">
      <h3 className="text-xl font-bold text-blue-800 mb-2">¿No encontraste lo que buscabas?</h3>
      <p className="text-blue-700 mb-4">
        Nuestro equipo de soporte está listo para ayudarte con cualquier consulta.
      </p>
      <button
        onClick={handleContactClick}
        className="
          bg-blue-600 hover:bg-blue-700 
          text-white font-semibold py-2 px-6 
          rounded-lg shadow-md 
          transition duration-300 ease-in-out
        "
        aria-label="Contactar con soporte"
      >
        Contacta soporte aquí 💬
      </button>
    </div>
  );
};