
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CommentList } from './CommentList';
import { ReplyForm } from './ReplyForm';
import { Comment } from './types';

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

  return (
    <div className="space-y-6" id="comments">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
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
