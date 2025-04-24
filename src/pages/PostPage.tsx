import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { TagList } from "@/components/forum/TagList";
import { mockPosts, mockTags } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, ThumbsDown, Eye, Clock, ArrowUp } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "@/components/forum/CommentForm";
import { useToast } from "@/hooks/use-toast";
import { Comment } from "@/components/forum/types";

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [upvotes, setUpvotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const { toast } = useToast();
  
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "John Doe",
      content: "Great post! I've been working with React optimization lately and found that useMemo can really help with complex renders.",
      createdAt: "2 days ago",
      likes: 12,
      isLiked: false
    },
    {
      id: "2",
      author: "Alex Smith",
      content: "Have you tried using React.memo for component memoization? It really helped in my case.",
      createdAt: "1 day ago",
      likes: 8,
      isLiked: false
    },
    {
      id: "3",
      author: "Code Master",
      content: "Here's a simple JavaScript example to calculate Fibonacci numbers:\n\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}\n\nconsole.log(fibonacci(10)); // Output: 55\n```\n\nYou can try it right here in the playground!",
      createdAt: "5 hours ago",
      likes: 15,
      isLiked: false
    },
    {
      id: "4",
      author: "Web Designer",
      content: "Check out this HTML/CSS button:\n\n```html\n<button class=\"fancy-button\">Click me!</button>\n\n<style>\n.fancy-button {\n  background: linear-gradient(45deg, #ff6b6b, #ffa8a8);\n  border: none;\n  color: white;\n  padding: 10px 20px;\n  border-radius: 50px;\n  font-weight: bold;\n  box-shadow: 0 4px 8px rgba(0,0,0,0.1);\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n\n.fancy-button:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 12px rgba(0,0,0,0.15);\n}\n</style>\n```\n\nYou can see how it looks right in the preview!",
      createdAt: "3 hours ago",
      likes: 10,
      isLiked: false
    }
  ]);
  
  const post = mockPosts.find(p => p.id === postId);
  const relatedPosts = post 
    ? mockPosts
        .filter(p => p.id !== postId && p.tags.some(tag => post.tags.includes(tag)))
        .slice(0, 3)
    : [];
  
  const popularTags = mockTags.slice(0, 10);

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
      toast({
        description: "Upvote removed",
      });
    } else {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      toast({
        description: "Post upvoted!",
      });
    }
  };

  const handleComment = (content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: "Current User",
      content: content,
      createdAt: "Just now",
      likes: 0,
      isLiked: false
    };
    
    setComments(prevComments => [newComment, ...prevComments]);
    toast({
      description: "Comment posted successfully",
    });
  };

  if (!post) {
    return (
      <MainLayout>
        <div className="container flex flex-col items-center justify-center py-20">
          <h1 className="text-3xl font-bold">Post Not Found</h1>
          <p className="text-muted-foreground mt-2">The post you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-6" asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Posted in{" "}
                      <Link to={`/category/${post.category.toLowerCase()}`} className="font-medium hover:underline">
                        {post.category}
                      </Link>
                      <span className="mx-1">•</span>
                      <time dateTime={post.createdAt}>{post.createdAt}</time>
                    </p>
                  </div>
                </div>
                <h1 className="text-2xl font-bold">{post.title}</h1>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link key={tag} to={`/tag/${tag}`}>
                      <Badge variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none dark:prose-invert">
                  <p>{post.excerpt}</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod mauris ac nunc fermentum, a ullamcorper ipsum maximus. Praesent fringilla arcu et semper luctus.</p>
                  <p>Etiam rutrum, nisi id facilisis malesuada, eros urna egestas sem, at venenatis nisi dui nec magna. Suspendisse potenti. Curabitur eget tempor nisi. Donec vehicula leo ut lectus posuere, at tincidunt ligula facilisis.</p>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>
                      {`function example() {
  const greeting = "Hello world!";
  console.log(greeting);
  return greeting;
}`}
                    </code>
                  </pre>
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      <Button
                        variant={hasUpvoted ? "default" : "outline"}
                        size="icon"
                        onClick={handleUpvote}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="mx-1">{post.upvoteCount + upvotes}</span>
                      <Button variant="outline" size="icon">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.commentCount} comments</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1 text-sm">
                      <Eye className="h-4 w-4" />
                      521 views
                    </span>
                    <Button variant="outline" size="sm">
                      <ArrowUp className="h-4 w-4 mr-1" /> 
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div>
              <h2 className="text-xl font-medium mb-4">Leave a comment</h2>
              <CommentForm onSubmit={handleComment} existingComments={comments} />
            </div>
          </div>
          
          <div className="space-y-6">
            <TagList tags={popularTags} title="Popular Tags" />
            
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-medium">Related Posts</h3>
              <div className="mt-3 space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id}>
                    <Link to={`/post/${relatedPost.id}`} className="font-medium hover:text-primary hover:underline">
                      {relatedPost.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {relatedPost.upvoteCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {relatedPost.commentCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
