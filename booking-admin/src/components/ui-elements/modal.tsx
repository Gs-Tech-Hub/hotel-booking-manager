import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, content, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-dark rounded-lg shadow-lg w-full max-w-lg p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-3 text-dark dark:text-white">{title}</h3>
        <div className="mb-3 text-sm text-gray-700 dark:text-gray-300">{content}</div>
        {footer && <div className="mt-3">{footer}</div>}
      </div>
    </div>
  );
}
