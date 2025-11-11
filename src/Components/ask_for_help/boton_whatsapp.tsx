"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import ErrorMessage from './ErrorMessage';

const BotonWhatsapp = () => {
    const [showError, setShowError] = useState(false);

    const numerowhapi = "59179780871"; 
    const mensaje = ""; 
    const encodedMessage = encodeURIComponent(mensaje);
    const whatsappUrl = `https://wa.me/${numerowhapi}?text=${encodedMessage}`;

    const handleClick = () => {
        if (navigator.onLine) {
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        } else {
            setShowError(true);
        }
    };

    return (
        <> 
                <button
                    type="button"
                    onClick={handleClick}
                    className="flex items-center justify-center 
                               w-16 h-16
                               bg-[#2B31E0] hover:bg-[#2B6AE0] 
                               rounded-full shadow-lg 
                               transition duration-300 transform hover:scale-105 
                               cursor-pointer"
                    aria-label="Contactar por WhatsApp"
                >
                    <Image
                        src="/ask_for_help/whatsapplogoblanco.png" 
                        alt="Logo de WhatsApp"
                        width={48}
                        height={48}
                    />
                </button>
            

            {showError && (
                <ErrorMessage 
                    message="No se pudo abrir WhatsApp. Por favor, revisa tu conexión a internet."
                    onClose={() => setShowError(false)} 
                />
            )}
        </>
    );
};

export default BotonWhatsapp;