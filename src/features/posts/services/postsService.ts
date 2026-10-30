import {
  Post,
  CreatePostDto,
  UpdatePostDto,
  PostFilters,
  PaginatedPosts,
} from "../domain/post";
import { httpClient } from "../../common/http";

/**
 * Servicio de catálogo de publicaciones (Posts) de DailySpace.
 * Conectado directamente a la API REST y base de datos PostgreSQL.
 */
export const postsService = {
  /**
   * Obtiene publicaciones con paginación, filtros de visibilidad y búsqueda combinada.
   */
  async getPosts(filters: PostFilters = {}): Promise<PaginatedPosts> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 6;
    const visibility = filters.visibility || "all";
    const search = filters.search?.trim().toLowerCase() || "";

    return await httpClient<PaginatedPosts>("/api/posts", {
      params: {
        page,
        limit,
        visibility: visibility === "all" ? undefined : visibility,
        search: search || undefined,
      },
    });
  },

  /**
   * Obtiene una publicación por su ID.
   */
  async getPostById(id: number): Promise<Post> {
    return await httpClient<Post>(`/api/posts/${id}`);
  },

  /**
   * Crea una nueva entrada en el catálogo (Solo Admin).
   */
  async createPost(dto: CreatePostDto): Promise<Post> {
    return await httpClient<Post>("/api/posts", {
      method: "POST",
      body: dto,
    });
  },

  /**
   * Actualiza una entrada del catálogo (Solo Admin).
   */
  async updatePost(id: number, dto: UpdatePostDto): Promise<Post> {
    return await httpClient<Post>(`/api/posts/${id}`, {
      method: "PUT",
      body: dto,
    });
  },

  /**
   * Elimina una entrada del catálogo (Solo Admin).
   */
  async deletePost(id: number): Promise<void> {
    await httpClient<void>(`/api/posts/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Incrementa los likes de una entrada en la base de datos.
   */
  async toggleLike(id: number): Promise<number> {
    const res = await httpClient<{ likes: number }>(`/api/posts/${id}/like`, {
      method: "POST",
    });
    return res.likes;
  },
};
