"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Post, PaginationMeta, PostVisibility } from "../domain/post";
import { postsService } from "../services/postsService";
import { APP_CONFIG } from "../../common/config";

interface UsePostsOptions {
  limit?: number;
  initialVisibility?: "all" | PostVisibility;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { limit = APP_CONFIG.defaultPageSize, initialVisibility = "all" } = options;
  const searchParams = useSearchParams();

  // Leer estado de la URL
  const pageParam = Number(searchParams.get("page")) || 1;
  const visibilityParam = (searchParams.get("visibility") as PostVisibility) || initialVisibility;
  const searchParam = searchParams.get("q") || "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: pageParam,
    limit,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await postsService.getPosts({
        page: pageParam,
        limit,
        visibility: visibilityParam,
        search: searchParam,
      });
      setPosts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las publicaciones del diario"
      );
    } finally {
      setIsLoading(false);
    }
  }, [pageParam, limit, visibilityParam, searchParam]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = async (postId: number) => {
    try {
      const newLikes = await postsService.toggleLike(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: newLikes } : p))
      );
    } catch {
      // Ignorar fallo de like en interfaz
    }
  };

  return {
    posts,
    pagination,
    isLoading,
    error,
    isEmpty: !isLoading && !error && posts.length === 0,
    refetch: fetchPosts,
    handleLike,
    currentPage: pageParam,
    currentVisibility: visibilityParam,
    currentSearch: searchParam,
  };
}
