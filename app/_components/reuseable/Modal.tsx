import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent rendering if not open
  if (!isOpen) return null;

  return (
    // Backdrop overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
      dir="rtl" // Added RTL to match your Arabic UI
    >
      <div
        className="relative w-full max-w-2xl flex max-h-[85vh] flex-col overflow-hidden rounded-xl border border-border bg-marketplace-card shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent clicking inside modal from closing it
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 sm:px-6 sm:py-4 bg-marketplace-bg">
          <h2 className="text-xl font-bold text-marketplace-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-marketplace-text-secondary transition-colors hover:bg-marketplace-card-hover hover:text-marketplace-text-primary focus:outline-none focus:ring-2 focus:ring-marketplace-accent"
            aria-label="إغلاق"
          >
            {/* Simple Close (X) Icon */}
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="text-marketplace-text-secondary leading-relaxed">
            {children}
          </div>
        </div>

        {/* Optional Footer/Actions - uncomment if needed */}
        <div className="border-t border-border p-4 sm:px-6 bg-marketplace-bg flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-marketplace-accent px-4 py-2 text-primary-foreground hover:opacity-90 transition-opacity"
          >
            حسناً
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
