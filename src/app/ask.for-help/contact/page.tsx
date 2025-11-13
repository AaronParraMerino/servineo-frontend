'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const ContactPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Página de Contacto
        </h1>
        <p className="text-gray-700 mb-6">
          Aquí irá el formulario o la información de contacto del soporte.  
          Por ahora, esta página sirve solo como redirección.
        </p>
        <button
          onClick={() => router.back()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
           Volver
        </button>
      </div>
    </div>
  );
};

export default ContactPage;
