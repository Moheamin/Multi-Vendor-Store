"use client";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({
  label,
  error,
  children,
  required,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-black text-marketplace-text-secondary uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full bg-marketplace-bg border ${
        error ? "border-red-500/50" : "border-marketplace-border"
      } focus:border-marketplace-accent/40 rounded-2xl px-4 py-3 outline-none text-marketplace-text-primary font-bold transition-all placeholder:text-marketplace-text-secondary/40 ${className}`}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: React.ReactNode;
}

export function Select({
  error,
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <select
      {...props}
      className={`w-full bg-marketplace-bg border ${
        error ? "border-red-500/50" : "border-marketplace-border"
      } focus:border-marketplace-accent/40 rounded-2xl px-4 py-3 outline-none text-marketplace-text-primary font-bold transition-all appearance-none cursor-pointer ${className}`}
    >
      {children}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className = "", ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={`w-full bg-marketplace-bg border ${
        error ? "border-red-500/50" : "border-marketplace-border"
      } focus:border-marketplace-accent/40 rounded-2xl px-4 py-3 outline-none text-marketplace-text-primary font-bold transition-all placeholder:text-marketplace-text-secondary/40 resize-none ${className}`}
    />
  );
}

interface SubmitButtonProps {
  isLoading?: boolean;
  label?: string;
  loadingLabel?: string;
  className?: string;
}

export function SubmitButton({
  isLoading,
  label = "حفظ",
  loadingLabel = "جاري الحفظ...",
  className = "",
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-marketplace-accent text-white rounded-2xl font-black hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-marketplace-accent/20 ${className}`}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
