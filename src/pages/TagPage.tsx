
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PostCard } from "@/components/forum/PostCard";
import { TagList } from "@/components/forum/TagList";
import { mockPosts, mockTags } from "@/data/mockData";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function TagPage() {
  const { tagName } = useParams<{ tagName: string }>();
  
  // Filter posts that have the current tag
  const filteredPosts = mockPosts.filter(post => 
    post.tags.some(tag => tag.toLowerCase() === tagName?.toLowerCase())
  );

  // Filter out the current tag from the tag list
  const otherTags = mockTags.filter(tag => tag.name !== tagName);

  return (
    <MainLayout>
      <div className="container">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Posts tagged with <span className="text-primary">#{tagName}</span>
            </h1>
            <p className="text-muted-foreground">
              Found {filteredPosts.length} posts with this tag
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
                    There are no posts with the tag #{tagName} yet.
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
              <TagList tags={otherTags} title="Other Popular Tags" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
