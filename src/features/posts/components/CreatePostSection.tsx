"use client";

import React, { useState, useRef } from "react";
import { CreatePostDto, PostVisibility } from "../domain/post";
import { postsService } from "../services/postsService";
import { Button } from "../../common/components/Button";
import { Input } from "../../common/components/Input";

interface CreatePostSectionProps {
  onPostCreated?: () => void;
  currentUser?: { name: string } | null;
}

export const CreatePostSection: React.FC<CreatePostSectionProps> = ({
  onPostCreated,
  currentUser,
}) => {
  const [title, setTitle] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<PostVisibility>("Público");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Errores campo a campo (sin alert())
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    media?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejador de subida de archivo de imagen (Bonus +4 pts)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        media: "Por favor selecciona un archivo de imagen válido",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        media: "La imagen no debe superar los 5 MB",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, media: undefined }));

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setMediaUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    const newErrors: { title?: string; content?: string } = {};

    if (title.trim().length < 5) {
      newErrors.title = "El título debe tener al menos 5 caracteres";
    }

    if (!content.trim()) {
      newErrors.content = "El contenido no puede estar vacío";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const dto: CreatePostDto = {
        title: title.trim(),
        media:
          mediaUrl.trim() ||
          "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
        content: content.trim(),
        visibility,
      };

      await postsService.createPost(dto, currentUser?.name || "mariaisabel");

      // Limpiar formulario
      setTitle("");
      setMediaUrl("");
      setContent("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setSuccessMessage("¡Entrada publicada con éxito en tu bitácora! ✨");
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setErrors({
        content:
          err instanceof Error
            ? err.message
            : "Error al publicar la entrada",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="create"
      className="my-10 bg-white border-2 border-[#ffe066] rounded-2xl p-6 sm:p-8 shadow-[0_4px_16px_rgba(217,119,6,0.06)] max-w-3xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">✍️</span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#292524]">
          Crear nueva entrada en tu blog
        </h2>
      </div>
      <p className="text-xs sm:text-sm text-[#78716c] mb-6">
        Escribe lo que hiciste hoy, añade una imagen y compártelo con la comunidad.
      </p>

      {successMessage && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Título de la entrada */}
        <Input
          label="Título de tu entrada:"
          id="postTitle"
          name="postTitle"
          placeholder="Ej. Día de simulación en Python"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />

        {/* URL o Archivo de Imagen (Bonus +4 pts) */}
        <div className="flex flex-col mb-4">
          <label className="text-sm font-semibold text-[#292524] mb-1.5 flex items-center justify-between">
            <span>Imagen de la entrada (URL o archivo):</span>
            <span className="text-xs text-amber-700 font-normal">
              🎁 Bonus: Subida de archivo
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            <input
              type="url"
              placeholder="https://ejemplo.com/foto.jpg"
              value={mediaUrl.startsWith("data:") ? "" : mediaUrl}
              onChange={(e) => {
                setMediaUrl(e.target.value);
                setImagePreview(e.target.value || null);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-400"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
            />
          </div>

          {errors.media && (
            <span className="text-xs text-red-600 font-medium">{errors.media}</span>
          )}

          {imagePreview && (
            <div className="relative mt-2 w-32 h-20 rounded-lg overflow-hidden border border-amber-300 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setMediaUrl("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Contenido / ¿Qué hiciste hoy? */}
        <div className="flex flex-col mb-4">
          <label
            htmlFor="postContent"
            className="text-sm font-semibold text-[#292524] mb-1.5"
          >
            ¿Qué hiciste hoy?
          </label>
          <textarea
            id="postContent"
            rows={4}
            placeholder="Detalles de tu día, aprendizajes, código o reflexiones..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`px-3.5 py-2.5 rounded-lg border bg-white text-[#292524] text-sm focus:outline-none focus:ring-2 placeholder:text-stone-400 ${
              errors.content
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-stone-300 focus:border-amber-500 focus:ring-amber-200"
            }`}
          />
          {errors.content ? (
            <span className="text-xs text-red-600 font-medium mt-1">
              {errors.content}
            </span>
          ) : (
            <span className="min-h-[1.1rem]" />
          )}
        </div>

        {/* Visibilidad */}
        <div className="flex flex-col mb-6">
          <label
            htmlFor="postVisibility"
            className="text-sm font-semibold text-[#292524] mb-1.5"
          >
            Visibilidad:
          </label>
          <select
            id="postVisibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as PostVisibility)}
            className="px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-[#292524] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Público">🟢 Público (Todos)</option>
            <option value="Privado">🔒 Privado (Solo seguidores)</option>
          </select>
        </div>

        {/* Botón de Enviar */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
        >
          Publicar Entrada
        </Button>
      </form>
    </section>
  );
};
