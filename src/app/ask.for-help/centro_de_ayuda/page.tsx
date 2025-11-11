"use client"; // Marca el componente como un componente de cliente en Next.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
// Importamos los iconos de lucide-react
import { Home, User, Search, Star, HelpCircle } from 'lucide-react'; 

// --- 1. Definición de Tipos y Constantes ---

interface Suggestion {
    id: number;
    title: string;
    url: string;
}

interface SuggestionResponse {
    message: string;
    results: Suggestion[];
}

// Declaración para el entorno de Next.js
declare const process: any;

const getApiUrl = (endpoint: string) => {
    // CRÍTICO: Se corrigió la sintaxis de las plantillas literales (template literals)
    const apiPort = process.env.NEXT_PUBLIC_API_PORT || '3001'; 
    const isDevelopment = process.env.NODE_ENV === 'development';

    const baseUrl = isDevelopment 
        ? `http://localhost:${apiPort}/api` // Uso correcto de acentos graves
        : `https://tu-dominio-backend.com/api`; // Uso correcto de acentos graves

    return `${baseUrl}${endpoint}`;
};


// --- 2. Componente Principal del Centro de Ayuda ---
const CentroDeAyuda: React.FC = () => {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Función para mostrar mensajes temporales (No necesita ser useCallback)
    const showMessage = (msg: string) => {
        setMessage(msg);
        // Usa una referencia al timeout para poder limpiarlo si la función se llama varias veces
        const timeoutId = setTimeout(() => setMessage(''), 5000);
        return () => clearTimeout(timeoutId); // Función de limpieza
    };

    // Funcionalidades de Redirección (Simulación)
    const handleRedirect = useCallback((target: string, url: string | null = null) => {
        const finalUrl = url || `/${target.toLowerCase().replace(/\s/g, '-')}`;
        showMessage(`Redirigiendo a: ${target} (URL: ${finalUrl})`);
        console.log(`[REDIRECCIÓN] Navegando a: ${finalUrl}`);
        // En una app real de Next.js, usarías: useRouter().push(finalUrl)
    }, []); // Dependencia vacía

    // Memoizar las URLs de la API, ya que no cambian.
    const API_URL_SUGGEST = useMemo(() => getApiUrl('/suggest'), []); 
    const API_URL_SEARCH = useMemo(() => getApiUrl('/search'), []); 
    
    const handleSuggestionClick = useCallback((suggestion: Suggestion) => {
        handleRedirect(suggestion.title, suggestion.url);
        setSearchTerm(suggestion.title);
        setSuggestions([]); // Cierra el dropdown
    }, [handleRedirect]);
    
    const handleSearchSubmit = useCallback((event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => {
        if (event && 'preventDefault' in event) event.preventDefault(); 
        
        const query = searchTerm.trim();
        if (query.length > 0) {
            // Cierra las sugerencias
            setSuggestions([]); 

            // Simulación de búsqueda principal
            showMessage(`Búsqueda principal ejecutada para: "${query}". (Endpoint real: ${API_URL_SEARCH})`);
            handleRedirect(`Resultados de Búsqueda para "${query}"`);

        } else {
            showMessage('Por favor, ingresa un término de búsqueda.');
        }
    }, [searchTerm, handleRedirect, API_URL_SEARCH]);


    // Lógica para realizar la llamada a la API de sugerencias con debounce
    useEffect(() => {
        const query = searchTerm.trim();
        
        // Criterio para NO ejecutar la búsqueda
        if (query.length < 2) {
            setSuggestions([]);
            // Si estaba cargando, lo reseteamos inmediatamente
            if(isLoading) setIsLoading(false); 
            return;
        }

        const handler = setTimeout(async () => {
            setIsLoading(true);
            console.log(`[DEBUG] Enviando petición (Axios) a: ${API_URL_SUGGEST}?q=${query}`); 
            
            try {
                const response = await axios.get<SuggestionResponse>(`${API_URL_SUGGEST}?q=${query}`);
                
                const receivedSuggestions = response.data.results || [];

                // Solo actualizamos si el término de búsqueda sigue siendo el mismo 
                // para evitar race conditions, aunque el cleanup ya ayuda mucho.
                if (searchTerm.trim() === query) {
                    setSuggestions(receivedSuggestions);
                    if (receivedSuggestions.length > 0) {
                        console.log(`[EFFECT - ÉXITO] Sugerencias encontradas: ${receivedSuggestions.length}`);
                    }
                }
            } catch (error) {
                console.error('[EFFECT - ERROR] Error al obtener sugerencias (Axios):', error);
                setSuggestions([]);
            } finally {
                // Siempre quitamos el loading al final
                setIsLoading(false);
            }
        }, 300); // 300ms de debounce

        // Cleanup: Cancela el timeout anterior si el searchTerm cambia de nuevo antes de 300ms
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, API_URL_SUGGEST, isLoading]); // Dependencia: Se ejecuta cada vez que searchTerm cambia


    return (
        <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased flex justify-center items-start">
            <div className="w-full max-w-xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden mt-8 md:mt-12">
                
                {/* 1. Encabezado / Barra de Navegación Superior */}
                <header className="flex items-center justify-between p-4 bg-blue-700 text-white shadow-lg">
                    <div 
                        className="cursor-pointer p-1 rounded-full hover:bg-blue-800 transition"
                        onClick={() => handleRedirect('Home')}
                        aria-label="Ir a inicio"
                    >
                        <Home className="h-6 w-6" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Centro de Ayuda</h1>
                    <div 
                        className="cursor-pointer p-1 rounded-full hover:bg-blue-800 transition"
                        onClick={() => handleRedirect('Perfil')}
                        aria-label="Ir a perfil de usuario"
                    >
                        <User className="h-6 w-6" />
                    </div>
                </header>

                {/* 2. Sección de Búsqueda y Resultados */}
                <section className="p-6 relative">
                    <div className="relative">
                        {/* Ícono de Búsqueda / Loader */}
                        <button 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 p-1 rounded-full hover:bg-gray-200 transition"
                            onClick={() => handleSearchSubmit()} // Ejecuta la búsqueda principal al hacer clic
                            aria-label="Ejecutar búsqueda"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Search className="h-5 w-5 hover:text-blue-600 transition" />
                            )}
                        </button>
                        
                        {/* Campo de Input */}
                        <input 
                            type="text" 
                            placeholder="Buscar ayuda en Servineo..." 
                            aria-label="Buscador de ayuda"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => { 
                                if (e.key === 'Enter') handleSearchSubmit(e);
                            }}
                            className="w-full pl-12 pr-4 py-3 text-gray-800 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-inner"
                        />
                    </div>
                    
                    {/* 3. Dropdown de Sugerencias (Autocomplete) */}
                    {/* Usamos un div que anula el padding del padre para ser de borde a borde y se ajusta al width-full */}
                    {searchTerm.length >= 2 && suggestions.length > 0 && (
                        <div className="absolute z-10 w-[calc(100%-3rem)] mt-2 left-6 right-6"> 
                            <ul className="bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-100">
                                {suggestions.map((suggestion) => (
                                    <li 
                                        key={suggestion.id} 
                                        className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-150"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <p className="font-semibold truncate">{suggestion.title}</p>
                                        <p className="text-xs text-gray-400 truncate">{suggestion.url}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                {/* Mensaje de Feedback */}
                {message && (
                    <div className="mx-6 mb-4 p-3 bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-sm font-medium transition-opacity duration-300">
                        {message}
                    </div>
                )}
                
                {/* 4. Contenido Principal: Opciones de Ayuda */}
                <main className="p-6 pt-0">
                    {/* Solo mostramos las tarjetas si no hay búsqueda activa ni sugerencias visibles */}
                    {(searchTerm.length < 2 && suggestions.length === 0) && (
                        <div className="space-y-4">
                            
                            {/* Tarjeta 1: Publicaciones Populares */}
                            <button 
                                className="w-full flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-md transition hover:shadow-lg hover:scale-[1.01] duration-200 text-left hover:bg-blue-50" 
                                onClick={() => handleRedirect('Publicaciones Populares')}
                            >
                                <div className="p-3 mr-4 rounded-full bg-blue-100 text-blue-600">
                                    <Star className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Publicaciones Populares</h2>
                                    <p className="text-sm text-gray-500">Artículos y guías más consultadas.</p>
                                </div>
                            </button>

                            {/* Tarjeta 2: Preguntas Frecuentes */}
                            <button 
                                className="w-full flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-md transition hover:shadow-lg hover:scale-[1.01] duration-200 text-left hover:bg-blue-50" 
                                onClick={() => handleRedirect('Preguntas Frecuentes sobre Servineo')}
                            >
                                <div className="p-3 mr-4 rounded-full bg-blue-100 text-blue-600">
                                    <HelpCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Preguntas Frecuentes (FAQ)</h2>
                                    <p className="text-sm text-gray-500">Respuestas rápidas a las dudas comunes.</p>
                                </div>
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CentroDeAyuda;