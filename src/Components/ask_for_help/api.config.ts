// frontend/src/Components/ask_for_help/api.config.ts
export const API_CONFIG = {
  // Usamos la misma base que el foro
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  ENDPOINTS: {
    FAQS: '/faqs',
    FAQ_BY_ID: (id: string) => `/faqs/${id}`,
    FAQS_SEARCH: '/faqs/search',
  },
};
