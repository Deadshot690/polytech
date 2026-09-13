import { Search, X } from "lucide-react";

interface BlogSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function BlogSearch({
  value,
  onChange,
  placeholder = "Search insights...",
}: BlogSearchProps) {
  return (
    <div className="relative w-full sm:w-72 md:w-80">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-border/80 bg-card/70 py-2.5 pl-10 pr-9 text-xs text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
