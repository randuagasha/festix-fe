type EventCategoriesProps = {
  categories: string[];
  onSelect: (category: string) => void;
};

export function EventCategories({
  categories,
  onSelect,
}: EventCategoriesProps) {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl overflow-x-auto px-6 lg:px-8">
        <div className="flex min-w-max gap-7">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className="py-4 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}