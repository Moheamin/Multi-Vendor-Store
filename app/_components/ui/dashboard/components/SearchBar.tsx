import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-marketplace-text-secondary" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2 pr-10 pl-4 transition-colors border rounded-lg outline-none 
                   bg-marketplace-bg border-border text-marketplace-text-primary 
                   focus:border-marketplace-accent placeholder:text-marketplace-text-secondary/50"
      />
    </div>
  );
}
