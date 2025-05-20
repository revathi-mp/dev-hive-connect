
import { Link } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Code,
  FileCode,
  Home,
  MessageSquare,
  Settings,
  Users,
  Tag,
  Briefcase
} from "lucide-react";

const categories = [
  { name: "Frontend", icon: Code, slug: "frontend", count: 325 },
  { name: "Backend", icon: FileCode, slug: "backend", count: 284 },
  { name: "DevOps", icon: Settings, slug: "devops", count: 192 },
  { name: "Mobile", icon: BookOpen, slug: "mobile", count: 157 },
  { name: "ML/AI", icon: Bell, slug: "ai", count: 134 },
  { name: "Career", icon: Users, slug: "career", count: 89 },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r bg-sidebar md:block">
      <div className="flex h-full flex-col">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Link
                to="/"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
              <Link
                to="/trending"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Trending
              </Link>
              <Link
                to="/interview-questions"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Interview Questions
              </Link>
              <Link
                to="/tags"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Tag className="mr-2 h-4 w-4" />
                Tags
              </Link>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-sm font-semibold text-sidebar-foreground/70">
              Categories
            </h2>
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-xs text-sidebar-foreground/50">
                    {category.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
