// src/Components/ask_for_help/forum.service.ts
import { ForumThread, ForumWithComments, ForumComment, CreateForumPayload } from "./forum.types"; 

// Leemos SOLO lo que ya hay en el .env (no se toca el .env)
const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Normalizamos para que siempre termine en /api
const API_BASE_URL = (() => {
  const trimmed = RAW_API_URL.replace(/\/+$/, "");

  if (trimmed.endsWith("/api")) {
    return trimmed;
  }

  return `${trimmed}/api`;
})();

console.log("[ForumService] API_BASE_URL =", API_BASE_URL);

// GET /forums
export async function listForums(): Promise<ForumThread[]> {
  const url = `${API_BASE_URL}/forums`;
  console.log("[ForumService] GET", url);

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Error al cargar el foro:", res.status, text);
    throw new Error("Error al cargar el foro");
  }

  return res.json();
}

// GET /forums/:id
export async function getForum(id: string): Promise<ForumWithComments> {
  const url = `${API_BASE_URL}/forums/${id}`;
  console.log("[ForumService] GET", url);

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Error al cargar el hilo:", res.status, text);
    throw new Error("Error al cargar el hilo");
  }

  return res.json();
}

// 🔹 Alias para que tu page.tsx pueda usar getForumWithComments sin romper
export async function getForumWithComments(
  id: string
): Promise<ForumWithComments> {
  return getForum(id);
}

// POST /forums
export async function createForum(
  payload: CreateForumPayload
): Promise<ForumThread> {
  const url = `${API_BASE_URL}/forums`;
  console.log("[ForumService] POST", url, payload);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Error al crear el foro:", res.status, text);
    throw new Error("Error al crear el foro");
  }

  return res.json();
}
export async function addCommentToForum(
  forumId: string,
  contenido: string
): Promise<ForumComment> {
  const url = `${API_BASE_URL}/forums/${forumId}/comments`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      contenido,
      // TEMPORAL (solo desarrollo)
      authorId: "667788990011223344556677",
      authorName: "Usuario Demo",
      authorRole: "visitor"
    }),
  });

  if (!res.ok) {
    throw new Error("Error al añadir comentario");
  }

  return res.json();
}

