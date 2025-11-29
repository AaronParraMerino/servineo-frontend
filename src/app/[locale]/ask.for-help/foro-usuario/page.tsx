"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { listForums, createForum } from "@/Components/ask_for_help/forum.service";
import type { ForumThread } from "@/Components/ask_for_help/forum.types";

export default function ForoDeUsuariosPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function loadForums() {
    try {
      setLoading(true);
      setError(null);
      const data = await listForums();
      setThreads(data);
    } catch (err: unknown) { 
      let errorMessage = "Error al cargar el foro";
      if (err instanceof Error) { 
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadForums();
  }, []);

  const filteredThreads = useMemo(() => {
    if (!query.trim()) return threads;
    const q = query.toLowerCase();
    return threads.filter(
      (t) =>
        t.titulo.toLowerCase().includes(q) ||
        t.descripcion.toLowerCase().includes(q)
    );
  }, [threads, query]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim()) {
      setCreateError("Completa el título y la descripción.");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);
      await createForum({ titulo, descripcion });
      setShowCreateForm(false);
      setTitulo("");
      setDescripcion("");
      await loadForums();
    } catch (err: unknown) {
      let errorMessage = "Error al crear la publicación";
          if (err instanceof Error) {
            errorMessage = err.message;
          }
          setCreateError(errorMessage);
        } finally {
          setCreating(false);
        }
      }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 relative">
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
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border-2 border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm hover:shadow-md"
                />
              </div>


              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                onClick={loadForums}
              >
                Buscar
              </button>

              <button
                type="button"
                onClick={() => setShowCreateForm((v) => !v)}
                className="px-4 py-2 border border-blue-600 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {showCreateForm ? "Cerrar formulario" : "Crear publicación"}
              </button>
            </div>
          </section>

          {/* Formulario crear publicación */}
          {showCreateForm && (
            <section className="mb-6 border border-gray-200 rounded-lg p-4">
              <h2 className="font-semibold mb-3">Crear nueva publicación</h2>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={150}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Descripción del problema
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>
                {createError && (
                  <p className="text-sm text-red-600">{createError}</p>
                )}
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
                >
                  {creating ? "Publicando..." : "Publicar foro"}
                </button>
              </form>
            </section>
          )}

          <hr className="mb-6" />

          {/* Listado / estados */}
          {loading && (
            <p className="text-center text-gray-600">Cargando publicaciones...</p>
          )}

          {error && !loading && (
            <p className="text-center text-red-600">{error}</p>
          )}

          {!loading && !error && filteredThreads.length === 0 && (
            <section className="border border-gray-200 rounded-lg p-8 text-center text-gray-600">
              <p className="font-medium mb-2">
                No se encontraron publicaciones.
              </p>
              <p className="text-sm">
                Cuando los usuarios comiencen a crear publicaciones, aparecerán aquí.
              </p>
            </section>
          )}

          {!loading && !error && filteredThreads.length > 0 && (
            <section className="space-y-4">
              {filteredThreads.map((thread) => (
                <button
                  key={thread._id}
                  type="button"
                  onClick={() =>
                    router.push(`/ask.for-help/foro-usuario/${thread._id}`)
                  }
                  className="w-full text-left border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {thread.titulo}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {thread.descripcion}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        Por {thread.authorName} •{" "}
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {thread.commentsCount} comentarios
                    </span>
                  </div>
                </button>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
