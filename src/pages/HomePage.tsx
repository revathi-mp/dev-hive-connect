
import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PostCard } from "@/components/forum/PostCard";
import { CategoryCard } from "@/components/forum/CategoryCard";
import { TagList } from "@/components/forum/TagList";
import { mockPosts, mockCategories, mockTags } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Code, FileCode, Settings, BookOpen, Bell, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NewPostModal } from "@/components/forum/NewPostModal";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/contexts/AuthContext";

const iconMap = {
  "Code": Code,
  "FileCode": FileCode,
  "Settings": Settings,
  "BookOpen": BookOpen,
  "Bell": Bell,
  "Users": Users,
};

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(mockPosts);
  const [viewAllPosts, setViewAllPosts] = useState(false);
  const { user } = useAuth();

  const categoriesWithIcons = mockCategories.map(category => ({
    ...category,
    icon: iconMap[category.icon as keyof typeof iconMap]
  }));

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const postsToDisplay = viewAllPosts ? filteredPosts : filteredPosts.slice(0, 3);

  const handleNewPost = (newPost) => {
    const completePost = {
      ...newPost,
      id: Date.now().toString(),
      excerpt: newPost.content.substring(0, 120) + (newPost.content.length > 120 ? "..." : ""),
      author: {
        name: "Current User",
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
    setSearchQuery("");
  };

  const handleViewAllPosts = () => {
    setViewAllPosts(true);
  };

  const handleViewLessPosts = () => {
    setViewAllPosts(false);
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="mb-8 flex flex-col-reverse justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Logo size="lg" className="text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">DevHive Connect</h1>
              <p className="mt-1 text-lg text-muted-foreground">
                Where developers collaborate, share knowledge, and grow together
              </p>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <Button className="md:w-auto" size="lg" onClick={() => setModalOpen(true)}>
                <Plus className="mr-1 h-4 w-4" />
                New Post
              </Button>
            </div>
          )}
        </div>

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
                {viewAllPosts ? (
                  <Button variant="outline" size="sm" onClick={handleViewLessPosts}>
                    View Less
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleViewAllPosts}>
                    View All
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {postsToDisplay.length > 0 ? (
                  postsToDisplay.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground border rounded-md">
                    No discussions found.
                  </div>
                )}
                {!viewAllPosts && filteredPosts.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2" 
                    onClick={handleViewAllPosts}
                  >
                    Show {filteredPosts.length - 3} more discussions
                  </Button>
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
                <Button 
                  variant="outline" 
                  className="w-full justify-center" 
                  size="sm"
                  asChild
                >
                  <Link to="/tags">View All Categories</Link>
                </Button>
              </div>
            </section>
            <section>
              <TagList tags={mockTags.slice(0, 9)} />
              <Button 
                variant="outline" 
                className="mt-3 w-full justify-center" 
                size="sm"
                asChild
              >
                <Link to="/tags">View All Tags</Link>
              </Button>
            </section>
          </div>
        </div>
      </div>
      {user && <NewPostModal open={modalOpen} onOpenChange={setModalOpen} onSubmit={handleNewPost} />}
    </MainLayout>
  );
}
