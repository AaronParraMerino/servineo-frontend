// frontend/src/components/ask_for_help/api.config.ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  ENDPOINTS: {
    FAQS: '/api/faqs',
    FAQ_BY_ID: (id: string) => `/api/faqs/${id}`,
    FAQS_SEARCH: '/api/faqs/search',
  },
};
