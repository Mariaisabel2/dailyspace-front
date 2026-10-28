import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-amber-200 bg-white/70 py-8 text-center text-sm text-[#78716c]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-[#d97706]">
          <span>✨</span>
          <span>DailySpace — Tu Diario Digital</span>
        </div>
        <p className="text-xs text-stone-500">
          Desarrollo Web · Universidad de Medellín · Proyecto Fullstack
        </p>
        <div className="text-xs text-stone-600">
          <span>Estudiante: </span>
          <strong className="text-[#292524]">María Isabel Zuluaga Quintero</strong>
        </div>
      </div>
    </footer>
  );
};
