"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar, Footer, Button } from "@/features/common/components";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useComments } from "@/features/comments/hooks/useComments";

export default function MyCommentsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { comments, isLoading, error, removeComment, refetch } = useComments();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfbf7]">
        <span className="text-sm font-semibold text-[#78716c]">Verificando sesión...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbf7]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">💬</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] tracking-tight">
                Mis Comentarios
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#78716c]">
              Historial de tus comentarios e interacciones en DailySpace (@{user?.name}).
            </p>
          </div>

          <Link href="/">
            <Button variant="secondary" size="sm">
              ← Volver al feed
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#fff9db]/50 border-2 border-[#ffe066]/50 rounded-2xl p-5 h-24"
              />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white/70 border border-amber-200 rounded-3xl my-6">
            <span className="text-4xl block mb-2">💬</span>
            <h2 className="text-lg font-bold text-[#292524] mb-1">
              Aún no has escrito ningún comentario
            </h2>
            <p className="text-xs text-[#78716c] mb-6">
              Explora las publicaciones del feed y comparte tus opiniones con los autores.
            </p>
            <Link href="/">
              <Button variant="primary" size="md">
                Explorar vivencias en el feed
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <article
                key={c.id}
                className="bg-[#fff9db] border-2 border-[#ffe066] rounded-2xl p-5 shadow-[0_4px_12px_rgba(217,119,6,0.06)] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-amber-900 bg-white/80 px-2 py-0.5 rounded-full border border-amber-200">
                      Entrada #{c.postId}
                    </span>
                    {c.postTitle && (
                      <span className="text-xs font-bold text-[#292524] line-clamp-1">
                        {c.postTitle}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#292524] font-medium pl-1">
                    &ldquo;{c.content}&rdquo;
                  </p>
                  <span className="text-[11px] text-[#78716c] block mt-2">
                    {new Date(c.createdAt).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div>
                  <button
                    onClick={() => removeComment(c.id)}
                    className="px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
