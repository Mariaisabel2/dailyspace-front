import React, { Suspense } from "react";
import { Navbar, Footer } from "@/features/common/components";
import { FeedContent, PostSkeleton } from "@/features/posts/components";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbf7]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section de DailySpace (Entrega 1) */}
        <section className="text-center py-10 sm:py-14 mb-8 bg-gradient-to-b from-[#fff9db]/80 to-transparent rounded-3xl border border-amber-200/50 p-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#b45309] text-xs font-bold mb-4 border border-amber-200">
            <span>✨</span>
            <span>Tu bitácora comunitaria favorita</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#292524] tracking-tight max-w-3xl mx-auto leading-tight">
            Descubre y comparte vivencias del día a día
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#78716c] max-w-xl mx-auto leading-relaxed">
            Un espacio donde cada momento cuenta. Escribe tu diario, inspírate con
            historias de otros y conecta con la comunidad.
          </p>
        </section>

        {/* Contenido del Feed envuelto en Suspense para soporte de searchParams */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostSkeleton key={`suspense-skeleton-${i}`} />
              ))}
            </div>
          }
        >
          <FeedContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
