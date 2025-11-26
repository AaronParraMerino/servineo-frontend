"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { Home, User, Search, Star, HelpCircle, Users } from "lucide-react";

interface Suggestion {
  id: number;
  title: string;
  url: string;
}

const CentroDeAyuda: React.FC = () => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  /** Muestra un mensaje temporal */
  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    const timeoutId = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  /** Redirección centralizada */
  const handleRedirect = useCallback(
    (target: string, url: string | null = null) => {
      let finalUrl: string;

      switch (target) {
        case "Preguntas Frecuentes sobre Servineo":
        case "Preguntas Frecuentes (FAQ)":
          finalUrl = "/ask.for-help/preguntas-frecuentes";
          break;
        case "Publicaciones Populares":
          finalUrl = "/ask.for-help/publicaciones-populares";
          break;
        case "Foro de Usuarios":
          finalUrl = "/ask.for-help/foro-usuario";
          break;
        case "Home":
          finalUrl = "/";
          break;
        case "Perfil":
          finalUrl = "/perfil";
          break;
        default:
          finalUrl = url || `/${target.toLowerCase().replace(/\s/g, "-")}`;
      }

      if (typeof window !== "undefined") {
        router.push(finalUrl);
      } else {
        console.log(`[REDIRECCIÓN SIMULADA] → ${finalUrl}`);
        showMessage(`Simulando navegación a: ${finalUrl}`);
      }
    },
    [router, showMessage]
  );

  /** Ejecuta búsqueda */
  const handleSearchSubmit = useCallback(
    (
      event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>,
      customQuery?: string
    ) => {
      if (event && "preventDefault" in event) event.preventDefault();

      const query = customQuery || searchTerm.trim();

      if (!query) {
        setIsSearching(false);
        showMessage("Por favor, ingresa un término de búsqueda.");
        return;
      }

      setSuggestions([]);
      setIsSearching(true);
      setIsLoading(true);

      showMessage(`Búsqueda simulada para: “${query}”.`);

      setTimeout(() => {
        setIsLoading(false);

        if (query.toLowerCase().includes("pago")) {
          setSuggestions([
            { id: 1, title: "Problemas con mi pago", url: "/ayuda/pago-problemas" },
            { id: 2, title: "Métodos de pago aceptados", url: "/ayuda/metodos-pago" },
          ]);
        } else if (query.toLowerCase().includes("perfil")) {
          setSuggestions([
            { id: 3, title: "Cómo actualizar mi perfil", url: "/ask.for-help/publicaciones-populares" },
            { id: 4, title: "Recuperar contraseña", url: "/ask.for-help/publicaciones-populares" },
          ]);
        } else if (query.toLowerCase().includes("faq") || query.toLowerCase().includes("pregunta")) {
          setSuggestions([
            { id: 99, title: "Preguntas Frecuentes (FAQ)", url: "/ask.for-help/preguntas-frecuentes" },
          ]);
        } else {
          setSuggestions([]);
          showMessage(`No se encontraron resultados para “${query}”.`);
        }
      }, 600);
    },
    [searchTerm, showMessage]
  );

  /** Click sobre sugerencia */
  const handleSuggestionClick = useCallback(
    (suggestion: Suggestion) => {
      setSearchTerm(suggestion.title);
      setSuggestions([]);
      handleSearchSubmit(undefined, suggestion.title);
    },
    [handleSearchSubmit]
  );

  /** Autocompletado */
  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    setIsSearching(false);

    if (query.length < 2) {
      setSuggestions([]);
      if (isLoading) setIsLoading(false);
      return;
    }

    const simSuggestions: Suggestion[] = [
      { id: 10, title: "Problemas con mi pago", url: "/ayuda/pago-problemas" },
      { id: 11, title: "Restablecer contraseña", url: "/ayuda/restablecer" },
      { id: 12, title: "Información de facturación", url: "/ayuda/facturacion" },
      { id: 13, title: "Contacto de soporte", url: "/ask.for-help/preguntas-frecuentes" },
      { id: 14, title: "Preguntas Frecuentes (FAQ)", url: "/ask.for-help/preguntas-frecuentes" },
      { id: 15, title: "Publicaciones Populares", url: "/ask.for-help/publicaciones-populares" },
    ];

    const filtered = simSuggestions.filter((s) =>
      s.title.toLowerCase().includes(query)
    );

    const handler = setTimeout(() => setSuggestions(filtered), 150);
    return () => clearTimeout(handler);
  }, [searchTerm, isLoading]);

  /** Control de visibilidad */
  const normalizedQuery = searchTerm.trim().toLowerCase();

  const isFAQVisible = useMemo(() => {
    return (
      !isSearching &&
      (normalizedQuery.length === 0 ||
        ["pre", "frec", "faq", "duda", "pregunt"].some((k) =>
          normalizedQuery.includes(k)
        ))
    );
  }, [normalizedQuery, isSearching]);

  const isPopularVisible = useMemo(() => {
    return (
      !isSearching &&
      (normalizedQuery.length === 0 ||
        ["popu", "publica", "guia", "articulo", "arti"].some((k) =>
          normalizedQuery.includes(k)
        ))
    );
  }, [normalizedQuery, isSearching]);

  const isForumVisible = useMemo(() => {
    return (
      !isSearching &&
      (normalizedQuery.length === 0 ||
        ["foro", "comunidad", "usuario", "usuarios", "duda", "ayuda"].some((k) =>
          normalizedQuery.includes(k)
        ))
    );
  }, [normalizedQuery, isSearching]);

  const isResultsVisible = useMemo(
    () => isSearching && !isLoading,
    [isSearching, isLoading]
  );

  return (
    <div className="p-4 font-sans antialiased flex justify-center w-full">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-xl overflow-hidden mb-8">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-lg">
          <button
            onClick={() => handleRedirect("Home")}
            aria-label="Ir a inicio"
            className="p-2 rounded-full hover:bg-blue-700 transition"
          >
            <Home className="h-6 w-6" />
          </button>

          <h1 className="text-xl font-bold tracking-wide">Centro de Ayuda</h1>

          <button
            onClick={() => handleRedirect("Perfil")}
            aria-label="Ir a perfil"
            className="p-2 rounded-full hover:bg-blue-700 transition"
          >
            <User className="h-6 w-6" />
          </button>
        </header>

        {/* Buscador */}
        <section className="p-6 relative">
          <div className="relative">
            <button
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 p-1 rounded-full transition z-20"
              onClick={() => handleSearchSubmit()}
              aria-label="Ejecutar búsqueda"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                <Search className="h-5 w-5 hover:text-blue-600 transition" />
              )}
            </button>

            <input
              type="text"
              placeholder="Buscar ayuda en Servineo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit(e);
              }}
              className="w-full pl-12 pr-4 py-3 text-gray-800 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-inner"
            />
          </div>

          {/* Sugerencias */}
          {searchTerm.length >= 2 && suggestions.length > 0 && !isSearching && (
            <div className="absolute z-10 w-[calc(100%-3rem)] mt-2 left-6 right-6">
              <ul className="bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-100">
                {suggestions.map((s) => (
                  <li
                    key={s.id}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-150"
                  >
                    <p className="font-semibold truncate">{s.title}</p>
                    <p className="text-xs text-gray-400 truncate">{s.url}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Mensaje */}
        {message && (
          <div className="mx-6 mb-4 p-3 bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-sm font-medium transition-opacity duration-300">
            {message}
          </div>
        )}

        {/* Contenido */}
        <main className="p-6 pt-0">
          {isResultsVisible && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Resultados para &quot;{searchTerm}&quot;
              </h2>
              {suggestions.length > 0 ? (
                <div className="space-y-3">
                  {suggestions.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => handleRedirect(r.title, r.url)}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    >
                      <p className="font-semibold text-blue-600">{r.title}</p>
                      <p className="text-sm text-gray-500 truncate">{r.url}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-10 bg-gray-50 rounded-lg text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-3" />
                  <p>No se encontraron resultados.</p>
                </div>
              )}
            </div>
          )}

          {/* Secciones por defecto */}
          {(!isSearching || isLoading) && (
            <div className="space-y-4">
              {isFAQVisible && (
                <button
                  onClick={() => handleRedirect("Preguntas Frecuentes sobre Servineo")}
                  className="w-full flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] duration-200 text-left hover:bg-blue-50"
                >
                  <div className="p-3 mr-4 rounded-full bg-blue-100 text-blue-600">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Preguntas Frecuentes (FAQ)
                    </h2>
                    <p className="text-sm text-gray-500">
                      Respuestas rápidas a las dudas comunes.
                    </p>
                  </div>
                </button>
              )}

              {isPopularVisible && (
                <button
                  onClick={() => handleRedirect("Publicaciones Populares")}
                  className="w-full flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] duration-200 text-left hover:bg-blue-50"
                >
                  <div className="p-3 mr-4 rounded-full bg-blue-100 text-blue-600">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Publicaciones Populares
                    </h2>
                    <p className="text-sm text-gray-500">
                      Artículos y guías más consultadas.
                    </p>
                  </div>
                </button>
              )}

              {isForumVisible && (
                <button
                  onClick={() => handleRedirect("Foro de Usuarios")}
                  className="w-full flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] duration-200 text-left hover:bg-blue-50"
                >
                  <div className="p-3 mr-4 rounded-full bg-blue-100 text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Foro de Usuarios
                    </h2>
                    <p className="text-sm text-gray-500">
                      comparte tus dudas y ayuda a otros usuarios
                    </p>
                  </div>
                </button>
              )}

              {!isFAQVisible && !isPopularVisible && !isForumVisible && normalizedQuery.length > 0 && (
                <p className="text-center text-gray-500 py-4">
                  No se encontraron categorías que coincidan con &quot;
                  {searchTerm}&quot;.
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
