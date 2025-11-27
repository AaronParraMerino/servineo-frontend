"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  getForumWithComments,
  addCommentToForum,
} from "@/Components/ask_for_help/forum.service";
import type { ForumWithComments } from "@/Components/ask_for_help/forum.types";

export default function ForoDetallePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const forumId = params.id;

  const [data, setData] = useState<ForumWithComments | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await getForumWithComments(forumId);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Error al cargar la publicación");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (forumId) load();
  }, [forumId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !data) return;

    try {
      setPosting(true);
      setPostError(null);
      await addCommentToForum(forumId, newComment);
      setNewComment("");
      await load();
    } catch (err: any) {
      setPostError(err.message || "Error al enviar el comentario");
    } finally {
      setPosting(false);
    }
  }

  if (loading && !data) {
    return <p className="p-8 text-center">Cargando...</p>;
  }

  if (error && !data) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded-md"
        >
          Volver
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { forum, comments } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 mb-4 hover:underline"
          >
            ← Volver al foro
          </button>

          <h1 className="text-2xl font-bold mb-2">
            {forum.titulo}
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            Por {forum.authorName} •{" "}
            {new Date(forum.createdAt).toLocaleString()}
          </p>
          <div className="border border-gray-200 rounded-lg p-4 text-gray-800">
            {forum.descripcion}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="font-semibold mb-4">
            Comentarios ({comments.length})
          </h2>

          <div className="space-y-3 mb-4">
            {comments.map((c) => (
              <div
                key={c._id}
                className="border border-gray-200 rounded-lg p-3 text-sm"
              >
                <p className="font-semibold text-gray-800">
                  {c.authorName}
                </p>
                <p className="text-gray-700 mt-1">{c.contenido}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-sm text-gray-500">
                Aún no hay comentarios. ¡Sé el primero en responder!
              </p>
            )}
          </div>

          <form onSubmit={handleSend} className="space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escriba el mensaje..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            {postError && (
              <p className="text-sm text-red-600">{postError}</p>
            )}
            <button
              type="submit"
              disabled={posting || !newComment.trim()}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {posting ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
