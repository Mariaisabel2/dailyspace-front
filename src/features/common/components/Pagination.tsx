"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const navigateToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    if (onPageChange) {
      onPageChange(page);
    }

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
  };

  // Generar arreglo de páginas
  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav
      className="flex items-center justify-center gap-1.5 my-8"
      aria-label="Paginación del catálogo"
    >
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1.5 rounded-lg border border-amber-200 bg-white text-xs font-semibold text-[#292524] hover:bg-amber-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
      >
        ← Anterior
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-2 py-1 text-xs text-stone-400"
          >
            ...
          </span>
        ) : (
          <button
            key={`page-${p}`}
            onClick={() => navigateToPage(Number(p))}
            className={`min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              p === currentPage
                ? "bg-[#d97706] text-white shadow-xs"
                : "bg-white border border-amber-200 text-[#292524] hover:bg-amber-50"
            }`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1.5 rounded-lg border border-amber-200 bg-white text-xs font-semibold text-[#292524] hover:bg-amber-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
      >
        Siguiente →
      </button>
    </nav>
  );
};
