"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PostVisibility } from "../domain/post";

interface PostFilterTabsProps {
  currentFilter?: string;
  onFilterChange?: (filter: string) => void;
  onSearchChange?: (query: string) => void;
}

export const PostFilterTabs: React.FC<PostFilterTabsProps> = ({
  currentFilter = "all",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeVisibility = searchParams.get("visibility") || currentFilter;
  const activeSearch = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(activeSearch);

  const updateUrlParams = (newVisibility?: string, newSearch?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Resetear a página 1 al cambiar filtros
    params.set("page", "1");

    if (newVisibility !== undefined) {
      if (newVisibility === "all") {
        params.delete("visibility");
      } else {
        params.set("visibility", newVisibility);
      }
    }

    if (newSearch !== undefined) {
      if (!newSearch.trim()) {
        params.delete("q");
      } else {
        params.set("q", newSearch.trim());
      }
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterClick = (filter: string) => {
    updateUrlParams(filter, undefined);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams(undefined, searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateUrlParams(undefined, "");
  };

  const tabs: { label: string; value: "all" | PostVisibility }[] = [
    { label: "Todos", value: "all" },
    { label: "Públicos", value: "Público" },
    { label: "Privados", value: "Privado" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/70 p-3 rounded-2xl border border-amber-200">
      {/* Botones de filtro por visibilidad */}
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider hidden sm:inline mr-1">
          Ver:
        </span>
        {tabs.map((tab) => {
          const isActive =
            activeVisibility === tab.value ||
            (tab.value === "all" && !activeVisibility);

          return (
            <button
              key={tab.value}
              onClick={() => handleFilterClick(tab.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#d97706] text-white shadow-xs"
                  : "bg-white text-[#292524] border border-amber-200 hover:bg-amber-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Buscador de texto combinado (Bono +2 pts) */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative w-full md:w-72 flex items-center"
      >
        <span className="absolute left-3 text-stone-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Buscar en vivencias..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-9 pr-14 py-1.5 text-xs bg-white border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-400"
        />
        {searchInput ? (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-10 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
          >
            ✕
          </button>
        ) : null}
        <button
          type="submit"
          className="absolute right-1 px-2.5 py-1 bg-[#d97706] hover:bg-[#b45309] text-white text-[11px] font-bold rounded-full transition-colors cursor-pointer"
        >
          Ir
        </button>
      </form>
    </div>
  );
};
