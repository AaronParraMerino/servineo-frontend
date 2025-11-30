// frontend/src/components/ask_for_help/api.config.ts

// Resuelve la base de la API usando NEXT_PUBLIC_API_URL
// - Si viene "http://localhost:8000"     → "http://localhost:8000/api"
// - Si viene "http://localhost:8000/api" → se queda igual
/*function resolveApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Quitamos slashes del final
  const trimmed = raw.replace(/\/+$/, '');

  // Si ya termina en /api, lo dejamos tal cual
  if (trimmed.endsWith('/api')) {
    return trimmed;
  }

  // Si no, le agregamos /api
  return `${trimmed}/api`;
}

export const API_CONFIG = {
  BASE_URL: resolveApiBaseUrl(),
  ENDPOINTS: {
    FAQS: '/faqs',
    FAQ_BY_ID: (id: string) => `/faqs/${id}`,
    FAQS_SEARCH: '/faqs/search',
    // si luego quieres agregar aquí FORUMS, etc., también puede
  },
};
*/