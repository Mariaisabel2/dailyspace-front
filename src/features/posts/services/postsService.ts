import {
  Post,
  CreatePostDto,
  UpdatePostDto,
  PostFilters,
  PaginatedPosts,
} from "../domain/post";
import { httpClient } from "../../common/http";
import { INITIAL_POSTS } from "./mockData";

// Almacén en memoria/localStorage para que los cambios mockeados persistan durante las pruebas del front
const MOCK_STORAGE_KEY = "dailyspace_mock_posts";

function getStoredMockPosts(): Post[] {
  if (typeof window === "undefined") return INITIAL_POSTS;
  try {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(stored);
  } catch {
    return INITIAL_POSTS;
  }
}

function saveStoredMockPosts(posts: Post[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // Ignorar errores de almacenamiento
  }
}

/**
 * Servicio de catálogo de publicaciones (Posts) de DailySpace.
 * Soporta consumo de la API REST real con fallback interactivo a Mock Data.
 */
export const postsService = {
  /**
   * Obtiene publicaciones con paginación, filtros de visibilidad y búsqueda combinada (Bono +2 pts).
   */
  async getPosts(filters: PostFilters = {}): Promise<PaginatedPosts> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 6;
    const visibility = filters.visibility || "all";
    const search = filters.search?.trim().toLowerCase() || "";

    try {
      // Intenta consultar la API REST del backend si está configurada
      return await httpClient<PaginatedPosts>("/api/posts", {
        params: {
          page,
          limit,
          visibility: visibility === "all" ? undefined : visibility,
          search: search || undefined,
        },
      });
    } catch {
      // Simulación local con mock data
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simula latencia de red

      let filtered = [...getStoredMockPosts()];

      if (visibility && visibility !== "all") {
        filtered = filtered.filter((p) => p.visibility === visibility);
      }

      if (search) {
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(search) ||
            p.content.toLowerCase().includes(search) ||
            p.author.toLowerCase().includes(search)
        );
      }

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const startIndex = (page - 1) * limit;
      const data = filtered.slice(startIndex, startIndex + limit);

      return {
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
        data,
      };
    }
  },

  /**
   * Obtiene una publicación por su ID.
   */
  async getPostById(id: number): Promise<Post> {
    try {
      return await httpClient<Post>(`/api/posts/${id}`);
    } catch {
      const posts = getStoredMockPosts();
      const found = posts.find((p) => p.id === id);
      if (!found) throw new Error("Publicación no encontrada");
      return found;
    }
  },

  /**
   * Crea una nueva entrada en el catálogo (solo admin en backend, o usuario en mock).
   */
  async createPost(dto: CreatePostDto, authorName = "mariaisabel"): Promise<Post> {
    try {
      return await httpClient<Post>("/api/posts", {
        method: "POST",
        body: dto,
      });
    } catch {
      const posts = getStoredMockPosts();
      const newPost: Post = {
        id: Date.now(),
        author: authorName,
        title: dto.title,
        media:
          dto.media ||
          "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
        content: dto.content,
        visibility: dto.visibility,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
      };
      const updated = [newPost, ...posts];
      saveStoredMockPosts(updated);
      return newPost;
    }
  },

  /**
   * Actualiza una entrada del catálogo (Solo Admin).
   */
  async updatePost(id: number, dto: UpdatePostDto): Promise<Post> {
    try {
      return await httpClient<Post>(`/api/posts/${id}`, {
        method: "PUT",
        body: dto,
      });
    } catch {
      const posts = getStoredMockPosts();
      const index = posts.findIndex((p) => p.id === id);
      if (index === -1) throw new Error("Publicación no encontrada");
      const updatedPost = { ...posts[index], ...dto };
      posts[index] = updatedPost;
      saveStoredMockPosts([...posts]);
      return updatedPost;
    }
  },

  /**
   * Elimina una entrada del catálogo (Solo Admin).
   */
  async deletePost(id: number): Promise<void> {
    try {
      await httpClient<void>(`/api/posts/${id}`, {
        method: "DELETE",
      });
    } catch {
      const posts = getStoredMockPosts();
      const filtered = posts.filter((p) => p.id !== id);
      saveStoredMockPosts(filtered);
    }
  },

  /**
   * Incrementa los likes de una entrada.
   */
  async toggleLike(id: number): Promise<number> {
    try {
      const res = await httpClient<{ likes: number }>(`/api/posts/${id}/like`, {
        method: "POST",
      });
      return res.likes;
    } catch {
      const posts = getStoredMockPosts();
      const post = posts.find((p) => p.id === id);
      if (post) {
        post.likes += 1;
        saveStoredMockPosts([...posts]);
        return post.likes;
      }
      return 0;
    }
  },
};
