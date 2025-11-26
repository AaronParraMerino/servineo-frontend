"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function ForoDeUsuariosPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  /*
    🧩 Ejemplo (COMENTADO) de cómo podríamos conectar el backend más adelante:

    type ForumThread = {
      id: string;
      title: string;
      description: string;
      commentsCount: number;
      createdAt: string;
      // lo que necesiten...
    };

    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      setLoading(true);

      fetch("/api/foro-usuarios") // endpoint que creen en el backend
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar el foro");
          return res.json();
        })
        .then((data: ForumThread[]) => {
          setThreads(data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }, []);

    // Luego simplemente mapearíamos threads dentro del listado:
    // threads.map(thread => (...))
  */

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 relative">
          {/* Botón volver atrás */}
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 text-2xl text-gray-600 hover:text-gray-800 transition"
            aria-label="Volver atrás"
          >
            ←
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">
            Foro de Usuarios
          </h1>
          <p className="text-gray-600 text-lg text-center">
            Comparte tus dudas y ayuda a otros usuarios.
          </p>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Barra de búsqueda + botones */}
          <section className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Input de búsqueda */}
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Botón Buscar (ahora solo visual, la búsqueda real se hará con backend) */}
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 hover:bg-gray-200 transition"
              >
                Buscar
              </button>

              {/* Botón Crear publicación (luego puede abrir un modal o enviar a otra página) */}
              <button
                type="button"
                onClick={() =>
                  alert("La funcionalidad de crear publicación se agregará más adelante.")
                }
                className="px-4 py-2 border border-blue-600 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Crear publicación
              </button>
            </div>
          </section>

          <hr className="mb-6" />

          {/* Estado vacío (no hay foros aún) */}
          <section className="border border-gray-200 rounded-lg p-8 text-center text-gray-600">
            <p className="font-medium mb-2">
              Todavía no hay publicaciones en el foro.
            </p>
            <p className="text-sm">
              Cuando los usuarios comiencen a crear publicaciones, aparecerán aquí
              listadas. Más adelante este bloque se reemplazará por la lista de
              hilos que venga del backend.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
