import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    author: {
      name: string;
      avatar?: string;
    };
    category: string;
    tags: string[];
    commentCount: number;
    upvoteCount: number;
    createdAt: string;
    isHot?: boolean;
  };
}

export function PostCard({ post }: PostCardProps) {
  const [upvotes, setUpvotes] = useState(post.upvoteCount);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const { toast } = useToast();

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
      toast({
        description: "Upvote removed",
      });
    } else {
      if (hasDownvoted) {
        setHasDownvoted(false);
        setUpvotes(prev => prev + 2);
      } else {
        setUpvotes(prev => prev + 1);
      }
      setHasUpvoted(true);
      toast({
        description: "Post upvoted!",
      });
    }
  };

  const handleDownvote = () => {
    if (hasDownvoted) {
      setUpvotes(prev => prev + 1);
      setHasDownvoted(false);
      toast({
        description: "Downvote removed",
      });
    } else {
      if (hasUpvoted) {
        setHasUpvoted(false);
        setUpvotes(prev => prev - 2);
      } else {
        setUpvotes(prev => prev - 1);
      }
      setHasDownvoted(true);
      toast({
        description: "Post downvoted",
      });
    }
  };

  return (
    <article className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2">
        <Link to={`/user/${post.author.name.toLowerCase()}`} className="hover:opacity-80">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="text-sm">
          <Link 
            to={`/user/${post.author.name.toLowerCase()}`}
            className="font-medium hover:text-primary hover:underline"
          >
            {post.author.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            Posted in{" "}
            <Link
              to={`/category/${post.category.toLowerCase()}`}
              className="font-medium text-foreground hover:underline"
            >
              {post.category}
            </Link>
            <span className="mx-1">•</span>
            <time dateTime={post.createdAt}>{post.createdAt}</time>
          </p>
        </div>
      </div>
      <div className="mt-3">
        <Link to={`/post/${post.id}`}>
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight hover:text-primary hover:underline">
            {post.isHot && (
              <Badge variant="secondary" className="mr-2 bg-accent text-accent-foreground">
                Hot
              </Badge>
            )}
            {post.title}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {post.excerpt}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {post.tags.map((tag) => (
            <Link to={`/tag/${tag}`} key={tag}>
              <Badge variant="secondary" className="text-xs">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${hasUpvoted ? 'text-primary' : ''}`}
              onClick={handleUpvote}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span className="mx-1">{upvotes}</span>
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${hasDownvoted ? 'text-destructive' : ''}`}
              onClick={handleDownvote}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
          <Link to={`/post/${post.id}#comments`} className="flex items-center gap-1 text-sm">
            <MessageSquare className="h-4 w-4" />
            {post.commentCount}
          </Link>
        </div>
      </div>
    </article>
  );
}
