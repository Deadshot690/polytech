interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categoryCounts: Record<string, number>;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryFilterProps) {
  return (
    <div className="no-scrollbar -mx-5 flex items-center gap-2 overflow-x-auto px-5 py-2 sm:mx-0 sm:flex-wrap sm:px-0">
      {categories.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
        const count = categoryCounts[cat] ?? 0;

        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isSelected
                ? "btn-primary shadow-md shadow-brand/25"
                : "border border-border/70 bg-card/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {cat}
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
