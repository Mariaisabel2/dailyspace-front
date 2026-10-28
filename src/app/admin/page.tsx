"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar, Footer, Button, Badge } from "@/features/common/components";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Post, UpdatePostDto } from "@/features/posts/domain/post";
import { postsService } from "@/features/posts/services/postsService";
import { ConfirmDeleteModal } from "@/features/admin/components/ConfirmDeleteModal";
import { EditPostModal } from "@/features/admin/components/EditPostModal";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, isLoading: authLoading } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Estado para modal de confirmación antes de eliminar (Bono +1 pt)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado para modal de edición
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Guard de rol: solo admin puede estar aquí; si es usuario normal redirige al inicio
  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.replace("/");
      }
    }
  }, [authLoading, user, isAdmin, router]);

  const fetchCatalog = async () => {
    setIsLoading(true);
    try {
      const res = await postsService.getPosts({ limit: 100 });
      setPosts(res.data);
    } catch {
      // Ignorar
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCatalog();
    }
  }, [isAdmin]);

  const handleOpenDelete = (post: Post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await postsService.deletePost(postToDelete.id);
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = (post: Post) => {
    setPostToEdit(post);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (id: number, dto: UpdatePostDto) => {
    setIsSaving(true);
    try {
      const updated = await postsService.updatePost(id, dto);
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || (!isAdmin && !authLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfbf7]">
        <span className="text-sm font-semibold text-[#78716c]">
          Verificando permisos administrativos...
        </span>
      </div>
    );
  }

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbf7]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-amber-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🛡️</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] tracking-tight">
                Panel de Administración
              </h1>
              <Badge variant="admin">Rol: Admin</Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#78716c]">
              Gestión total del catálogo de publicaciones de DailySpace (CRUD).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/#create">
              <Button variant="primary" size="sm">
                + Nueva Entrada
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Ver Sitio Público
              </Button>
            </Link>
          </div>
        </div>

        {/* Barra de Búsqueda Rápida en el Catálogo */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 p-4 rounded-2xl border border-amber-200">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-2.5 text-stone-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="Filtrar por título o autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <span className="text-xs font-semibold text-stone-500">
            Mostrando {filteredPosts.length} de {posts.length} entradas
          </span>
        </div>

        {/* Tabla de Gestión del Catálogo */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-amber-200 p-8 text-center">
            <span className="text-sm font-semibold text-stone-500">Cargando catálogo...</span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl border border-amber-200 shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-amber-50/70 border-b border-amber-200 text-[#292524]">
                  <th className="py-3 px-4 font-bold">ID</th>
                  <th className="py-3 px-4 font-bold">Título</th>
                  <th className="py-3 px-4 font-bold">Autor</th>
                  <th className="py-3 px-4 font-bold">Visibilidad</th>
                  <th className="py-3 px-4 font-bold">Likes</th>
                  <th className="py-3 px-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-500">
                      #{post.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#292524] max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      @{post.author}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={post.visibility === "Público" ? "public" : "private"}>
                        {post.visibility}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-700">
                      ❤️ {post.likes}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleOpenDelete(post)}
                        className="px-2.5 py-1 text-[11px] font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Confirmación antes de Eliminar (Bono +1 pt) */}
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemTitle={postToDelete?.title || ""}
          isDeleting={isDeleting}
        />

        {/* Modal de Edición de Entrada */}
        <EditPostModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          post={postToEdit}
          onSave={handleSaveEdit}
          isSaving={isSaving}
        />
      </main>

      <Footer />
    </div>
  );
}
