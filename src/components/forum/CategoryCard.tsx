
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  category: {
    name: string;
    description: string;
    icon: LucideIcon;
    slug: string;
    postCount: number;
    threadCount: number;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="flex items-start gap-4 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="rounded-md bg-primary/10 p-2 text-primary">
        <category.icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-medium">{category.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {category.description}
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {category.threadCount}
          </span>{" "}
          threads{" "}
          <span className="mx-1">•</span>
          <span className="font-medium text-foreground">
            {category.postCount}
          </span>{" "}
          posts
        </div>
      </div>
    </Link>
  );
}
