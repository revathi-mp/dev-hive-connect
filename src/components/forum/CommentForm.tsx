
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Share, Heart, MessageSquareReply, Eye } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentFormProps {
  onSubmit: (content: string) => void;
  existingComments?: Comment[];
}

export function CommentForm({ onSubmit, existingComments = [] }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [viewComments, setViewComments] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(1); // Initialize with 1 view (the author)
  const [viewedComments, setViewedComments] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Simulate view count increasing when the component mounts
  useEffect(() => {
    // Increment view count automatically when the comments section is loaded
    incrementViewCount();
    
    // Record this view in localStorage to prevent duplicate counts
    const viewKey = `post-view-${window.location.pathname}`;
    const hasViewed = localStorage.getItem(viewKey);
    
    if (!hasViewed) {
      localStorage.setItem(viewKey, 'true');
      // In a real app, you would send an API request to update view count on the server
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onSubmit(content);
    setContent('');
    toast({
      title: "Success",
      description: "Comment posted successfully",
    });
  };

  const handleShare = async (commentId: string) => {
    try {
      // Try to use the native Web Share API
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this comment',
          text: 'I found this interesting comment in a discussion.',
          url: `${window.location.href}#comment-${commentId}`,
        });
        toast({
          description: "Successfully shared the comment",
        });
      } else {
        // Fallback for browsers that don't support native sharing
        throw new Error('Web Share API not supported');
      }
    } catch (error) {
      // Copy to clipboard as fallback
      const shareUrl = `${window.location.href}#comment-${commentId}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        description: "Link copied to clipboard",
      });
    }
  };

  const handleLike = (commentId: string) => {
    const updatedComments = existingComments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked,
        };
      }
      return comment;
    });
    // In a real app, this would update the backend
    toast({
      description: `Comment ${updatedComments.find(c => c.id === commentId)?.isLiked ? 'liked' : 'unliked'}`,
    });
  };

  const handleReply = (commentId: string) => {
    setReplyTo(replyTo === commentId ? null : commentId);
    if (replyTo !== commentId) {
      toast({
        description: "Write your reply below",
      });
    }
  };

  const incrementViewCount = () => {
    setViewCount(prev => prev + 1);
  };

  const handleViewComment = (commentId: string) => {
    // Only count as a new view if not previously viewed
    if (!viewedComments.has(commentId)) {
      const newViewedComments = new Set(viewedComments);
      newViewedComments.add(commentId);
      setViewedComments(newViewedComments);
      
      // In a real app, this would send a request to the backend
      toast({
        description: "Comment view recorded",
      });
    }
  };

  return (
    <div className="space-y-6" id="comments">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder={replyTo ? "Write your reply..." : "Write your comment..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit">{replyTo ? 'Post Reply' : 'Post Comment'}</Button>
        {replyTo && (
          <Button 
            variant="outline" 
            onClick={() => setReplyTo(null)}
            className="ml-2"
          >
            Cancel Reply
          </Button>
        )}
      </form>
      
      {existingComments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium">
                Comments ({existingComments.length})
              </h3>
              <span className="flex items-center text-sm text-muted-foreground">
                <Eye className="h-4 w-4 mr-1" />
                {viewCount} views
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewComments(!viewComments)}
            >
              {viewComments ? 'Hide Comments' : 'Show Comments'}
            </Button>
          </div>
          
          {viewComments && (
            <div className="space-y-4">
              {existingComments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="border rounded-md p-4 bg-card"
                  id={`comment-${comment.id}`}
                  onClick={() => handleViewComment(comment.id)}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                  </div>
                  <p className="mb-2">{comment.content}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-7 px-2 text-xs ${comment.isLiked ? 'text-red-500' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering comment view
                        handleLike(comment.id);
                      }}
                    >
                      <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                      {comment.likes}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering comment view
                        handleReply(comment.id);
                      }}
                    >
                      <MessageSquareReply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering comment view
                        handleShare(comment.id);
                      }}
                    >
                      <Share className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <div className="ml-auto flex items-center text-xs text-muted-foreground">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{viewedComments.has(comment.id) ? '1' : '0'} views</span>
                    </div>
                  </div>
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 mt-2 space-y-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="border-l-2 pl-4 py-2">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-sm">{reply.author}</span>
                            <span className="text-xs text-muted-foreground">{reply.createdAt}</span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {replyTo === comment.id && (
                    <div className="mt-2 ml-6">
                      <Textarea
                        placeholder="Write your reply..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[80px] text-sm"
                      />
                      <div className="mt-2">
                        <Button size="sm" onClick={handleSubmit}>Post Reply</Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setReplyTo(null)}
                          className="ml-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
