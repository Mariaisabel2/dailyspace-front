"use client";

import { useState, useEffect, useCallback } from "react";
import { Comment, CreateCommentDto } from "../domain/comment";
import { commentsService } from "../services/commentsService";

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await commentsService.getMyComments();
      setComments(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar tus comentarios"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyComments();
  }, [fetchMyComments]);

  const addComment = async (dto: CreateCommentDto) => {
    const created = await commentsService.createComment(dto);
    setComments((prev) => [created, ...prev]);
    return created;
  };

  const removeComment = async (id: number) => {
    await commentsService.deleteComment(id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    comments,
    isLoading,
    error,
    refetch: fetchMyComments,
    addComment,
    removeComment,
  };
}
