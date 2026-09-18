import type { EventCategory } from "@/components/home/home-page";

type EventCategoriesProps = {
  selected: EventCategory;
  onSelect: (category: EventCategory) => void;
};

const categories: EventCategory[] = [
  "All",
  "Music",
  "Festival",
  "Sports",
  "Comedy",
  "Theater",
  "Workshop",
];

export function EventCategories({
  selected,
  onSelect,
}: EventCategoriesProps) {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl overflow-x-auto px-6 lg:px-8">
        <div className="flex min-w-max gap-7">
          {categories.map((category) => {
            const active = selected === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelect(category)}
                className={`relative py-4 font-sans text-sm transition-colors ${
                  active
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}

                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}