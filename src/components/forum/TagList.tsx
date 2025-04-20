
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface TagListProps {
  tags: {
    name: string;
    count: number;
  }[];
  title?: string;
}

export function TagList({ tags, title = "Popular Tags" }: TagListProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-medium">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag.name} to={`/tag/${tag.name}`}>
            <Badge variant="secondary" className="text-xs">
              {tag.name}
              <span className="ml-1 text-muted-foreground">({tag.count})</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
