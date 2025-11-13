"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
// ⚠️ MODIFICACIÓN CLAVE: Descomenta esta línea para usar la función de router de Next.js
import { useRouter } from 'next/navigation'; 
import { Home, User, Search, Star, HelpCircle } from 'lucide-react';

// --- 1. Definición de Tipos (Simplificados para simulación) ---

interface Suggestion {
    id: number;
    title: string;
    url: string;
}

// --- 2. Componente Principal del Centro de Ayuda ---
const CentroDeAyuda: React.FC = () => {
    // ⚠️ MODIFICACIÓN CLAVE: Inicializa el router
    const router = useRouter(); 
    
    // Hooks de estado
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false); // Nuevo estado para controlar la vista de resultados de búsqueda
    
    // Funciones de utilidades y handlers
    const showMessage = (msg: string) => {
        setMessage(msg);
        const timeoutId = setTimeout(() => setMessage(''), 5000);
        return () => clearTimeout(timeoutId);
    };

    // Función para manejar la simulación y redirección REAL
    const handleRedirect = useCallback((target: string, url: string | null = null) => {
        let finalUrl: string;
        
        if (target === 'Preguntas Frecuentes sobre Servineo' || target === 'Preguntas Frecuentes (FAQ)') {
            finalUrl = '/ask.for-help/preguntas-frecuentes';
        } else if (target === 'Publicaciones Populares') {
            finalUrl = '/ask.for-help/publicaciones-populares';
        } else if (target === 'Home') {
            finalUrl = '/';
        } else if (target === 'Perfil') {
            finalUrl = '/perfil';
        } else if (url) {
            finalUrl = url;
        } else {
            finalUrl = `/${target.toLowerCase().replace(/\s/g, '-')}`;
        }

        // ⚠️ MODIFICACIÓN CLAVE: Usa router.push para la navegación real
        if (typeof window !== 'undefined' && router) {
            router.push(finalUrl);
        } else {
            // Muestra un mensaje en el entorno de simulación (si el router no está disponible)
            console.log(`[REDIRECCIÓN SIMULADA] Navegando a: ${finalUrl}`);
            showMessage(`Simulando navegación a: ${finalUrl}`);
        }
    }, [router]); // Añadir router a las dependencias
    

    const handleSuggestionClick = useCallback((suggestion: Suggestion) => {
        // Usamos la sugerencia como el término de búsqueda y ejecutamos la búsqueda
        setSearchTerm(suggestion.title);
        setSuggestions([]);
        handleSearchSubmit(undefined, suggestion.title); // Ejecutar búsqueda con el título de la sugerencia
    }, []);
    
    const handleSearchSubmit = useCallback((event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>, customQuery?: string) => {
        if (event && 'preventDefault' in event) event.preventDefault(); 
        
        const query = customQuery || searchTerm.trim();

        if (query.length > 0) {
            setSuggestions([]);
            setIsSearching(true); // Cambia al modo de resultados
            setIsLoading(true);
            
            showMessage(`Búsqueda simulada para: "${query}".`);

            // SIMULACIÓN DE LATENCIA Y RESULTADOS
            setTimeout(() => {
                setIsLoading(false);
                // Si la búsqueda no es vacía, simulamos un resultado.
                if (query.toLowerCase().includes("pago")) {
                    setSuggestions([
                        { id: 1, title: "Problemas con mi pago", url: "/ayuda/pago-problemas" },
                        { id: 2, title: "Métodos de pago aceptados", url: "/ayuda/metodos-pago" },
                    ]);
                } else if (query.toLowerCase().includes("perfil")) {
                    setSuggestions([
                        { id: 3, title: "Cómo actualizar mi perfil", url: "/ayuda/actualizar-perfil" },
                        { id: 4, title: "Recuperar contraseña", url: "/ayuda/recuperar-password" },
                    ]);
                } else {
                    // Si el query coincide con 'pregunta' o 'faq', mostramos el link de preguntas frecuentes
                    if (query.toLowerCase().includes('pre') || query.toLowerCase().includes('faq')) {
                        setSuggestions([
                            { id: 99, title: "Preguntas Frecuentes (FAQ)", url: "/ask.for-help/preguntas-frecuentes" }
                        ]);
                    } else {
                        setSuggestions([]);
                        showMessage(`No se encontraron resultados para "${query}".`);
                    }
                }
            }, 500);

        } else {
            setIsSearching(false); // Si el campo está vacío, vuelve a la vista de inicio
            showMessage('Por favor, ingresa un término de búsqueda.');
        }
    }, [searchTerm]);

    // Lógica de Sugerencias Simples para el Autocompletado (sin Axios)
    useEffect(() => {
        const query = searchTerm.trim().toLowerCase();
        setIsSearching(false); // Vuelve a la vista de inicio si el usuario está tecleando

        if (query.length < 2) {
            setSuggestions([]);
            if(isLoading) setIsLoading(false); 
            return;
        }

        // SIMULACIÓN DE RESPUESTA DE SUGERENCIA INSTANTÁNEA
        const simSuggestions: Suggestion[] = [
            { id: 10, title: "Problemas con mi pago", url: "/ayuda/pago-problemas" },
            { id: 11, title: "Restablecer contraseña", url: "/ayuda/restablecer" },
            { id: 12, title: "Información de facturación", url: "/ayuda/facturacion" },
            { id: 13, title: "Contacto de soporte", url: "/ask.for-help/preguntas-frecuentes" },
            // Añadir las secciones principales a las sugerencias si coinciden
            { id: 14, title: "Preguntas Frecuentes (FAQ)", url: "/ask.for-help/preguntas-frecuentes" }, 
            { id: 15, title: "Publicaciones Populares", url: "/ask.for-help/publicaciones-populares" },
        ];
        
        const filteredSuggestions = simSuggestions.filter(s => 
            s.title.toLowerCase().includes(query)
        );

        const handler = setTimeout(() => {
            setSuggestions(filteredSuggestions);
        }, 150);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);


    // *** LÓGICA DE VISIBILIDAD DE SECCIONES ***
    
    const normalizedQuery = searchTerm.trim().toLowerCase();
    
    // 1. FAQ es visible si:
    //    - El término de búsqueda está vacío (mostrar por defecto).
    //    - O el término contiene coincidencias parciales como 'pre', 'frec', 'faq', 'duda'.
    //    - Y NO estamos en modo de búsqueda de resultados completos (isSearching).
    const isFAQVisible = useMemo(() => {
        return !isSearching && (
            normalizedQuery.length === 0 || 
            ['pre', 'frec', 'faq', 'duda', 'pregunt'].some(keyword => normalizedQuery.includes(keyword))
        );
    }, [normalizedQuery, isSearching]);
    
    // 2. Publicaciones Populares es visible si:
    //    - El término de búsqueda está vacío (mostrar por defecto).
    //    - O el término contiene coincidencias parciales como 'popu', 'publica', 'guía', 'artículo', 'arti'.
    //    - Y NO estamos en modo de búsqueda de resultados completos (isSearching).
    const isPopularVisible = useMemo(() => {
        return !isSearching && (
            normalizedQuery.length === 0 ||
            ['popu', 'publica', 'guia', 'articulo', 'arti'].some(keyword => normalizedQuery.includes(keyword))
        );
    }, [normalizedQuery, isSearching]);

    // 3. Resultados de Búsqueda es visible si isSearching es TRUE y las sugerencias se han cargado (o no se encontraron)
    const isResultsVisible = useMemo(() => {
        return isSearching && !isLoading;
    }, [isSearching, isLoading]);


    return (
        <div className="p-4 font-sans antialiased flex justify-center w-full"> 
            
            {/* Contenedor Principal Ajustado */}
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-xl overflow-hidden mb-8">
                
                {/* Header Corregido (Integrado con tu barra superior) */}
                <header className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-lg">
                    <div 
                        className="cursor-pointer p-2 rounded-full hover:bg-blue-700 transition"
                        onClick={() => handleRedirect('Home')}
                        aria-label="Ir a inicio"
                    >
                        <Home className="h-6 w-6" />
                    </div>
                    <h1 className="text-xl font-bold tracking-wide">Centro de Ayuda</h1>
                    <div 
                        className="cursor-pointer p-2 rounded-full hover:bg-blue-700 transition"
                        onClick={() => handleRedirect('Perfil')}
                        aria-label="Ir a perfil de usuario"
                    >
                        <User className="h-6 w-6" />
                    </div>
                </header>

                {/* Búsqueda y Sugerencias */}
                <section className="p-6 relative">
                    <div className="relative">
                        {/* Botón de Búsqueda / Loader */}
                        <button 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 p-1 rounded-full transition z-20"
                            onClick={() => handleSearchSubmit()}
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
                        
                        {/* Input de Búsqueda */}
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
                    
                    {/* Dropdown de Sugerencias (Autocompletado) */}
                    {searchTerm.length >= 2 && suggestions.length > 0 && !isSearching && (
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
                
                {/* Contenido Principal/Resultados */}
                <main className="p-6 pt-0">
                    
                    {/* Sección de Resultados de Búsqueda SIMULADA */}
                    {isResultsVisible && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Resultados para "{searchTerm}"</h2>
                            {suggestions.length > 0 ? (
                                <div className="space-y-3">
                                    {suggestions.map(result => (
                                        <div 
                                            key={result.id} 
                                            className="p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                                            onClick={() => handleRedirect(result.title, result.url)}
                                        >
                                            <p className="font-semibold text-blue-600">{result.title}</p>
                                            <p className="text-sm text-gray-500 truncate">{result.url}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-10 bg-gray-50 rounded-lg text-gray-500">
                                    <Search className="h-8 w-8 mx-auto mb-3" />
                                    <p>Lo sentimos, no encontramos resultados para tu búsqueda.</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Secciones por Defecto (FAQ y Populares) */}
                    {(!isSearching || isLoading) && (
                        <div className="space-y-4">
                            
                            {/* ⬅️ PREGUNTAS FRECUENTES (FAQ) - Visible con coincidencias parciales */}
                            {isFAQVisible && (
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
                            )}
                            
                            {/* ⬅️ Publicaciones Populares - Visible con coincidencias parciales */}
                            {isPopularVisible && (
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
                            )}
                            
                            {/* Mensaje de no coincidencia en la vista principal */}
                            {!isFAQVisible && !isPopularVisible && normalizedQuery.length > 0 && (
                                 <p className="text-center text-gray-500 py-4">
                                    No se encontraron categorías que coincidan con &quot;{searchTerm}&quot;.
                                </p>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CentroDeAyuda;