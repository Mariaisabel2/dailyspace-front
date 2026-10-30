"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Post } from "../domain/post";
import { Badge } from "../../common/components/Badge";

interface PostCardProps {
  post: Post;
  onLike?: (id: number) => void;
  onAddComment?: (postId: number, comment: string) => Promise<void> | void;
  currentUserName?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onAddComment,
  currentUserName,
}) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<string[]>(post.comments || []);
  const [likes, setLikes] = useState<number>(post.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLikeClick = () => {
    setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
    setHasLiked(!hasLiked);
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      if (onAddComment) {
        await onAddComment(post.id, trimmed);
      }
      setComments((prev) => [...prev, trimmed]);
      setCommentText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="flex flex-col justify-between bg-[#fff9db] border-2 border-[#ffe066] rounded-2xl p-5 shadow-[0_4px_14px_rgba(217,119,6,0.06)] hover:shadow-[0_8px_20px_rgba(217,119,6,0.12)] transition-all duration-200 hover:-translate-y-1">
      {/* Header de la tarjeta */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#292524] bg-white/70 px-2.5 py-1 rounded-full border border-amber-200">
            <span>👤</span>
            <span>@{post.author}</span>
          </div>
          <Badge variant={post.visibility === "Público" ? "public" : "private"}>
            {post.visibility === "Público" ? "🟢 Público" : "🔒 Privado"}
          </Badge>
        </div>

        {/* Título y Contenido */}
        <h3 className="text-lg font-bold text-[#292524] mb-2 leading-snug line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-[#78716c] mb-4 leading-relaxed line-clamp-3">
          {post.content}
        </p>

        {/* Imagen del post */}
        {post.media && (
          <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-amber-100 border border-amber-200">
            <Image
              src={post.media}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Footer de la tarjeta con Likes y Comentarios */}
      <div className="pt-3 border-t border-amber-200/80 mt-auto">
        {/* Botón de Like */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleLikeClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              hasLiked
                ? "bg-red-50 text-red-600 border border-red-200 scale-105"
                : "bg-white text-stone-700 border border-amber-200 hover:bg-amber-50"
            }`}
            aria-label={`Dar like a ${post.title}`}
          >
            <span>❤️</span>
            <span>{likes}</span>
          </button>
          <span className="text-xs text-stone-500 font-medium">
            {comments.length} {comments.length === 1 ? "comentario" : "comentarios"}
          </span>
        </div>

        {/* Lista de comentarios */}
        {comments.length > 0 && (
          <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto pr-1">
            {comments.slice(-3).map((comment, index) => (
              <div
                key={index}
                className="text-xs bg-white/80 rounded-lg p-2 border border-amber-100 text-[#292524]"
              >
                <span className="font-semibold text-amber-800 mr-1.5">💬</span>
                <span>{comment}</span>
              </div>
            ))}
            {comments.length > 3 && (
              <p className="text-[11px] text-stone-500 italic text-center">
                + {comments.length - 3} comentarios más
              </p>
            )}
          </div>
        )}

        {/* Input para agregar comentario o aviso de entrada privada */}
        {post.visibility === "Privado" ? (
          <div className="text-center py-1.5 px-3 bg-stone-100/80 border border-stone-200 rounded-lg text-[11px] text-stone-500 font-medium flex items-center justify-center gap-1.5">
            <span>🔒</span>
            <span>Entrada privada — comentarios deshabilitados</span>
          </div>
        ) : (
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder={
                currentUserName
                  ? "Escribe un comentario..."
                  : "Inicia sesión para comentar..."
              }
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!currentUserName || isSubmitting}
              className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-stone-400 disabled:opacity-60 disabled:bg-stone-50"
            />
            <button
              type="submit"
              disabled={!currentUserName || !commentText.trim() || isSubmitting}
              className="px-3 py-1.5 bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? "..." : "Enviar"}
            </button>
          </form>
        )}
      </div>
    </article>
  );
};
