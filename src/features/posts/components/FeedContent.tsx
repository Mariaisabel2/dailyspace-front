"use client";

import React, { useState, useEffect } from "react";
import { usePosts } from "../hooks/usePosts";
import { PostFilterTabs } from "./PostFilterTabs";
import { PostsGrid } from "./PostsGrid";
import { CreatePostSection } from "./CreatePostSection";
import { Pagination } from "../../common/components/Pagination";
import { APP_CONFIG } from "../../common/config";
import { commentsService } from "../../comments/services/commentsService";

export const FeedContent: React.FC = () => {
  const {
    posts,
    pagination,
    isLoading,
    error,
    isEmpty,
    refetch,
    handleLike,
  } = usePosts({ limit: 6 });

  const [currentUser, setCurrentUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(APP_CONFIG.userStorageKey);
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // Ignorar errores
    }
  }, []);

  const handleAddComment = async (postId: number, comment: string) => {
    try {
      await commentsService.createComment({ postId, content: comment });
    } catch (err) {
      console.error("Error al crear comentario:", err);
    }
  };

  return (
    <div className="space-y-12">
      {/* Sección del Formulario de Creación de Entrada */}
      <CreatePostSection
        onPostCreated={refetch}
        currentUser={currentUser}
      />

      {/* Sección del Feed "Para ti" */}
      <section id="feed" className="scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292524] tracking-tight flex items-center gap-2">
              <span>Para ti</span>
              <span className="text-base font-normal text-[#78716c]">
                ({pagination.total} vivencias)
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c] mt-1">
              Explora las vivencias y reflexiones compartidas por la comunidad.
            </p>
          </div>
        </div>

        {/* Filtros combinados de Visibilidad y Búsqueda */}
        <PostFilterTabs />

        {/* Grilla de Publicaciones */}
        <PostsGrid
          posts={posts}
          isLoading={isLoading}
          error={error}
          isEmpty={isEmpty}
          onLike={handleLike}
          onAddComment={handleAddComment}
          currentUserName={currentUser?.name}
          onRetry={refetch}
        />

        {/* Paginación por URL (?page=X) */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
        />
      </section>
    </div>
  );
};
