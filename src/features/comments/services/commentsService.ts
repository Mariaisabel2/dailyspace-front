import { Comment, CreateCommentDto } from "../domain/comment";
import { httpClient } from "../../common/http";
import { authStorage } from "../../auth/services/authStorage";

const MOCK_COMMENTS_KEY = "dailyspace_mock_comments";

const INITIAL_MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    content: "¡Genial avance con los scripts!",
    userId: 1,
    userName: "mariaisabel",
    postId: 1,
    postTitle: "Primeros resultados de mi simulación en Python",
    createdAt: "2026-10-21T14:30:00Z",
  },
  {
    id: 2,
    content: "Excelente trabajo en la revisión de código.",
    userId: 1,
    userName: "mariaisabel",
    postId: 12,
    postTitle: "Revisión final de código para la Entrega 1",
    createdAt: "2026-10-26T22:15:00Z",
  },
  {
    id: 3,
    content: "El tono amarillo pastel se ve muy bien.",
    userId: 2,
    userName: "carlos_dev",
    postId: 2,
    postTitle: "Tarde de café y maquetación CSS",
    createdAt: "2026-10-22T16:00:00Z",
  },
];

function getStoredComments(): Comment[] {
  if (typeof window === "undefined") return INITIAL_MOCK_COMMENTS;
  try {
    const raw = localStorage.getItem(MOCK_COMMENTS_KEY);
    if (!raw) {
      localStorage.setItem(MOCK_COMMENTS_KEY, JSON.stringify(INITIAL_MOCK_COMMENTS));
      return INITIAL_MOCK_COMMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_COMMENTS;
  }
}

function saveStoredComments(comments: Comment[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MOCK_COMMENTS_KEY, JSON.stringify(comments));
  } catch {
    // Ignorar
  }
}

export const commentsService = {
  /**
   * Obtiene los comentarios del usuario actualmente autenticado (/api/comments/mias).
   */
  async getMyComments(): Promise<Comment[]> {
    try {
      return await httpClient<Comment[]>("/api/comments/mias");
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const currentUser = authStorage.getUser();
      if (!currentUser) return [];
      const all = getStoredComments();
      return all.filter((c) => c.userId === currentUser.id || c.userName === currentUser.name);
    }
  },

  /**
   * Obtiene todos los comentarios (Solo Admin en /api/comments).
   */
  async getAllComments(): Promise<Comment[]> {
    try {
      return await httpClient<Comment[]>("/api/comments");
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return getStoredComments();
    }
  },

  /**
   * Crea un nuevo comentario ligado a un post y al usuario activo (POST /api/comments).
   */
  async createComment(dto: CreateCommentDto, postTitle?: string): Promise<Comment> {
    try {
      return await httpClient<Comment>("/api/comments", {
        method: "POST",
        body: dto,
      });
    } catch {
      const currentUser = authStorage.getUser();
      const newComment: Comment = {
        id: Date.now(),
        content: dto.content,
        userId: currentUser?.id ? Number(currentUser.id) : 1,
        userName: currentUser?.name || "Anónimo",
        postId: dto.postId,
        postTitle: postTitle || `Publicación #${dto.postId}`,
        createdAt: new Date().toISOString(),
      };

      const existing = getStoredComments();
      const updated = [newComment, ...existing];
      saveStoredComments(updated);
      return newComment;
    }
  },

  /**
   * Elimina un comentario por su ID.
   */
  async deleteComment(id: number): Promise<void> {
    try {
      await httpClient<void>(`/api/comments/${id}`, {
        method: "DELETE",
      });
    } catch {
      const existing = getStoredComments();
      saveStoredComments(existing.filter((c) => c.id !== id));
    }
  },
};
