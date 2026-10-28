import React from "react";
import Link from "next/link";
import { Navbar, Footer, Button } from "@/features/common/components";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbf7]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white border-2 border-[#ffe066] rounded-3xl p-8 sm:p-10 shadow-[0_10px_25px_rgba(217,119,6,0.08)]">
          <span className="text-6xl block mb-4 animate-bounce">🪐</span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] mt-4 mb-2 tracking-tight">
            Página no encontrada
          </h1>
          <p className="text-xs sm:text-sm text-[#78716c] mb-6 leading-relaxed">
            Parece que te has salido de órbita. La página que estás buscando en DailySpace no existe o ha sido movida.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="primary" size="md" className="w-full sm:w-auto">
                ✨ Volver al inicio
              </Button>
            </Link>
            <Link href="/mis-comentarios">
              <Button variant="secondary" size="md" className="w-full sm:w-auto">
                💬 Mis comentarios
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
