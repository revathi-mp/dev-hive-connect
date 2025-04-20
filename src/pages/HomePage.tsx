
import { MainLayout } from "@/components/layout/MainLayout";
import { PostCard } from "@/components/forum/PostCard";
import { CategoryCard } from "@/components/forum/CategoryCard";
import { TagList } from "@/components/forum/TagList";
import { mockPosts, mockCategories, mockTags } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Code, FileCode, Settings, BookOpen, Bell, Users } from "lucide-react";

const iconMap = {
  "Code": Code,
  "FileCode": FileCode,
  "Settings": Settings,
  "BookOpen": BookOpen,
  "Bell": Bell,
  "Users": Users,
};

export default function HomePage() {
  // Map string icon names to actual icon components
  const categoriesWithIcons = mockCategories.map(category => ({
    ...category,
    icon: iconMap[category.icon as keyof typeof iconMap]
  }));

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="mb-8 flex flex-col-reverse justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">DevHive Connect</h1>
            <p className="mt-1 text-lg text-muted-foreground">
              Where developers collaborate, share knowledge, and grow together
            </p>
          </div>
          <Button className="md:w-auto" size="lg">
            <Plus className="mr-1 h-4 w-4" />
            New Post
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Latest Discussions</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {mockPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="mb-4 text-xl font-semibold">Categories</h2>
              <div className="space-y-3">
                {categoriesWithIcons.slice(0, 4).map((category) => (
                  <CategoryCard key={category.slug} category={category} />
                ))}
                <Button variant="outline" className="w-full justify-center" size="sm">
                  View All Categories
                </Button>
              </div>
            </section>

            <section>
              <TagList tags={mockTags.slice(0, 9)} />
              <Button variant="outline" className="mt-3 w-full justify-center" size="sm">
                View All Tags
              </Button>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
