
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PostCard } from "@/components/forum/PostCard";
import { CategoryCard } from "@/components/forum/CategoryCard";
import { TagList } from "@/components/forum/TagList";
import { mockPosts, mockCategories, mockTags } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Code, FileCode, Settings, BookOpen, Bell, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NewPostModal } from "@/components/forum/NewPostModal";

const iconMap = {
  "Code": Code,
  "FileCode": FileCode,
  "Settings": Settings,
  "BookOpen": BookOpen,
  "Bell": Bell,
  "Users": Users,
};

export default function HomePage() {
  // New state for modal and searching
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(mockPosts);

  // Map string icon names to actual icon components
  const categoriesWithIcons = mockCategories.map(category => ({
    ...category,
    icon: iconMap[category.icon as keyof typeof iconMap]
  }));

  // Filter posts by title/excerpt based on search query
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handler for new post submit (add new post to top)
  const handleNewPost = (newPost) => {
    // Create a complete post object with all required fields
    const completePost = {
      ...newPost,
      id: Date.now().toString(),
      excerpt: newPost.content.substring(0, 120) + (newPost.content.length > 120 ? "..." : ""),
      author: {
        name: "Current User", // For demo purposes
        avatar: "https://i.pravatar.cc/100?img=7" 
      },
      category: "General",
      tags: ["general"],
      commentCount: 0,
      upvoteCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setPosts([completePost, ...posts]);
    setModalOpen(false);
  };

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
          <Button className="md:w-auto" size="lg" onClick={() => setModalOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            New Post
          </Button>
        </div>
        {/* Search input for discussions */}
        <div className="mb-8 flex w-full max-w-md items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            className="pl-9"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
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
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground border rounded-md">
                    No discussions found.
                  </div>
                )}
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
      <NewPostModal open={modalOpen} onOpenChange={setModalOpen} onSubmit={handleNewPost} />
    </MainLayout>
  );
}
