"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../../common/components/Modal";
import { Button } from "../../common/components/Button";
import { Input } from "../../common/components/Input";
import { Post, UpdatePostDto, PostVisibility } from "../../posts/domain/post";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onSave: (id: number, dto: UpdatePostDto) => Promise<void> | void;
  isSaving?: boolean;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  post,
  onSave,
  isSaving = false,
}) => {
  const [title, setTitle] = useState("");
  const [media, setMedia] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<PostVisibility>("Público");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setMedia(post.media || "");
      setContent(post.content);
      setVisibility(post.visibility);
      setError(null);
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.length < 5) {
      setError("El título debe tener al menos 5 caracteres");
      return;
    }
    if (!content.trim()) {
      setError("El contenido no puede estar vacío");
      return;
    }
    if (!post) return;

    setError(null);
    await onSave(post.id, {
      title: title.trim(),
      media: media.trim() || undefined,
      content: content.trim(),
      visibility,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar Publicación #${post?.id}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
            {error}
          </div>
        )}

        <Input
          label="Título de la entrada:"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
        />

        <Input
          label="URL de imagen:"
          value={media}
          onChange={(e) => setMedia(e.target.value)}
          placeholder="https://..."
        />

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-[#292524] mb-1.5">
            Contenido:
          </label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-[#292524] mb-1.5">
            Visibilidad:
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as PostVisibility)}
            className="px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="Público">🟢 Público</option>
            <option value="Privado">🔒 Privado</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-amber-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};
