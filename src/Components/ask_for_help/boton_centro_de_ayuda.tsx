"use client";

import React, { useState } from 'react'; 
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ErrorMessage from './ErrorMessage';

const BotonCentroAyuda = () => {
    const router = useRouter();

    const [showError, setShowError] = useState(false);

    const handleHelpCenterClick = () => {
        if (navigator.onLine) {
            router.push('/ask.for-help/centro_de_ayuda/page.tsx'); // ✅ BIEN: Es la ruta URL
 
        } else {
            setShowError(true);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={handleHelpCenterClick}

                className="flex items-center justify-center 
                           w-16 h-16
                           bg-[#2B31E0] hover:bg-[#2B6AE0] 
                           rounded-full shadow-lg 
                           transition duration-300 transform hover:scale-105 
                           cursor-pointer"
                aria-label="Ir al Centro de Ayuda"
            >
                <Image
                        src="/ask_for_help/helpcenterblanco.png" 
                        alt="Logo de HelpCenter"
                        width={48}
                        height={48}
                />
            </button>

            {showError && (
                <ErrorMessage 
                    message="No se pudo abrir el Centro de Ayuda. Por favor, revisa tu conexión a internet."
                    onClose={() => setShowError(false)} 
                />
            )}
        </>
    );
};

export default BotonCentroAyuda;