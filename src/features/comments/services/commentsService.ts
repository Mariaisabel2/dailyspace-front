import { Comment, CreateCommentDto } from "../domain/comment";
import { httpClient } from "../../common/http";

/**
 * Servicio de comentarios e interacciones de DailySpace conectado a la API REST.
 */
export const commentsService = {
  /**
   * Obtiene los comentarios del usuario actualmente autenticado (/api/comments/mias).
   */
  async getMyComments(): Promise<Comment[]> {
    return await httpClient<Comment[]>("/api/comments/mias");
  },

  /**
   * Obtiene todos los comentarios (Solo Admin en /api/comments).
   */
  async getAllComments(): Promise<Comment[]> {
    return await httpClient<Comment[]>("/api/comments");
  },

  /**
   * Crea un nuevo comentario ligado a un post y al usuario autenticado (POST /api/comments).
   */
  async createComment(dto: CreateCommentDto): Promise<Comment> {
    return await httpClient<Comment>("/api/comments", {
      method: "POST",
      body: dto,
    });
  },

  /**
   * Elimina un comentario por su ID (DELETE /api/comments/:id).
   */
  async deleteComment(id: number): Promise<void> {
    await httpClient<void>(`/api/comments/${id}`, {
      method: "DELETE",
    });
  },
};
