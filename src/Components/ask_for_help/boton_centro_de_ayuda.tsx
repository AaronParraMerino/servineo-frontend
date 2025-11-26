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
            router.push('/ask.for-help/centro_de_ayuda'); // ✅ BIEN: Es la ruta URL
 
        } else {
            setShowError(true);
        }
    };
};

export default BotonCentroAyuda;