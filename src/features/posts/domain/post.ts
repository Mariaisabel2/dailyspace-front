export type PostVisibility = "Público" | "Privado";

export interface Post {
  id: number;
  author: string;
  title: string;
  media: string;
  content: string;
  visibility: PostVisibility;
  likes: number;
  comments: string[];
  createdAt?: string;
}

export interface CreatePostDto {
  title: string;
  media?: string;
  content: string;
  visibility: PostVisibility;
}

export interface UpdatePostDto {
  title?: string;
  media?: string;
  content?: string;
  visibility?: PostVisibility;
}

export interface PostFilters {
  visibility?: "all" | PostVisibility;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedPosts {
  pagination: PaginationMeta;
  data: Post[];
}
