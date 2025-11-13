// frontend/src/componentes/ask_for_help/useFAQ.ts
import { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js'; // ⬅️ IMPORTADO
import { FAQ, FAQCategoria, UseFAQReturn } from './faq.types';
import { FAQService } from './faq.service';

// Crear una ÚNICA instancia del servicio
const faqServiceInstance = new FAQService();

export const useFAQ = (): UseFAQReturn => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [allFaqs, setAllFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategoria | 'all'>('all');

  const faqService = faqServiceInstance; 

  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await faqService.getAllFAQs();
      setAllFaqs(data);
      setFaqs(data);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al cargar las preguntas frecuentes';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [faqService]);

  // Función auxiliar para aplicar el filtro de categoría
  const applyCategoryFilter = useCallback((items: FAQ[], category: FAQCategoria | 'all'): FAQ[] => {
    if (category === 'all') {
      return items;
    }
    return items.filter(faq => faq.categoria === category);
  }, []);


  // 2. MODIFICADO: Implementación de búsqueda difusa con Fuse.js
  const searchFAQs = useCallback((query: string) => {
    setLoading(true);
    setError(null);

    // 1. Limpieza: Si la consulta está vacía, aplicamos solo el filtro de categoría.
    if (!query || query.trim().length === 0) {
      const filteredFaqs = applyCategoryFilter(allFaqs, selectedCategory);
      setFaqs(filteredFaqs);
      setLoading(false);
      return;
    }
    
    // 2. Configurar y ejecutar Fuse.js para la búsqueda difusa
    const fuse = new Fuse(allFaqs, {
      keys: ['pregunta', 'respuesta'], // Campos donde buscar coincidencias
      ignoreLocation: true, // Permite buscar coincidencias en cualquier parte del texto
      threshold: 0.3, // ⬅️ Tolerancia a errores de escritura (0.0=exacto, 1.0=cualquier cosa)
      includeScore: false // No necesitamos el puntaje
    });

    try {
      // 3. Obtener resultados del buscador difuso
      const fuseResults = fuse.search(query);
      
      // Mapear resultados a objetos FAQ (retorna solo el item)
      const searchedFaqs = fuseResults.map(result => result.item);

      // 4. Aplicar el filtro de categoría a los resultados de la búsqueda
      const finalFaqs = applyCategoryFilter(searchedFaqs, selectedCategory);
      
      setFaqs(finalFaqs);

    } catch (err) {
      // Manejo de errores de búsqueda local, si es que ocurren.
      setError('Error en la búsqueda difusa local');
      console.error('Error en Fuse.js:', err);
    } finally {
      setLoading(false);
    }
  }, [allFaqs, selectedCategory, applyCategoryFilter]); // Dependencias: allFaqs y selectedCategory

  const filterByCategory = useCallback((category: FAQCategoria | 'all') => {
    setSelectedCategory(category);
    
    // Al cambiar de categoría, re-aplicamos la categoría sobre todas las FAQs
    // En una aplicación real, probablemente también querrías re-aplicar el último término de búsqueda.
    const filteredFaqs = applyCategoryFilter(allFaqs, category);
    setFaqs(filteredFaqs);
  }, [allFaqs, applyCategoryFilter]);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  return {
    faqs,
    loading,
    error,
    selectedCategory,
    searchFAQs,
    fetchFAQs,
    filterByCategory,
  };
};