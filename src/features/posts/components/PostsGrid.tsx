import React from "react";
import { Post } from "../domain/post";
import { PostCard } from "./PostCard";
import { PostSkeleton } from "./PostSkeleton";

interface PostsGridProps {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  onLike?: (id: number) => void;
  onAddComment?: (postId: number, comment: string) => Promise<void> | void;
  currentUserName?: string;
  onRetry?: () => void;
}

export const PostsGrid: React.FC<PostsGridProps> = ({
  posts,
  isLoading,
  error,
  isEmpty,
  onLike,
  onAddComment,
  currentUserName,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4 bg-red-50 border border-red-200 rounded-2xl my-6">
        <span className="text-4xl block mb-2">⚠️</span>
        <h3 className="text-base font-bold text-red-800 mb-1">
          Ocurrió un error al cargar las publicaciones
        </h3>
        <p className="text-xs text-red-600 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-16 px-4 bg-white/70 border border-amber-200 rounded-2xl my-6">
        <span className="text-4xl block mb-2">📖</span>
        <h3 className="text-base font-bold text-[#292524] mb-1">
          No hay publicaciones para mostrar
        </h3>
        <p className="text-xs text-[#78716c]">
          Intenta cambiar el filtro de visibilidad o el término de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onAddComment={onAddComment}
          currentUserName={currentUserName}
        />
      ))}
    </div>
  );
};
