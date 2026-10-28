"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../../common/components/Button";
import { Input } from "../../common/components/Input";
import { HttpError } from "../../common/http";

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "El nombre de usuario es obligatorio";
    } else if (name.trim().length < 3) {
      newErrors.name = "Mínimo 3 caracteres";
    }

    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      router.push("/");
      router.refresh();
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.statusCode === 409) {
          // Rúbrica: Error 409 visible junto al campo de email, sin alert()
          setErrors({
            email: "Este correo electrónico ya está registrado. Intenta con otro o inicia sesión.",
          });
        } else {
          setErrors({ general: err.message });
        }
      } else {
        setErrors({ general: "Error al registrar la cuenta. Intenta de nuevo." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border-2 border-[#ffe066] rounded-3xl p-8 shadow-[0_10px_25px_rgba(217,119,6,0.08)]">
      <div className="text-center mb-6">
        <span className="text-4xl block mb-2">✨</span>
        <h1 className="text-2xl font-extrabold text-[#292524] tracking-tight">
          Crea tu cuenta en DailySpace
        </h1>
        <p className="text-xs sm:text-sm text-[#78716c] mt-1">
          Únete a la comunidad de diarios personales y reflexiones.
        </p>
      </div>

      {errors.general && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Nombre de usuario:"
          id="name"
          name="name"
          placeholder="ej. mariaisabel"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <Input
          label="Correo electrónico:"
          id="email"
          name="email"
          type="email"
          placeholder="usuario@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <Input
          label="Contraseña:"
          id="password"
          name="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <Input
          label="Confirmar contraseña:"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Repite tu contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
        >
          Crear mi cuenta
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-[#78716c]">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-bold text-[#d97706] hover:underline"
        >
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
};
