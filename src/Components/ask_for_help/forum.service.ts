import { ForumThread, ForumWithComments } from './forum.types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export async function listForums(): Promise<ForumThread[]> {
  const res = await fetch(`${API_BASE_URL}/forums`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Error al cargar el foro');
  }

  return res.json();
}

export async function createForum(input: {
  titulo: string;
  descripcion: string;
  categoria?: string;
}): Promise<ForumThread> {
  const res = await fetch(`${API_BASE_URL}/forums`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // para enviar cookies de login
    body: JSON.stringify(input),
  });

  if (res.status === 401) {
    throw new Error('Debes iniciar sesión para crear una publicación');
  }

  if (!res.ok) {
    throw new Error('Error al crear la publicación');
  }

  return res.json();
}

export async function getForumWithComments(
  forumId: string,
): Promise<ForumWithComments> {
  const res = await fetch(`${API_BASE_URL}/forums/${forumId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Error al cargar la publicación');
  }

  return res.json();
}

export async function addCommentToForum(forumId: string, contenido: string) {
  const res = await fetch(`${API_BASE_URL}/forums/${forumId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ contenido }),
  });

  if (res.status === 401) {
    throw new Error('Debes iniciar sesión para comentar');
  }

  if (res.status === 409) {
    throw new Error('Este hilo está bloqueado para nuevos comentarios');
  }

  if (!res.ok) {
    throw new Error('Error al agregar el comentario');
  }

  return res.json();
}
