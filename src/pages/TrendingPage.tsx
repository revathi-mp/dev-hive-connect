
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TagList } from "@/components/forum/TagList";
import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, Eye, Clock } from "lucide-react";

// Mock trending posts data
const trendingPosts = [
  {
    id: "1",
    title: "How to optimize React performance in large applications",
    content: "I'm working on a large React application and notice significant slowdowns...",
    author: "devmaster",
    avatar: "/placeholder.svg",
    upvotes: 342,
    comments: 56,
    views: 2843,
    createdAt: "2 days ago",
    tags: ["react", "performance", "optimization"]
  },
  {
    id: "2",
    title: "Comparing TypeScript with Flow for type checking",
    content: "I've been using Flow for a while but considering TypeScript...",
    author: "typescript_fan",
    avatar: "/placeholder.svg",
    upvotes: 218,
    comments: 39,
    views: 1762,
    createdAt: "1 day ago",
    tags: ["typescript", "flow", "types"]
  },
  {
    id: "3",
    title: "Implementing WebSockets with Node.js and React",
    content: "I need to build a real-time application with WebSockets...",
    author: "socketmaster",
    avatar: "/placeholder.svg",
    upvotes: 175,
    comments: 28,
    views: 1459,
    createdAt: "3 days ago",
    tags: ["websockets", "node.js", "react"]
  },
  {
    id: "4",
    title: "Best practices for API design in 2024",
    content: "What are the current best practices for designing RESTful APIs...",
    author: "api_designer",
    avatar: "/placeholder.svg",
    upvotes: 156,
    comments: 42,
    views: 2105,
    createdAt: "4 days ago",
    tags: ["api", "rest", "design-patterns"]
  },
  {
    id: "5",
    title: "Docker vs Kubernetes for small projects",
    content: "Is Kubernetes overkill for small to medium sized projects?...",
    author: "container_enthusiast",
    avatar: "/placeholder.svg",
    upvotes: 132,
    comments: 35,
    views: 1876,
    createdAt: "2 days ago",
    tags: ["docker", "kubernetes", "devops"]
  }
];

// Mock trending tags
const trendingTags = [
  { name: "react", count: 463 },
  { name: "javascript", count: 412 },
  { name: "typescript", count: 387 },
  { name: "node.js", count: 298 },
  { name: "python", count: 276 },
  { name: "devops", count: 245 },
  { name: "docker", count: 213 },
  { name: "aws", count: 189 }
];

export default function TrendingPage() {
  return (
    <MainLayout>
      <div className="container">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trending Discussions</h1>
            <p className="text-muted-foreground">
              The most popular discussions across DevHive Connect in the last week
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {trendingPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>
                      <Link to={`/post/${post.id}`} className="hover:text-primary">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <img src={post.avatar} alt={post.author} className="w-5 h-5 rounded-full" />
                      <span>{post.author}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{post.createdAt}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2">{post.content}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((tag) => (
                        <Link key={tag} to={`/tag/${tag}`}>
                          <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                            #{tag}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {post.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/post/${post.id}`}>Read more</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="space-y-6">
              <TagList tags={trendingTags} title="Trending Tags" />
              
              <Card>
                <CardHeader>
                  <CardTitle>Popular Authors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["devmaster", "typescript_fan", "socketmaster", "api_designer", "container_enthusiast"].map((author, index) => (
                      <div key={author} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src="/placeholder.svg" alt={author} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="font-medium">{author}</p>
                            <p className="text-xs text-muted-foreground">{120 - index * 15} posts</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Follow</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
