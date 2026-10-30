"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../../common/components/Button";
import { Input } from "../../common/components/Input";
import { HttpError } from "../../common/http";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      router.push("/");
      router.refresh();
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.statusCode === 401) {
          // Error 401 genérico según rúbrica: no revela si falló el email o la contraseña
          setErrors({
            general: "Credenciales inválidas. Verifica tu correo y contraseña.",
            password: "Credenciales inválidas",
          });
        } else {
          setErrors({ general: err.message });
        }
      } else {
        setErrors({ general: "Error al iniciar sesión. Intenta nuevamente." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border-2 border-[#ffe066] rounded-3xl p-8 shadow-[0_10px_25px_rgba(217,119,6,0.08)]">
      <div className="text-center mb-6">
        <span className="text-4xl block mb-2">💛</span>
        <h1 className="text-2xl font-extrabold text-[#292524] tracking-tight">
          ¡Bienvenido a DailySpace!
        </h1>
        <p className="text-xs sm:text-sm text-[#78716c] mt-1">
          Ingresa tus datos para explorar y escribir tu bitácora diaria.
        </p>
      </div>

      {errors.general && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
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

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
        >
          Entrar a DailySpace
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-[#78716c]">
        ¿No tienes una cuenta aún?{" "}
        <Link
          href="/registro"
          className="font-bold text-[#d97706] hover:underline"
        >
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
};
