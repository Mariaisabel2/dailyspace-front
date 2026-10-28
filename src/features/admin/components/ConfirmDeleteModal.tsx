"use client";

import React from "react";
import { Modal } from "../../common/components/Modal";
import { Button } from "../../common/components/Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  itemTitle: string;
  isDeleting?: boolean;
}

/**
 * Modal de confirmación antes de eliminar en el panel de administración (Bono +1 pt).
 */
export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  isDeleting = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar eliminación"
      maxWidth="sm"
    >
      <div className="space-y-4 text-center sm:text-left">
        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-3xl">⚠️</span>
          <div>
            <h4 className="text-xs font-bold text-red-900 uppercase tracking-wide">
              Acción irreversible
            </h4>
            <p className="text-xs text-red-700">
              ¿Estás seguro de que deseas eliminar esta publicación del catálogo?
            </p>
          </div>
        </div>

        <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#292524]">
          <span className="text-stone-500 font-semibold block mb-0.5">Título de la entrada:</span>
          <strong className="line-clamp-2">{itemTitle}</strong>
        </div>

        <div className="flex gap-2 justify-end pt-3 border-t border-amber-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isDeleting}
          >
            Sí, eliminar publicación
          </Button>
        </div>
      </div>
    </Modal>
  );
};
