
import { MainLayout } from "@/components/layout/MainLayout";
import { mockTags } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter tags based on search query
  const filteredTags = mockTags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <MainLayout>
      <div className="container">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Browse Tags</h1>
            <p className="text-muted-foreground">
              Find discussions by topic tags
            </p>
          </div>
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tags..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTags.map((tag) => (
              <Link
                key={tag.name}
                to={`/tag/${tag.name}`}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary hover:shadow-sm transition-all"
              >
                <Badge variant="secondary" className="text-sm">
                  {tag.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {tag.count} posts
                </span>
              </Link>
            ))}
          </div>
          
          {filteredTags.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
              <h3 className="text-lg font-medium">No tags found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try different search terms
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
