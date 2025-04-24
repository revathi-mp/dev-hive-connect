import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CommentList } from './CommentList';
import { ReplyForm } from './ReplyForm';
import { Comment } from './types';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Code } from "lucide-react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  existingComments?: Comment[];
}

export function CommentForm({ onSubmit, existingComments = [] }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(1);
  const [viewedComments, setViewedComments] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    incrementViewCount();
    const viewKey = `post-view-${window.location.pathname}`;
    const hasViewed = localStorage.getItem(viewKey);
    
    if (!hasViewed) {
      localStorage.setItem(viewKey, 'true');
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
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
    setReplyTo(null);
    toast({
      title: "Success",
      description: "Comment posted successfully",
    });
  };

  const handleShare = async (commentId: string) => {
    try {
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
        throw new Error('Web Share API not supported');
      }
    } catch (error) {
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
    if (!viewedComments.has(commentId)) {
      const newViewedComments = new Set(viewedComments);
      newViewedComments.add(commentId);
      setViewedComments(newViewedComments);
      toast({
        description: "Comment view recorded",
      });
    }
  };

  const insertCodeBlock = (language: string) => {
    const codeTemplate = `\`\`\`${language}\n// Your ${language} code here\n\`\`\``;
    
    setContent((prevContent) => {
      return prevContent + (prevContent.length > 0 ? '\n\n' : '') + codeTemplate;
    });
    
    toast({
      description: `${language.toUpperCase()} code block added. Replace the placeholder with your code.`,
    });
  };

  return (
    <div className="space-y-6" id="comments">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute bottom-2 right-2 h-8 w-8"
              >
                <Code className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Add Code Block</h4>
                <div className="grid gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start text-xs"
                    onClick={() => insertCodeBlock('javascript')}
                  >
                    JavaScript
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start text-xs"
                    onClick={() => insertCodeBlock('html')}
                  >
                    HTML
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start text-xs"
                    onClick={() => insertCodeBlock('css')}
                  >
                    CSS
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start text-xs"
                    onClick={() => insertCodeBlock('python')}
                  >
                    Python
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Wrap code in ```language ``` tags
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Button type="submit">Post Comment</Button>
      </form>
      
      {existingComments.length > 0 && (
        <>
          <CommentList
            comments={existingComments}
            viewCount={viewCount}
            onReply={handleReply}
            onLike={handleLike}
            onShare={handleShare}
            onViewComment={handleViewComment}
            viewedComments={viewedComments}
            replyTo={replyTo}
          />
          {replyTo && (
            <ReplyForm
              content={content}
              onChange={setContent}
              onSubmit={handleSubmit}
              onCancel={() => setReplyTo(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
