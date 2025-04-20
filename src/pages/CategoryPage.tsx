
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PostCard } from "@/components/forum/PostCard";
import { TagList } from "@/components/forum/TagList";
import { mockPosts, mockTags, mockCategories } from "@/data/mockData";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  
  // Find the current category
  const currentCategory = mockCategories.find(cat => cat.slug === categorySlug);
  
  // Filter posts that are in this category
  const filteredPosts = mockPosts.filter(post => 
    post.category.toLowerCase() === currentCategory?.name.toLowerCase()
  );

  // Get popular tags for sidebar
  const popularTags = mockTags.slice(0, 10);

  return (
    <MainLayout>
      <div className="container">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {currentCategory?.name || "Category"}
            </h1>
            <p className="text-muted-foreground">
              {currentCategory?.description || "Browse discussions in this category"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      id: post.id,
                      title: post.title,
                      excerpt: post.excerpt,
                      author: post.author,
                      category: post.category,
                      tags: post.tags,
                      commentCount: post.commentCount,
                      upvoteCount: post.upvoteCount,
                      createdAt: post.createdAt,
                      isHot: post.isHot
                    }}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
                  <h3 className="text-lg font-medium">No posts found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    There are no posts in this category yet.
                  </p>
                </div>
              )}

              {filteredPosts.length > 0 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>

            <div className="space-y-6">
              <TagList tags={popularTags} title="Popular Tags" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
